import React, { useEffect, useRef, useState, useCallback } from 'react';
import ZoomControls from './ZoomControls/ZoomControls';
import styles from './CitationScatterChart.module.css';

const CitationScatterChart = ({ data, loading = false }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [zoomState, setZoomState] = useState({
    minDate: null,
    maxDate: null,
    originalMinDate: null,
    originalMaxDate: null,
    minCitations: null,
    maxCitations: null
  });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

  // Calculate date and citation ranges from data
  useEffect(() => {
    if (data && data.length > 0) {
      const dates = data.map(paper => new Date(paper.publication_date).getTime());
      const citations = data.map(paper => paper.total_citation);
      
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      const minCitations = 0; // Start y-axis at 0
      const maxCitations = Math.max(...citations);
      
      setZoomState(prev => ({
        ...prev,
        minDate: prev.originalMinDate || minDate,
        maxDate: prev.originalMaxDate || maxDate,
        originalMinDate: prev.originalMinDate || minDate,
        originalMaxDate: prev.originalMaxDate || maxDate,
        minCitations: minCitations,
        maxCitations: maxCitations
      }));
    }
  }, [data]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(400, rect.width - 32),
          height: 400
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw the chart
  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = dimensions;
    
    // Set canvas size
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart margins
    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate scales
    const xScale = (date) => {
      const range = zoomState.maxDate - zoomState.minDate;
      return margin.left + ((date - zoomState.minDate) / range) * chartWidth;
    };

    const yScale = (citations) => {
      const range = zoomState.maxCitations - zoomState.minCitations;
      return margin.top + chartHeight - ((citations - zoomState.minCitations) / range) * chartHeight;
    };

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;

    // Vertical grid lines (dates)
    const dateRange = zoomState.maxDate - zoomState.minDate;
    const yearSpan = dateRange / (365.25 * 24 * 60 * 60 * 1000);
    const gridLines = Math.min(10, Math.max(3, Math.floor(yearSpan)));
    
    for (let i = 0; i <= gridLines; i++) {
      const date = zoomState.minDate + (dateRange * i / gridLines);
      const x = xScale(date);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, height - margin.bottom);
      ctx.stroke();
    }

    // Horizontal grid lines (citations)
    const citationRange = zoomState.maxCitations - zoomState.minCitations;
    const citationGridLines = 5;
    
    for (let i = 0; i <= citationGridLines; i++) {
      const citations = zoomState.minCitations + (citationRange * i / citationGridLines);
      const y = yScale(citations);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(width - margin.right, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';

    // X-axis labels (dates)
    for (let i = 0; i <= gridLines; i++) {
      const date = zoomState.minDate + (dateRange * i / gridLines);
      const x = xScale(date);
      const dateObj = new Date(date);
      const label = dateObj.getFullYear().toString();
      ctx.fillText(label, x, height - margin.bottom + 20);
    }

    // Y-axis labels (citations)
    ctx.textAlign = 'right';
    for (let i = 0; i <= citationGridLines; i++) {
      const citations = Math.round(zoomState.minCitations + (citationRange * i / citationGridLines));
      const y = yScale(citations);
      ctx.fillText(citations.toString(), margin.left - 10, y + 4);
    }

    // Axis titles
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis title
    ctx.fillText('Publication Date', width / 2, height - 10);
    
    // Y-axis title (rotated)
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Citation Count', 0, 0);
    ctx.restore();

    // Draw data points
    data.forEach((paper, index) => {
      const date = new Date(paper.publication_date).getTime();
      const citations = paper.total_citation;
      
      // Skip points outside zoom range
      if (date < zoomState.minDate || date > zoomState.maxDate) return;
      
      const x = xScale(date);
      const y = yScale(citations);
      
      // Point styling
      const isHovered = hoveredPoint === index;
      const radius = isHovered ? 8 : 6;
      const fillColor = isHovered ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.7)';
      const strokeColor = isHovered ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 0.9)';
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [data, dimensions, zoomState, hoveredPoint]);

  // Handle mouse events
  const handleMouseMove = useCallback((event) => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const chartWidth = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    // Find closest point
    let closestIndex = -1;
    let closestDistance = Infinity;

    data.forEach((paper, index) => {
      const date = new Date(paper.publication_date).getTime();
      const citations = paper.total_citation;
      
      if (date < zoomState.minDate || date > zoomState.maxDate) return;
      
      const dateRange = zoomState.maxDate - zoomState.minDate;
      const citationRange = zoomState.maxCitations - zoomState.minCitations;
      
      const pointX = margin.left + ((date - zoomState.minDate) / dateRange) * chartWidth;
      const pointY = margin.top + chartHeight - ((citations - zoomState.minCitations) / citationRange) * chartHeight;
      
      const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);
      
      if (distance < 15 && distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== -1 && closestIndex !== hoveredPoint) {
      setHoveredPoint(closestIndex);
      setTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY,
        data: data[closestIndex]
      });
    } else if (closestIndex === -1) {
      setHoveredPoint(null);
      setTooltip({ show: false, x: 0, y: 0, data: null });
    }
  }, [data, dimensions, zoomState, hoveredPoint]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
    setTooltip({ show: false, x: 0, y: 0, data: null });
  }, []);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    const currentRange = zoomState.maxDate - zoomState.minDate;
    const zoomFactor = 0.7;
    const newRange = currentRange * zoomFactor;
    const center = (zoomState.minDate + zoomState.maxDate) / 2;
    
    const newMinDate = Math.max(zoomState.originalMinDate, center - newRange / 2);
    const newMaxDate = Math.min(zoomState.originalMaxDate, center + newRange / 2);
    
    setZoomState(prev => ({ ...prev, minDate: newMinDate, maxDate: newMaxDate }));
  }, [zoomState]);

  const handleZoomOut = useCallback(() => {
    const currentRange = zoomState.maxDate - zoomState.minDate;
    const zoomFactor = 1.3;
    const newRange = Math.min(
      currentRange * zoomFactor,
      zoomState.originalMaxDate - zoomState.originalMinDate
    );
    const center = (zoomState.minDate + zoomState.maxDate) / 2;
    
    const newMinDate = Math.max(zoomState.originalMinDate, center - newRange / 2);
    const newMaxDate = Math.min(zoomState.originalMaxDate, center + newRange / 2);
    
    setZoomState(prev => ({ ...prev, minDate: newMinDate, maxDate: newMaxDate }));
  }, [zoomState]);

  const handleReset = useCallback(() => {
    setZoomState(prev => ({
      ...prev,
      minDate: prev.originalMinDate,
      maxDate: prev.originalMaxDate
    }));
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading citation impact data...</p>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>No citation impact data available for the selected filters.</p>
        <p className={styles.emptyHint}>Try adjusting your search criteria.</p>
      </div>
    );
  }

  const isZoomedIn = zoomState.minDate !== zoomState.originalMinDate || 
                     zoomState.maxDate !== zoomState.originalMaxDate;

  return (
    <div className={styles.chartContainer} ref={containerRef}>
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        disabled={loading}
      />
      <canvas
        ref={canvasRef}
        className={styles.chartCanvas}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {isZoomedIn && (
        <div className={styles.zoomInfo}>
          Showing dates {new Date(zoomState.minDate).toLocaleDateString()} - {new Date(zoomState.maxDate).toLocaleDateString()}
        </div>
      )}
      {tooltip.show && tooltip.data && (
        <div 
          className={styles.tooltip}
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            position: 'fixed',
            zIndex: 1000
          }}
        >
          <div className={styles.tooltipTitle}>
            {tooltip.data.preprint_title}
          </div>
          <div className={styles.tooltipContent}>
            <div>Date: {new Date(tooltip.data.publication_date).toLocaleDateString()}</div>
            <div>Citations: {tooltip.data.total_citation}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitationScatterChart;
