import React from 'react';
import styles from './ClayLoader.module.css';

interface ClayLoaderProps {
  message?: string;
  subtext?: string;
}

export function ClayLoader({ message = 'Loading...', subtext }: ClayLoaderProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.loaderCard}>
        <div className={styles.spinnerContainer}>
          <div className={styles.clayRing} />
          <div className={styles.centerIcon}>⚡</div>
        </div>
        <div className={styles.message}>{message}</div>
        {subtext && <div className={styles.subtext}>{subtext}</div>}
      </div>
    </div>
  );
}
