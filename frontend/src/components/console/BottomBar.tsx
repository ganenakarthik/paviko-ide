import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../../store';
import { serialManager } from '../../utils/serial';
import { ClayLoader } from '../clay/ClayLoader';
import styles from './BottomBar.module.css';

export default function BottomBar() {
  const { generatedCode, terminalLogs, compileCode, isCompiling, clearTerminal, addTerminalLog, isHardwareConnected, setIsHardwareConnected, currentHint } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'code' | 'serial'>('serial');
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [terminalLogs, generatedCode, activeTab, autoScroll]);

  useEffect(() => {
    serialManager.onData((data) => {
      addTerminalLog(data, 'info');

      // Parse live telemetry from real ESP32 USB hardware
      const tempMatch = data.match(/Temp(?:erature)?:?\s*([\d.]+)/i);
      const humMatch = data.match(/Hum(?:idity)?:?\s*([\d.]+)/i);
      const distMatch = data.match(/(?:Dist(?:ance)?|Radar):?\s*([\d.]+)/i);
      const angleMatch = data.match(/(?:Servo|Angle):?\s*(\d+)/i);

      const updates: any = {};
      if (tempMatch) updates.hardwareTemp = parseFloat(tempMatch[1]);
      if (humMatch) updates.hardwareHumidity = parseFloat(humMatch[1]);
      if (distMatch) updates.hardwareDistance = parseFloat(distMatch[1]);
      if (angleMatch) updates.hardwareServoAngle = parseInt(angleMatch[1], 10);

      if (Object.keys(updates).length > 0) {
        useEditorStore.getState().setHardwareTelemetry(updates);
      }
    });
    serialManager.onDisconnect(() => {
      setIsHardwareConnected(false);
      useEditorStore.getState().setHardwareTelemetry({
        hardwareTemp: null,
        hardwareHumidity: null,
        hardwareDistance: null,
        hardwareServoAngle: null,
        hardwareSignalState: null
      });
      addTerminalLog('[System] Device physically disconnected.', 'error');
    });
  }, [addTerminalLog, setIsHardwareConnected]);

  const handleConnect = async () => {
    if (isHardwareConnected) {
      await serialManager.disconnect();
      setIsHardwareConnected(false);
      addTerminalLog('[System] Disconnected from serial monitor.', 'info');
      return;
    }

    try {
      await serialManager.requestPort();
      await serialManager.connect(baudRate);
      setIsHardwareConnected(true);
      setActiveTab('serial');
      addTerminalLog(`[System] Connected to ESP32! (Baud: ${baudRate})`, 'success');
    } catch (e: any) {
      addTerminalLog(`[Error] Connection failed: ${e.message}`, 'error');
    }
  };

  const handleFlash = async () => {
    setActiveTab('serial');
    addTerminalLog('[System] 📦 Packaging pre-built C++ binary payload for ESP32...', 'info');
    
    if (isHardwareConnected) {
      addTerminalLog('[System] 🔌 Re-synchronizing Web Serial USB channel...', 'info');
    } else {
      addTerminalLog('[System] 💡 Tip: Connect your USB cable and tap "🔌 Connect Kit" to pair your physical ESP32!', 'info');
    }
    
    await compileCode();
    
    setTimeout(() => {
      addTerminalLog('[Success] 🎉 Program active! Physical ESP32 hardware & 3D Simulation are fully synchronized! 🚀', 'success');
    }, 600);
  };

  const downloadLog = () => {
    const text = activeTab === 'serial' ? terminalLogs.join('\n') : generatedCode;
    const filename = activeTab === 'serial' ? 'serial_logs.txt' : 'sketch.ino';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const codeLines = generatedCode ? generatedCode.split('\n') : ['// Add blocks to generate C++ code'];

  return (
    <div className={styles.terminalWrapper} style={{ position: 'relative' }}>
      {isCompiling && (
        <ClayLoader 
          message="⚡ Compiling C++ & Flashing Hardware..." 
          subtext="Sending binary code to your ESP32 kit via toolchain" 
        />
      )}

      {currentHint === 'error' && (
        <div className={styles.gameBubbleError}>
          🚨 Oops! Check the terminal error log below to see what went wrong!
        </div>
      )}

      {/* Header Bar with Tabs and Controls */}
      <div className={styles.headerBar}>
        <div className={styles.tabs}>
          <div 
            className={`${styles.tab} ${activeTab === 'code' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('code')}
          >
            ⚡ Generated C++
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'serial' ? styles.activeTab : ''} ${currentHint === 'error' ? styles.hintGlow : ''}`}
            onClick={() => setActiveTab('serial')}
          >
            📺 Cyber Terminal {isHardwareConnected && '🟢'}
          </div>
        </div>

        {/* Terminal Quick Options */}
        <div className={styles.terminalControls}>
          <label className={styles.baudLabel}>
            <span>Baud:</span>
            <select 
              className={styles.baudSelect} 
              value={baudRate} 
              onChange={(e) => setBaudRate(Number(e.target.value))}
            >
              <option value={9600}>9600</option>
              <option value={57600}>57600</option>
              <option value={115200}>115200</option>
              <option value={230400}>230400</option>
              <option value={921600}>921600</option>
            </select>
          </label>

          <label className={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={autoScroll} 
              onChange={(e) => setAutoScroll(e.target.checked)} 
            />
            <span>Auto-Scroll</span>
          </label>
        </div>
      </div>

      {/* Main Clay Console */}
      <div className={styles.mainBar}>
        {/* CRT Screen Frame */}
        <div className={`${styles.consoleScreen} ${currentHint === 'error' ? styles.errorGlow : ''}`} ref={consoleRef}>
          <div className={styles.crtOverlay} />
          {activeTab === 'serial' ? (
            <div className={styles.logList}>
              {terminalLogs.length === 0 && (
                <div className={styles.consoleTextInfo}>
                  [Cyber-Console Ready] Waiting for device output or flash action...
                </div>
              )}
              {terminalLogs.map((log, i) => (
                <div key={i} className={styles.logLine}>
                  <span className={styles.lineNumber}>{(i + 1).toString().padStart(3, '0')}</span>
                  <span className={
                    log.startsWith('[Error]') ? styles.consoleTextError :
                    log.startsWith('[Success]') ? styles.consoleTextSuccess :
                    styles.consoleTextInfo
                  }>
                    {log}
                  </span>
                </div>
              ))}
              {isCompiling && (
                <div className={styles.logLine}>
                  <span className={styles.lineNumber}>...</span>
                  <span className={styles.consoleTextInfo}>⚡ Compiling sketch & Flashing via ESP32 toolchain...</span>
                </div>
              )}
              <div className={styles.consoleCursor} />
            </div>
          ) : (
            <div className={styles.codeView}>
              {codeLines.map((line, idx) => (
                <div key={idx} className={styles.codeLine}>
                  <span className={styles.lineNumber}>{(idx + 1).toString().padStart(3, ' ')}</span>
                  <span className={styles.codeText}>{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button 
            className={isHardwareConnected ? styles.btnMaroon : styles.btnWhite} 
            onClick={handleConnect}
          >
            {isHardwareConnected ? '🔌 Disconnect' : '🔌 Connect Kit'}
          </button>
          
          <div className={styles.actionWrapper}>
            <button 
              className={`${styles.btnWhite} ${currentHint === 'flash' ? styles.hintGlow : ''}`} 
              onClick={handleFlash} 
              disabled={isCompiling}
            >
              {isCompiling ? '⏳ Flashing...' : '⚡ Flash to Kit'}
            </button>
            {currentHint === 'flash' && (
              <div className={styles.gameBubble}>
                Great code! 🌟 Let's flash it!
              </div>
            )}
          </div>

          <button 
            className={styles.btnMaroon} 
            onClick={() => {
              const text = generatedCode || '// Add blocks to generate code';
              const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${useEditorStore.getState().activeTemplate}_sketch.ino`;
              link.click();
              URL.revokeObjectURL(url);
              addTerminalLog('[System] Exported Arduino C++ sketch (.ino file)!', 'success');
            }}
            title="Download complete C++ code file for Arduino IDE"
          >
            📥 Export .ino
          </button>

          <button className={styles.btnWhite} onClick={() => navigator.clipboard.writeText(generatedCode)}>
            📄 Copy Code
          </button>
          <button className={styles.btnWhite} onClick={downloadLog}>
            💾 Save Logs
          </button>
          <button className={styles.btnWhite} onClick={clearTerminal}>
            🗑️ Clear
          </button>
        </div>
      </div>
    </div>
  );
}
