import React from 'react';
import styles from './Card.module.css';

const Card = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => (
  <div className={`${styles.content} ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`${styles.header} ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`${styles.footer} ${className}`}>
    {children}
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description, className = '' }) => (
  <div className={`${styles.featureCard} ${className}`}>
    <div className={styles.featureIcon}>
      {icon}
    </div>
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureDescription}>{description}</p>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, author, className = '' }) => (
  <div className={`${styles.testimonialCard} ${className}`}>
    <blockquote className={styles.testimonialQuote}>
      {quote}
    </blockquote>
    <cite className={styles.testimonialAuthor}>
      {author}
    </cite>
  </div>
);

Card.Content = CardContent;
Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.Feature = FeatureCard;
Card.Testimonial = TestimonialCard;

export default Card;