import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../../store';
import WiringModal from '../editor/WiringModal';
import ProjectSettingsModal from '../editor/ProjectSettingsModal';
import AIAssistantDrawer from '../copilot/AIAssistantDrawer';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { isHardwareConnected, setIsHardwareConnected, projectName, activeTemplate, addTerminalLog } = useEditorStore();
  
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
        {/* LEFT AREA: LOGO & TITLE */}
        <div className={styles.leftArea}>
          <div className={styles.logoBadge} onClick={handleHome} title="Go to Dashboard">
            <img src="/logo.jpg" alt="Paviko Logo" className={styles.logoImg} />
            <span className={styles.logoTitle}>PAVIKO STUDIO</span>
          </div>

          <div className={styles.projectPill}>
            <span className={styles.projectDot} />
            <span className={styles.projectName}>{projectName}</span>
          </div>
        </div>

        {/* RIGHT AREA: CLAY PILL BUTTONS */}
        <div className={styles.rightArea}>
          {/* HARDWARE MAP PILL BUTTON */}
          <button className={`${styles.pillBtn} ${styles.whitePill}`} onClick={() => setIsWiringOpen(true)}>
            🔌 Hardware Map
          </button>

          {/* AI SUPERCHARGER PILL BUTTON */}
          <button className={`${styles.pillBtn} ${styles.whitePill}`} onClick={() => setIsAiOpen(true)}>
            🤖 AI Supercharger
          </button>

          {/* KIT CONNECTED / DISCONNECTED GREEN PILL */}
          <button 
            className={`${styles.pillBtn} ${isHardwareConnected ? styles.greenConnectedPill : styles.redDisconnectedPill}`}
            onClick={handleToggleHardware}
            title="Click to toggle simulated USB Serial ESP32 connection"
          >
            <span className={styles.statusDot} style={{ background: isHardwareConnected ? '#FFF' : '#FFD700' }} />
            {isHardwareConnected ? 'Kit Connected' : 'Connect Hardware'}
          </button>

          {/* SOUND TOGGLE */}
          <button 
            className={styles.iconCircleBtn}
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              addTerminalLog(`[System] Sound effects ${!soundEnabled ? 'ENABLED' : 'MUTED'}.`, 'info');
            }} 
            title="Toggle Sound Effects"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          
          {/* SETTINGS */}
          <button className={styles.iconCircleBtn} onClick={() => setIsSettingsOpen(true)} title="Project Settings & Export">
            ⚙️
          </button>

          {/* DASHBOARD HOME */}
          <button className={styles.iconCircleBtn} onClick={handleHome} title="Return to Dashboard">
            🏠
          </button>
        </div>
      </header>

      {/* MODALS & DRAWERS */}
      <WiringModal isOpen={isWiringOpen} onClose={() => setIsWiringOpen(false)} />
      <ProjectSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AIAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );
}
