import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../../store';
import { serialManager } from '../../utils/serial';
import { ClayLoader } from '../clay/ClayLoader';
import styles from './BottomBar.module.css';

export default function BottomBar() {
  const { generatedCode, terminalLogs, compileCode, isCompiling, clearTerminal, addTerminalLog, isHardwareConnected, setIsHardwareConnected } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'serial' | 'code'>('serial');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current && !isCollapsed) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [terminalLogs, generatedCode, isCollapsed]);

  const handleFlash = async () => {
    setIsCollapsed(false);
    setActiveTab('serial');
    addTerminalLog('[System] 📦 Packaging C++ binary payload for ESP32...', 'info');
    
    if (isHardwareConnected) {
      addTerminalLog('[System] 🔌 Re-synchronizing Web Serial USB channel...', 'info');
    } else {
      addTerminalLog('[System] 💡 Tip: Connect your USB cable and tap "Kit Connected" to pair physical ESP32!', 'info');
    }
    
    await compileCode();
    
    setTimeout(() => {
      addTerminalLog('[Success] 🎉 Program active! Physical ESP32 hardware & 3D Simulation are synchronized! 🚀', 'success');
    }, 600);
  };

  const codeLines = generatedCode ? generatedCode.split('\n') : ['// Connect blocks to generate C++ code'];

  return (
    <div className={styles.bottomBarContainer}>
      {isCompiling && (
        <ClayLoader 
          message="⚡ Compiling C++ & Flashing Hardware..." 
          subtext="Sending binary code to your ESP32 kit via toolchain" 
        />
      )}

      {/* COLLAPSIBLE LIVE TERMINAL PANEL */}
      <div className={`${styles.terminalBox} ${isCollapsed ? styles.collapsed : ''}`}>
        
        {/* TERMINAL HEADER & TOGGLE */}
        <div className={styles.terminalHeader}>
          <div className={styles.headerLeft} onClick={() => setIsCollapsed(!isCollapsed)}>
            <button className={styles.collapseToggleBtn}>
              {isCollapsed ? '▲' : '▼'}
            </button>
            <span className={styles.terminalTitle}>
              📟 LIVE TERMINAL {isHardwareConnected && '🟢'}
            </span>
          </div>

          <div className={styles.tabsRow}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'serial' ? styles.activeTab : ''}`}
              onClick={() => { setIsCollapsed(false); setActiveTab('serial'); }}
            >
              📺 Serial Logs
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'code' ? styles.activeTab : ''}`}
              onClick={() => { setIsCollapsed(false); setActiveTab('code'); }}
            >
              ⚡ Generated C++
            </button>
            <button className={styles.miniBtn} onClick={clearTerminal} title="Clear Terminal Logs">
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* TERMINAL BODY (Only shown when not collapsed) */}
        {!isCollapsed && (
          <div className={styles.terminalBody} ref={consoleRef}>
            {activeTab === 'serial' ? (
              <div className={styles.logList}>
                {terminalLogs.length === 0 && (
                  <div className={styles.emptyText}>
                    [Live Terminal Ready] Plug in USB cable or click Flash to see serial output...
                  </div>
                )}
                {terminalLogs.map((log, i) => (
                  <div key={i} className={styles.logLine}>
                    <span className={styles.lineNum}>{(i + 1).toString().padStart(3, '0')}</span>
                    <span className={
                      log.startsWith('[Error]') ? styles.logError :
                      log.startsWith('[Success]') ? styles.logSuccess :
                      styles.logInfo
                    }>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.codeList}>
                {codeLines.map((line, idx) => (
                  <div key={idx} className={styles.codeLine}>
                    <span className={styles.lineNum}>{(idx + 1).toString().padStart(3, ' ')}</span>
                    <span className={styles.codeText}>{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FLASH TO KIT CLAY PILL BUTTON ON THE RIGHT */}
      <button 
        className={`clayBtn ${styles.flashPillBtn}`}
        onClick={handleFlash}
        disabled={isCompiling}
      >
        {isCompiling ? '⏳ Flashing...' : '⚡ Flash to Kit'}
      </button>
    </div>
  );
}
