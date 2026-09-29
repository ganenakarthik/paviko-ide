import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../../store';
import WiringModal from '../editor/WiringModal';
import ProjectSettingsModal from '../editor/ProjectSettingsModal';
import AIAssistantDrawer from '../copilot/AIAssistantDrawer';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { isHardwareConnected, projectName, addTerminalLog } = useEditorStore();
  
  const [isWiringOpen, setIsWiringOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleHome = () => {
    navigate('/');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <img src="/logo.jpg" alt="Paviko Logo" className={styles.logoImage} onClick={handleHome} style={{cursor: 'pointer'}} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: '#7D0A26', marginLeft: '12px' }}>
            {projectName}
          </span>
        </div>

        <div className={styles.menuArea}>
          <button className={styles.menuBtn} onClick={() => setIsSettingsOpen(true)}>⚙️ Project Settings & Export</button>
          <button className={styles.menuBtn} onClick={() => setIsWiringOpen(true)}>🔌 Hardware Wiring Guide</button>
          <button className={styles.menuBtn} onClick={() => setIsAiOpen(true)}>🤖 AI Supercharger</button>
        </div>

        <div className={styles.rightArea}>
          <div className={styles.statusPill} style={{ background: isHardwareConnected ? '#a2e8c2' : '#eab8b1', color: isHardwareConnected ? '#1a5e30' : '#7D0A26' }}>
            <span className={styles.statusDot} style={{ background: isHardwareConnected ? '#2ecc71' : '#d9534f' }}></span> 
            {isHardwareConnected ? 'Kit Connected' : 'No Kit Connected'}
          </div>

          <button 
            className={styles.iconBtn} 
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              addTerminalLog(`[System] Sound effects ${!soundEnabled ? 'ENABLED' : 'MUTED'}.`, 'info');
            }} 
            title="Toggle Sound Effects"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          
          <button className={styles.iconBtn} onClick={() => setIsAiOpen(true)} title="Pavi AI Assistant">
            🤖
          </button>
          
          <button className={styles.iconBtn} onClick={handleHome} title="Home Dashboard">
            📁
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
