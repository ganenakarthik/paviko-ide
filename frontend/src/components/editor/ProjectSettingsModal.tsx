import React, { useState } from 'react';
import { useEditorStore } from '../../store';
import styles from './ProjectSettingsModal.module.css';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectSettingsModal({ isOpen, onClose }: ProjectSettingsModalProps) {
  const { projectName, generatedCode, addTerminalLog } = useEditorStore();
  const [name, setName] = useState(projectName);
  const [targetBoard, setTargetBoard] = useState('esp32');

  if (!isOpen) return null;

  const handleDownloadIno = () => {
    const blob = new Blob([generatedCode || '// Paviko C++ Sketch\nvoid setup(){}\nvoid loop(){}'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.ino`;
    a.click();
    URL.revokeObjectURL(url);
    addTerminalLog(`[System] Downloaded ${name}.ino sketch file!`, 'success');
  };

  const handleSaveSettings = () => {
    useEditorStore.setState({ projectName: name });
    addTerminalLog(`[System] Updated project settings for ${name}.`, 'success');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            ⚙️ Project Settings & Export
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Project Name</label>
            <input 
              type="text" 
              className={styles.input} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Target Microcontroller</label>
            <select 
              className={styles.select} 
              value={targetBoard} 
              onChange={(e) => setTargetBoard(e.target.value)}
            >
              <option value="esp32">ESP32 DevKit V1 (Standard 32-bit Wi-Fi/BT)</option>
              <option value="arduino_uno">Arduino Uno R3 (ATmega328P)</option>
              <option value="pico">Raspberry Pi Pico (RP2040)</option>
            </select>
          </div>

          <div className={styles.formGroup} style={{ marginTop: 10 }}>
            <label className={styles.label}>Export Options</label>
            <button className={styles.btnWhite} onClick={handleDownloadIno}>
              📥 Download Arduino (.ino) Sketch File
            </button>
          </div>

          <div className={styles.btnRow}>
            <button className={styles.btnWhite} onClick={onClose}>Cancel</button>
            <button className={styles.btnMaroon} onClick={handleSaveSettings}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
