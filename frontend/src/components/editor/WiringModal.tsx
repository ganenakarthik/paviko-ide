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
    projectName.toLowerCase().includes('lighthouse') ? 'lighthouse' :
    projectName.toLowerCase().includes('train') || projectName.toLowerCase().includes('car') ? 'train' :
    projectName.toLowerCase().includes('traffic') ? 'traffic' :
    projectName.toLowerCase().includes('servo') ? 'servo' :
    projectName.toLowerCase().includes('weather') || projectName.toLowerCase().includes('dht') ? 'weather' : 'custom'
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
          {currentType === 'lighthouse' && (
            <div className={styles.circuitCard}>
              <div style={{ fontSize: '3rem' }}>🚨</div>
              <div>
                <h3 style={{ margin: 0, color: '#7D0A26', fontWeight: 900 }}>Lighthouse LED Circuit</h3>
                <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.9rem' }}>
                  Connect the long leg (+ anode) of your LED to <strong>GPIO Pin 2</strong> via a 220Ω resistor. Connect the short leg (- cathode) to <strong>GND</strong>.
                </p>
              </div>
            </div>
          )}

          {currentType === 'train' && (
            <div className={styles.circuitCard}>
              <div style={{ fontSize: '3rem' }}>🚂</div>
              <div>
                <h3 style={{ margin: 0, color: '#7D0A26', fontWeight: 900 }}>HC-SR04 Ultrasonic Radar Wiring</h3>
                <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.9rem' }}>
                  Connect <strong>VCC to 5V</strong>, <strong>GND to GND</strong>, <strong>Trig to GPIO 4</strong>, and <strong>Echo to GPIO 5</strong>.
                </p>
              </div>
            </div>
          )}

          {currentType === 'traffic' && (
            <div className={styles.circuitCard}>
              <div style={{ fontSize: '3rem' }}>🚦</div>
              <div>
                <h3 style={{ margin: 0, color: '#7D0A26', fontWeight: 900 }}>3-Color Traffic Light Setup</h3>
                <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.9rem' }}>
                  Red LED ➔ <strong>GPIO 4</strong> | Yellow LED ➔ <strong>GPIO 2</strong> | Green LED ➔ <strong>GPIO 5</strong>. All short legs go to GND!
                </p>
              </div>
            </div>
          )}

          {currentType === 'servo' && (
            <div className={styles.circuitCard}>
              <div style={{ fontSize: '3rem' }}>🤖</div>
              <div>
                <h3 style={{ margin: 0, color: '#7D0A26', fontWeight: 900 }}>SG90 Servo Motor Wiring</h3>
                <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.9rem' }}>
                  Orange (Signal) ➔ <strong>GPIO 13</strong> | Red (VCC) ➔ <strong>5V/VIN</strong> | Brown (GND) ➔ <strong>GND</strong>.
                </p>
              </div>
            </div>
          )}

          {currentType === 'weather' && (
            <div className={styles.circuitCard}>
              <div style={{ fontSize: '3rem' }}>🌡️</div>
              <div>
                <h3 style={{ margin: 0, color: '#7D0A26', fontWeight: 900 }}>DHT11 Temp & Humidity Sensor Setup</h3>
                <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.9rem' }}>
                  VCC (Power) ➔ <strong>3.3V / 5V</strong> | Data Signal ➔ <strong>GPIO Pin 4</strong> | GND ➔ <strong>GND</strong>. (Include 10kΩ pull-up resistor if needed).
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
              <span>Pin 2 (Onboard LED)</span>
              <span className={styles.pinTag}>GPIO 2</span>
            </div>
            <div className={styles.pinPill}>
              <span>Pin 4 (DHT11 Data)</span>
              <span className={styles.pinTag}>GPIO 4</span>
            </div>
            <div className={styles.pinPill}>
              <span>Pin 5 (Green LED)</span>
              <span className={styles.pinTag}>GPIO 5</span>
            </div>
            <div className={styles.pinPill}>
              <span>Pin 12 (Motor)</span>
              <span className={styles.pinTag}>GPIO 12</span>
            </div>
            <div className={styles.pinPill}>
              <span>Pin 13 (Servo PWM)</span>
              <span className={styles.pinTag}>GPIO 13</span>
            </div>
            <div className={styles.pinPill}>
              <span>Power / Ground</span>
              <span className={styles.pinTag}>GND / 3.3V</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
