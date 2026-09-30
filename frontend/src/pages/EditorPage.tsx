import React from 'react';
import Navbar from '../components/toolbar/Navbar';
import BlocklyCanvas from '../components/editor/BlocklyCanvas';
import SimulatorPanel from '../components/simulator/SimulatorPanel';
import TelemetryPanel from '../components/telemetry/TelemetryPanel';
import BottomBar from '../components/console/BottomBar';
import styles from './EditorPage.module.css';

export default function EditorPage() {
  return (
    <div className={styles.pageContainer}>
      {/* 1. SLIM 56px MAROON TOP NAV BAR */}
      <Navbar />
      
      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className={styles.threeColumnGrid}>
        {/* COLUMN 1 (LEFT): BLOCKLY CANVAS & PAVIBOT MASCOT */}
        <div className={styles.colLeft}>
          <BlocklyCanvas />
        </div>
        
        {/* COLUMN 2 (CENTER): INTERACTIVE SIMULATION STAGE */}
        <div className={styles.colCenter}>
          <SimulatorPanel />
        </div>

        {/* COLUMN 3 (RIGHT): LIVE TELEMETRY PANEL */}
        <div className={styles.colRight}>
          <TelemetryPanel />
        </div>
      </div>

      {/* 3. BOTTOM BAR (COLLAPSIBLE TERMINAL & FLASH PILL BUTTON) */}
      <BottomBar />
    </div>
  );
}
