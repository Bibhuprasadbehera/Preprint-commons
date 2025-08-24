import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './PanSlider.module.css';

const PanSlider = ({ 
  min = 0, 
  max = 100, 
  value = 50, 
  onChange, 
  orientation = 'horizontal',
  disabled = false,
  label = '',
  showValue = false,
  step = 1
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const sliderRef = useRef(null);

  const handleMouseDown = useCallback((event) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsDragging(true);
    setDragStart({
      clientX: event.clientX,
      clientY: event.clientY,
      initialValue: value
    });
  }, [disabled, value]);

  const handleMouseMove = useCallback((event) => {
    if (!isDragging || !dragStart || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let percentage;

    if (orientation === 'horizontal') {
      const deltaX = event.clientX - dragStart.clientX;
      const sliderWidth = rect.width;
      const deltaPercentage = (deltaX / sliderWidth) * 100;
      percentage = ((dragStart.initialValue - min) / (max - min)) * 100 + deltaPercentage;
    } else {
      const deltaY = event.clientY - dragStart.clientY;
      const sliderHeight = rect.height;
      const deltaPercentage = (deltaY / sliderHeight) * 100;
      percentage = ((dragStart.initialValue - min) / (max - min)) * 100 - deltaPercentage; // Inverted for vertical
    }

    percentage = Math.max(0, Math.min(100, percentage));
    const newValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    if (onChange && steppedValue !== value) {
      onChange(Math.max(min, Math.min(max, steppedValue)));
    }
  }, [isDragging, dragStart, orientation, min, max, step, value, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const handleSliderClick = useCallback((event) => {
    if (disabled || isDragging) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let percentage;

    if (orientation === 'horizontal') {
      const clickX = event.clientX - rect.left;
      percentage = (clickX / rect.width) * 100;
    } else {
      const clickY = event.clientY - rect.top;
      percentage = 100 - (clickY / rect.height) * 100; // Inverted for vertical
    }

    percentage = Math.max(0, Math.min(100, percentage));
    const newValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    if (onChange) {
      onChange(Math.max(min, Math.min(max, steppedValue)));
    }
  }, [disabled, isDragging, orientation, min, max, step, onChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = orientation === 'horizontal' ? 'ew-resize' : 'ns-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, orientation]);

  const percentage = ((value - min) / (max - min)) * 100;
  const sliderClasses = `${styles.slider} ${styles[orientation]} ${disabled ? styles.disabled : ''}`;
  const thumbStyle = orientation === 'horizontal' 
    ? { left: `${percentage}%` }
    : { bottom: `${percentage}%` };

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {showValue && <span className={styles.value}>({value})</span>}
        </label>
      )}
      <div 
        ref={sliderRef}
        className={sliderClasses}
        onClick={handleSliderClick}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label || 'Pan slider'}
        tabIndex={disabled ? -1 : 0}
      >
        <div className={styles.track}>
          <div 
            className={styles.fill}
            style={orientation === 'horizontal' 
              ? { width: `${percentage}%` }
              : { height: `${percentage}%` }
            }
          />
        </div>
        <div 
          className={styles.thumb}
          style={thumbStyle}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default PanSlider;