import React from 'react';
import Navbar from '../components/toolbar/Navbar';
import BlocklyCanvas from '../components/editor/BlocklyCanvas';
import SimulatorPanel from '../components/simulator/SimulatorPanel';
import AIPavi from '../components/copilot/AIPavi';
import BottomBar from '../components/console/BottomBar';
import styles from './EditorPage.module.css';

export default function EditorPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.mainRow}>
        <BlocklyCanvas />
        
        <div className={styles.rightCol}>
          <SimulatorPanel />
          <AIPavi />
        </div>
      </div>

      <BottomBar />
    </div>
  );
}
