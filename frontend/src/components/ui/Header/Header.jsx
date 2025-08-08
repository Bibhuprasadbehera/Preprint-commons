import React from 'react';
import styles from './Header.module.css';

const Header = ({ 
  title, 
  subtitle, 
  className = '',
  centered = true,
  variant = 'page', // 'page', 'section'
  size = 'large' // 'small', 'medium', 'large'
}) => {
  const HeaderTag = variant === 'page' ? 'h1' : 'h2';
  
  return (
    <div className={`${styles.header} ${styles[variant]} ${centered ? styles.centered : ''} ${styles[size]} ${className}`}>
      <HeaderTag className={styles.title}>{title}</HeaderTag>
      {subtitle && (
        <p className={styles.subtitle}>{subtitle}</p>
      )}
    </div>
  );
};

export default Header;