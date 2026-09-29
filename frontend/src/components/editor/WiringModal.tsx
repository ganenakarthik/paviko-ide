import React from 'react';
import { useEditorStore } from '../../store';
import styles from './WiringModal.module.css';

interface WiringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WiringModal({ isOpen, onClose }: WiringModalProps) {
  const { activeTemplate, projectName } = useEditorStore();

  if (!isOpen) return null;

  const currentType = activeTemplate || (
    projectName.toLowerCase().includes('steering') || projectName.toLowerCase().includes('wheel') ? 'steering' :
    projectName.toLowerCase().includes('pavibot') || projectName.toLowerCase().includes('bot') || projectName.toLowerCase().includes('groot') ? 'pavibot' : 'custom'
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            🔌 Hardware Wiring Guide: {projectName}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {/* Project Specific Circuit Setup */}
          {currentType === 'steering' && (
            <div className={styles.circuitCard}>
              <div style={{ fontSize: '3rem' }}>🚗</div>
              <div>
                <h3 style={{ margin: 0, color: '#7D0A26', fontWeight: 900 }}>Smart Steering Wheel Wiring</h3>
                <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.9rem' }}>
                  Servo Steering Angle ➔ <strong>GPIO 13</strong> | Motor Drive Speed ➔ <strong>GPIO 12</strong> | Power ➔ <strong>5V & GND</strong>.
                </p>
              </div>
            </div>
          )}

          {currentType === 'pavibot' && (
            <div className={styles.circuitCard}>
              <div style={{ fontSize: '3rem' }}>🤖</div>
              <div>
                <h3 style={{ margin: 0, color: '#7D0A26', fontWeight: 900 }}>Pavibot OLED & Sensors Wiring</h3>
                <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.9rem' }}>
                  OLED SDA ➔ <strong>GPIO 21</strong> | OLED SCL ➔ <strong>GPIO 22</strong> | DHT11 Sensor ➔ <strong>GPIO 4</strong> | Power ➔ <strong>3.3V & GND</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Standard ESP32 Pinout Grid */}
          <div style={{ fontWeight: 900, color: '#7D0A26', fontSize: '1rem', marginTop: 10 }}>
            📌 ESP32 DevKit V1 Main Pin Assignment:
          </div>

          <div className={styles.pinGrid}>
            <div className={styles.pinPill}>
              <span>Pin 21 (I2C OLED SDA)</span>
              <span className={styles.pinTag}>GPIO 21</span>
            </div>
            <div className={styles.pinPill}>
              <span>Pin 22 (I2C OLED SCL)</span>
              <span className={styles.pinTag}>GPIO 22</span>
            </div>
            <div className={styles.pinPill}>
              <span>Pin 13 (Servo Steering PWM)</span>
              <span className={styles.pinTag}>GPIO 13</span>
            </div>
            <div className={styles.pinPill}>
              <span>Pin 12 (Motor Drive PWM)</span>
              <span className={styles.pinTag}>GPIO 12</span>
            </div>
            <div className={styles.pinPill}>
              <span>Pin 4 (DHT11 Data)</span>
              <span className={styles.pinTag}>GPIO 4</span>
            </div>
            <div className={styles.pinPill}>
              <span>Power / Ground</span>
              <span className={styles.pinTag}>GND / 3.3V / 5V</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
