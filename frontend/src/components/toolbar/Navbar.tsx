import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../../store';
import WiringModal from '../editor/WiringModal';
import ProjectSettingsModal from '../editor/ProjectSettingsModal';
import AIAssistantDrawer from '../copilot/AIAssistantDrawer';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { isHardwareConnected, setIsHardwareConnected, projectName, addTerminalLog } = useEditorStore();
  
  const [isWiringOpen, setIsWiringOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleHome = () => {
    navigate('/');
  };

  const handleToggleHardware = () => {
    const nextState = !isHardwareConnected;
    setIsHardwareConnected(nextState);
    if (nextState) {
      addTerminalLog('[Hardware] 🔌 WebSerial connected to ESP32 DevKit V1 on COM3 (115200 baud).', 'success');
    } else {
      addTerminalLog('[Hardware] 🔌 USB Hardware disconnected. Switching to 3D Simulator mode.', 'info');
    }
  };

  return (
    <>
      <header className={styles.topBar}>
        {/* LEFT AREA: BRAND LOGO & PROJECT TITLE PILL */}
        <div className={styles.leftGroup}>
          <div className={styles.brandBox} onClick={handleHome} title="Go to Dashboard">
            <img src="/logo.jpg" alt="Paviko Logo" className={styles.brandLogo} />
            <span className={styles.brandName}>PAVIKO STUDIO</span>
          </div>

          <div className={styles.projectPill}>
            <span className={styles.projectDot} />
            <span className={styles.projectText}>{projectName}</span>
          </div>
        </div>

        {/* RIGHT AREA: UNIFORM CLAY PILL ACTIONS & CIRCULAR BADGES */}
        <div className={styles.rightGroup}>
          {/* HARDWARE MAP */}
          <button className={`${styles.pillBtn} ${styles.whitePill}`} onClick={() => setIsWiringOpen(true)}>
            🔌 Hardware Map
          </button>

          {/* AI SUPERCHARGER */}
          <button className={`${styles.pillBtn} ${styles.whitePill}`} onClick={() => setIsAiOpen(true)}>
            🤖 AI Supercharger
          </button>

          {/* CONNECT HARDWARE (High-Contrast White or Green Pill - No Bright Orange Alert!) */}
          <button 
            className={`${styles.pillBtn} ${isHardwareConnected ? styles.greenPill : styles.whitePill}`}
            onClick={handleToggleHardware}
            title="Click to toggle USB Hardware connection"
          >
            <span className={styles.statusDot} style={{ background: isHardwareConnected ? '#FFF' : '#2ECC71' }} />
            {isHardwareConnected ? 'Kit Connected' : 'Connect Hardware'}
          </button>

          {/* CIRCULAR BADGE ICONS (Clean 36px, No Clipping!) */}
          <div className={styles.iconBadgeGroup}>
            <button 
              className={styles.circleIconBtn}
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                addTerminalLog(`[System] Sound effects ${!soundEnabled ? 'ENABLED' : 'MUTED'}.`, 'info');
              }} 
              title="Toggle Sound"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            <button className={styles.circleIconBtn} onClick={() => setIsSettingsOpen(true)} title="Settings">
              ⚙️
            </button>

            <button className={styles.circleIconBtn} onClick={handleHome} title="Home Dashboard">
              🏠
            </button>
          </div>
        </div>
      </header>

      {/* MODALS & DRAWERS */}
      <WiringModal isOpen={isWiringOpen} onClose={() => setIsWiringOpen(false)} />
      <ProjectSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AIAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );
}
