import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ZoomControls from './chartsFeatures/ZoomControls/ZoomControls';
import PanSlider from './chartsFeatures/PanSlider/PanSlider';
import styles from './CitationScatterChart.module.css';

const CitationScatterChart = ({ data, loading = false }) => {
  const navigate = useNavigate();
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
  const [panPosition, setPanPosition] = useState(50);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });
  const [dataSignature, setDataSignature] = useState('');

  // Helper functions for axis calculations
  const calculateDataSignature = useCallback((data) => {
    if (!data || data.length === 0) return '';
    const dates = data.map(paper => new Date(paper.publication_date).getTime()).sort();
    const citations = data.map(paper => paper.total_citation).sort((a, b) => b - a);
    return `${data.length}-${dates[0]}-${dates[dates.length - 1]}-${citations[0]}-${citations[citations.length - 1]}`;
  }, []);

  const areRangesDifferent = useCallback((range1, range2, threshold = 0.3) => {
    if (!range1 || !range2) return true;
    const range1Span = range1.maxDate - range1.minDate;
    const range2Span = range2.maxDate - range2.minDate;
    const overlapStart = Math.max(range1.minDate, range2.minDate);
    const overlapEnd = Math.min(range1.maxDate, range2.maxDate);
    const overlapSpan = Math.max(0, overlapEnd - overlapStart);
    const minSpan = Math.min(range1Span, range2Span);
    const overlapRatio = overlapSpan / minSpan;
    return overlapRatio < (1 - threshold);
  }, []);

  // Calculate date and citation ranges from data with proper reset logic
  useEffect(() => {
    if (!data || data.length === 0) {
      setZoomState({
        minDate: null,
        maxDate: null,
        originalMinDate: null,
        originalMaxDate: null,
        minCitations: null,
        maxCitations: null
      });
      setDataSignature('');
      return;
    }

    const newSignature = calculateDataSignature(data);
    const isNewData = newSignature !== dataSignature;
    
    if (isNewData) {
      console.log('📊 New data detected, recalculating chart ranges');
      
      // Calculate date range with padding
      const dates = data.map(paper => new Date(paper.publication_date).getTime());
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      const dateRange = maxDate - minDate;
      const datePadding = Math.max(dateRange * 0.05, 365.25 * 24 * 60 * 60 * 1000);
      
      // Calculate citation range
      const citations = data.map(paper => paper.total_citation || 0);
      const maxCitations = Math.max(...citations);
      const paddedMaxCitations = Math.max(maxCitations * 1.1, 10);
      
      const newDateRange = {
        minDate: minDate - datePadding,
        maxDate: maxDate + datePadding,
        originalMinDate: minDate,
        originalMaxDate: maxDate
      };
      
      // Check if we should reset zoom
      const currentDateRange = {
        minDate: zoomState.originalMinDate,
        maxDate: zoomState.originalMaxDate
      };
      
      const shouldResetZoom = !zoomState.originalMinDate || 
                             areRangesDifferent(newDateRange, currentDateRange, 0.3);
      
      if (shouldResetZoom) {
        console.log('🔄 Resetting zoom due to significantly different data ranges');
        setZoomState({
          minDate: newDateRange.minDate,
          maxDate: newDateRange.maxDate,
          originalMinDate: newDateRange.minDate,
          originalMaxDate: newDateRange.maxDate,
          minCitations: 0,
          maxCitations: paddedMaxCitations
        });
        setPanPosition(50);
      } else {
        // Update citation range but preserve date zoom if similar
        setZoomState(prev => ({
          ...prev,
          minCitations: 0,
          maxCitations: paddedMaxCitations
        }));
      }
      
      setDataSignature(newSignature);
    }
  }, [data, dataSignature, calculateDataSignature, areRangesDifferent, zoomState.originalMinDate, zoomState.originalMaxDate]);

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
    if (!canvasRef.current || !data || data.length === 0 || !zoomState.minDate) return;

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
    
    // X-axis title - moved down for better visibility
    ctx.fillText('Publication Date', width / 2, height - 20);
    
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
      
      // Calculate smart tooltip position
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipWidth = 350; // Actual tooltip width
      const tooltipHeight = 120; // Approximate tooltip height
      const offset = 15; // Offset from cursor
      
      // Determine if cursor is on right or left half of screen
      const isRightSide = event.clientX > viewportWidth / 2;
      
      // Calculate horizontal position
      let tooltipX, translateX;
      
      if (isRightSide) {
        // On right side: show tooltip to the LEFT of cursor
        tooltipX = event.clientX - offset;
        translateX = -100; // Align right edge to cursor
      } else {
        // On left side: show tooltip to the RIGHT of cursor
        tooltipX = event.clientX + offset;
        translateX = -100; // Align left edge to cursor
      }
      
      // Calculate vertical position - always above cursor
      let tooltipY = event.clientY - tooltipHeight - offset;
      let translateY = -100;
      
      // If too close to top edge, show below cursor instead
      if (event.clientY < tooltipHeight + 20) {
        tooltipY = event.clientY + offset;
        translateY = 0;
      }
      
      setTooltip({
        show: true,
        x: tooltipX,
        y: tooltipY,
        translateX,
        translateY,
        data: data[closestIndex]
      });
    } else if (closestIndex === -1) {
      setHoveredPoint(null);
      setTooltip({ show: false, x: 0, y: 0, translateX: -50, translateY: -50, data: null });
    }
  }, [data, dimensions, zoomState, hoveredPoint]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
    setTooltip({ show: false, x: 0, y: 0, data: null });
  }, []);

  // Handle click events
  const handleClick = useCallback((event) => {
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

    if (closestIndex !== -1) {
      const paper = data[closestIndex];
      // Open paper details in new tab
      window.open(`/paper/${paper.PPC_Id}`, '_blank');
    }
  }, [data, dimensions, zoomState]);

  // Calculate pan range based on zoom level
  const calculatePanRange = useCallback(() => {
    if (!zoomState.originalMinDate || !zoomState.originalMaxDate) return { min: 0, max: 100 };
    
    const originalRange = zoomState.originalMaxDate - zoomState.originalMinDate;
    const currentRange = zoomState.maxDate - zoomState.minDate;
    const zoomRatio = currentRange / originalRange;
    
    // If fully zoomed out, no panning needed
    if (zoomRatio >= 1) return { min: 50, max: 50 };
    
    // Calculate how much we can pan
    const maxPanRange = originalRange - currentRange;
    const currentPanOffset = zoomState.minDate - zoomState.originalMinDate;
    const panPercentage = maxPanRange > 0 ? (currentPanOffset / maxPanRange) * 100 : 50;
    
    return { min: 0, max: 100, current: Math.max(0, Math.min(100, panPercentage)) };
  }, [zoomState]);

  // Update pan position when zoom changes
  useEffect(() => {
    const panRange = calculatePanRange();
    setPanPosition(panRange.current || 50);
  }, [calculatePanRange]);

  // Handle pan slider change
  const handlePanChange = useCallback((newPanPosition) => {
    if (!zoomState.originalMinDate || !zoomState.originalMaxDate) return;
    
    const originalRange = zoomState.originalMaxDate - zoomState.originalMinDate;
    const currentRange = zoomState.maxDate - zoomState.minDate;
    const maxPanRange = originalRange - currentRange;
    
    if (maxPanRange <= 0) return; // Can't pan if not zoomed
    
    const panOffset = (newPanPosition / 100) * maxPanRange;
    const newMinDate = zoomState.originalMinDate + panOffset;
    const newMaxDate = newMinDate + currentRange;
    
    setZoomState(prev => ({
      ...prev,
      minDate: newMinDate,
      maxDate: newMaxDate
    }));
    
    setPanPosition(newPanPosition);
  }, [zoomState]);

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
    setPanPosition(50);
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
  
  const panRange = calculatePanRange();
  const canPan = panRange.max > panRange.min;

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
        onClick={handleClick}
        style={{ cursor: hoveredPoint !== null ? 'pointer' : 'default' }}
      />
      {isZoomedIn && canPan && (
        <div className={styles.panSliderContainer}>
          <PanSlider
            min={0}
            max={100}
            value={panPosition}
            onChange={handlePanChange}
            orientation="horizontal"
            disabled={loading || !canPan}
            label="Pan Timeline"
            showValue={false}
            step={0.1}
          />
        </div>
      )}
      {isZoomedIn && (
        <div className={styles.zoomInfo}>
          Showing dates {new Date(zoomState.minDate).toLocaleDateString()} - {new Date(zoomState.maxDate).toLocaleDateString()}
        </div>
      )}
      {tooltip.show && tooltip.data && (
        <div 
          className={styles.tooltip}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            position: 'fixed',
            zIndex: 1000,
            transform: `translate(${tooltip.translateX}%, ${tooltip.translateY}%)`
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