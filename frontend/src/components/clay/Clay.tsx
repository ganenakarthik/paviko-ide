import React, { useState } from 'react';
import styles from './Clay.module.css';

export function ClayButton({ 
  children, 
  variant = 'maroon', 
  size = 'md', 
  className = '', 
  onClick,
  disabled
}: { 
  children: React.ReactNode; 
  variant?: 'maroon' | 'white'; 
  size?: 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const btnClass = variant === 'maroon' ? styles.btnMaroon : styles.btnWhite;
  const sizeClass = size === 'lg' ? styles.btnLg : '';
  
  return (
    <button 
      className={`${styles.btn} ${btnClass} ${sizeClass} ${className}`} 
      onClick={onClick}
      disabled={disabled}
      style={{ opacity: disabled ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  );
}

export function ClayToggle({ 
  label, 
  color = 'blue', 
  initialState = false 
}: { 
  label: string; 
  color?: 'blue' | 'green' | 'maroon'; 
  initialState?: boolean;
}) {
  const [isOn, setIsOn] = useState(initialState);
  
  return (
    <div className={styles.toggleWrapper} onClick={() => setIsOn(!isOn)}>
      <span className={styles.toggleLabelLeft}>{label}</span>
      <div className={`${styles.toggleTrack} ${styles[color]} ${isOn ? styles.on : ''}`}>
        <div className={styles.toggleThumb} />
      </div>
    </div>
  );
}

export function ClaySlider({ 
  label, 
  color = 'blue',
  defaultValue = 50
}: { 
  label: string; 
  color?: 'blue' | 'green' | 'maroon';
  defaultValue?: number;
}) {
  const [val, setVal] = useState(defaultValue);

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.sliderLabelRow}>
        <span>{label}</span>
      </div>
      <div className={`${styles.sliderTrack} ${styles[color]}`}>
        {/* Simple visual thumb positioning, not a real input type=range for this visual mockup */}
        <div className={styles.sliderThumb} style={{ left: `calc(${val}% - 12px)` }} />
      </div>
    </div>
  );
}
