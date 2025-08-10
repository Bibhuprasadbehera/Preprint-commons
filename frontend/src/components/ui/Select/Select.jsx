import React from 'react';
import styles from './Select.module.css';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <select
      className={`${styles.select} ${className}`}
      value={value || ''}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;