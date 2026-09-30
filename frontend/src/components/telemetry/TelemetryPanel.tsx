import React from 'react';
import { useEditorStore } from '../../store';
import styles from './TelemetryPanel.module.css';

export default function TelemetryPanel() {
  const { 
    activeTemplate, 
    projectName, 
    hardwareServoAngle, 
    hardwareDistance, 
    hardwareTemp, 
    hardwareHumidity,
    isHardwareConnected 
  } = useEditorStore();

  const isSteering = activeTemplate === 'steering' || projectName.toLowerCase().includes('steering');
  const isRadar = activeTemplate === 'radar' || projectName.toLowerCase().includes('radar');

  const angle = hardwareServoAngle !== null ? hardwareServoAngle : 90;
  const distance = hardwareDistance !== null ? hardwareDistance : 25;
  const speed = isSteering ? 60 : 0;

  const statusText = isHardwareConnected 
    ? 'LIVE HARDWARE CONNECTED 🟢' 
    : isSteering 
    ? 'STEERING READY 🚗' 
    : isRadar 
    ? 'RADAR SCANNING 📡' 
    : 'PAVIBOT ACTIVE 🤖';

  return (
    <div className={styles.telemetryContainer}>
      <div className={styles.headerTitle}>
        ⚡ LIVE TELEMETRY
      </div>

      {/* PUFFY CLAY METRIC CARD 1: STEERING ANGLE */}
      <div className={styles.metricCard}>
        <div className={styles.cardIcon}>🔄</div>
        <div className={styles.cardInfo}>
          <span className={styles.cardLabel}>STEERING ANGLE</span>
          <span className={styles.cardValue} style={{ color: '#5A0B1A' }}>
            {angle}° <small>({angle < 75 ? 'Left ◀' : angle > 105 ? 'Right ▶' : 'Center ⬆'})</small>
          </span>
        </div>
      </div>

      {/* PUFFY CLAY METRIC CARD 2: DISTANCE */}
      <div className={styles.metricCard}>
        <div className={styles.cardIcon}>📡</div>
        <div className={styles.cardInfo}>
          <span className={styles.cardLabel}>DISTANCE (CM)</span>
          <span className={styles.cardValue} style={{ color: distance < 20 ? '#E74C3C' : '#27AE60' }}>
            {distance} cm {distance < 20 ? '🛑' : '🟢'}
          </span>
        </div>
      </div>

      {/* PUFFY CLAY METRIC CARD 3: SPEED */}
      <div className={styles.metricCard}>
        <div className={styles.cardIcon}>🏎️</div>
        <div className={styles.cardInfo}>
          <span className={styles.cardLabel}>MOTOR SPEED</span>
          <span className={styles.cardValue} style={{ color: '#2980B9' }}>
            {speed}%
          </span>
        </div>
      </div>

      {/* PUFFY CLAY METRIC CARD 4: STATUS */}
      <div className={styles.metricCard}>
        <div className={styles.cardIcon}>⚡</div>
        <div className={styles.cardInfo}>
          <span className={styles.cardLabel}>SYSTEM STATUS</span>
          <span className={styles.cardStatusBadge} style={{ background: isHardwareConnected ? '#2ECC71' : '#5A0B1A' }}>
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
}
