import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store';
import { generateCpp } from '../../customGenerator';
import styles from './Simulator.module.css';

export default function SimulatorPanel() {
  const { 
    projectName, 
    activeTemplate, 
    addTerminalLog,
    hardwareServoAngle
  } = useEditorStore();

  const [isRunning, setIsRunning] = useState(false);
  const [voltage, setVoltage] = useState('5.0V');
  const [gpioState, setGpioState] = useState('SAFE GPIO 5/18');
  
  // --- Steering Sim State ---
  const [steeringAngle, setSteeringAngle] = useState(90);
  const [driveState, setDriveState] = useState<'FORWARD' | 'REVERSE' | 'BRAKE'>('FORWARD');
  const [driveSpeed] = useState(60);

  // --- Pavibot Sim State ---
  const [pavibotMode, setPavibotMode] = useState<'EXPRESSIONS' | 'MENU' | 'TEMP' | 'STOPWATCH' | 'TORCH'>('EXPRESSIONS');
  const [pavibotExpression, setPavibotExpression] = useState<'HAPPY' | 'ANGRY' | 'BLINK' | 'SLEEP'>('HAPPY');
  const [stopwatchMs, setStopwatchMs] = useState(458);
  const [simTemp, setSimTemp] = useState(33.3);
  const [simHum, setSimHum] = useState(44.0);

  // --- Radar Sim State ---
  const [radarDistance, setRadarDistance] = useState(25);

  const displayAngle = hardwareServoAngle !== null ? hardwareServoAngle : steeringAngle;
  const displayTemp = simTemp.toFixed(2);
  const displayHum = simHum.toFixed(2);

  // Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        // Fluctuate voltage slightly
        const v = (5.0 + (Math.random() * 0.1 - 0.05)).toFixed(2);
        setVoltage(`${v}V`);
        
        // Blink GPIO active indicator
        setGpioState(Math.random() > 0.5 ? 'ACTIVE GPIO 5' : 'ACTIVE GPIO 18');

        if (activeTemplate === 'steering' || projectName.toLowerCase().includes('steering')) {
          setSteeringAngle(prev => (prev >= 135 ? 45 : prev + 15));
        } else if (activeTemplate === 'pavibot' || projectName.toLowerCase().includes('pavibot') || projectName.toLowerCase().includes('bot')) {
          setStopwatchMs(prev => (prev + 45) % 1000);
          if (pavibotMode === 'TEMP') {
            const tFluc = (simTemp + (Math.random() * 0.2 - 0.1)).toFixed(2);
            const hFluc = (simHum + (Math.random() * 0.4 - 0.2)).toFixed(2);
            addTerminalLog(`[Pavibot DHT11] 🌡️ Tem: ${tFluc}°C | 💧 Hum: ${hFluc}%`, 'info');
          }
        } else if (activeTemplate === 'radar' || projectName.toLowerCase().includes('radar') || projectName.toLowerCase().includes('sonar')) {
          // Send distance log to terminal
          const distFluc = (radarDistance + (Math.random() * 0.6 - 0.3)).toFixed(1);
          addTerminalLog(`[HC-SR04 Radar] Distance: ${distFluc} cm ${Number(distFluc) < 20 ? '🛑 OBSTACLE ALERT!' : '🟢 CLEAR'}`, 'info');
        }
      }, 500);
    } else {
      setVoltage('5.0V');
      setGpioState('SAFE GPIO');
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTemplate, projectName, pavibotMode, simTemp, simHum, radarDistance, addTerminalLog]);

  const handleRunSim = () => {
    let { generatedCode, triggerPaviReaction } = useEditorStore.getState();

    // Auto-generate code from workspace
    const ws = (window as any).BlocklyWorkspace;
    if (ws) {
      const freshCode = generateCpp(ws);
      if (freshCode && freshCode.trim()) {
        generatedCode = freshCode;
        useEditorStore.setState({ generatedCode });
      }
    }

    if (!isRunning) {
      if (!generatedCode.trim()) {
        addTerminalLog('[Error] Simulation failed: Code is empty! Connect blocks first.', 'error');
        triggerPaviReaction('error');
        return;
      }
      setIsRunning(true);
      addTerminalLog('[Simulator] Real-Time Studio Simulation active! 🚀', 'success');
    } else {
      setIsRunning(false);
      addTerminalLog('[Simulator] Simulation paused.', 'info');
    }
  };

  const currentType = activeTemplate || (
    projectName.toLowerCase().includes('steering') ? 'steering' :
    projectName.toLowerCase().includes('radar') || projectName.toLowerCase().includes('sonar') ? 'radar' : 'pavibot'
  );

  return (
    <div className={styles.panel}>
      <div className={styles.simHeader}>
        <div>
          <div className={styles.title}>
            {currentType === 'steering' ? '🚗 SMART STEERING WHEEL SIM' :
             currentType === 'radar' ? '📡 ULTRASONIC RADAR SIM (HC-SR04)' : '🤖 PAVIBOT COMPANION CUBE (GROOT 3D OLED)'}
          </div>
          <div className={styles.readyPill} style={{ background: isRunning ? '#e8a2a2' : '#a2e8c2', color: isRunning ? '#5e1a1a' : '#1a5e30' }}>
            {isRunning ? 'SIMULATION ACTIVE' : 'READY'}
          </div>
        </div>
        
        <button 
          className={styles.runBtn} 
          style={{ background: isRunning ? '#333' : '#7D0A26' }}
          onClick={handleRunSim}
        >
          {isRunning ? '⏹ Stop Sim' : '▶ Run Sim'}
        </button>
      </div>

      {/* DYNAMIC VISUAL GRAPHICS AREA */}
      <div style={{
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '160px',
        background: currentType === 'pavibot' ? '#1e2430' : currentType === 'radar' ? '#0d1b2a' : '#fdfaf6',
        borderRadius: '20px',
        padding: '12px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.15)',
        border: '2px solid #7D0A26'
      }}>

        {/* 1. STEERING WHEEL VIEW */}
        {currentType === 'steering' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            
            <div style={{
              position: 'relative',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '10px solid #2c3e50',
              background: 'radial-gradient(circle, #34495e 0%, #1a252f 100%)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.2)',
              transform: `rotate(${displayAngle - 90}deg)`,
              transition: 'transform 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ position: 'absolute', width: '100%', height: '8px', background: '#7f8c8d' }} />
              <div style={{ position: 'absolute', width: '8px', height: '100%', background: '#7f8c8d' }} />
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#7D0A26',
                border: '2px solid #FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontWeight: 900,
                fontSize: '0.9rem',
                zIndex: 2
              }}>
                🚗
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#7D0A26' }}>
                Angle: {displayAngle}° ({displayAngle < 75 ? '◀ Turn Left' : displayAngle > 105 ? 'Turn Right ▶' : 'Straight ⬆'})
              </span>
              <span style={{
                background: driveState === 'BRAKE' ? '#e74c3c' : '#2ecc71',
                color: '#FFF',
                padding: '3px 10px',
                borderRadius: '100px',
                fontWeight: 900,
                fontSize: '0.75rem'
              }}>
                {driveState === 'BRAKE' ? '🛑 BRAKE APPLIED' : `🏎️ ${driveState} (${driveSpeed}%)`}
              </span>
            </div>
          </div>
        )}

        {/* 2. ULTRASONIC RADAR VIEW (HC-SR04) */}
        {currentType === 'radar' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%', color: '#4cc9f0' }}>
            
            {/* Visual HC-SR04 Blue Module with Scanning Sonar Beam */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative' }}>
              
              {/* HC-SR04 Blue PCB Board */}
              <div style={{
                width: '110px',
                height: '60px',
                background: '#1d3557',
                borderRadius: '8px',
                border: '2px solid #457b9d',
                boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
                display: 'flex',
                justify: 'space-around',
                alignItems: 'center',
                padding: '4px',
                position: 'relative'
              }}>
                {/* Transducer Cylinders (T and R) */}
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'radial-gradient(circle, #d8e2dc 40%, #708090 90%)', border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, color: '#222' }}>T</div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'radial-gradient(circle, #d8e2dc 40%, #708090 90%)', border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, color: '#222' }}>R</div>
              </div>

              {/* Sonar Pulse Wave Arcs */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '24px', borderRight: '3px solid #4cc9f0', borderRadius: '50%', opacity: isRunning ? 0.9 : 0.4 }} />
                <div style={{ width: '12px', height: '36px', borderRight: '3px solid #4cc9f0', borderRadius: '50%', opacity: isRunning ? 0.7 : 0.3 }} />
                <div style={{ width: '16px', height: '48px', borderRight: '3px solid #4cc9f0', borderRadius: '50%', opacity: isRunning ? 0.5 : 0.2 }} />
              </div>

              {/* Obstacle Object Target Box */}
              <div style={{
                width: '40px',
                height: '50px',
                background: radarDistance < 20 ? '#e63946' : '#2a9d8f',
                borderRadius: '8px',
                border: '2px solid #FFF',
                boxShadow: radarDistance < 20 ? '0 0 15px #e63946' : '0 0 10px #2a9d8f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                color: '#FFF',
                fontSize: '1.2rem',
                transform: `translateX(${Math.min(radarDistance, 60)}px)`,
                transition: 'all 0.3s ease'
              }}>
                📦
              </div>

            </div>

            {/* Readout Pill */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#FFF' }}>
                Distance: <span style={{ color: '#4cc9f0' }}>{radarDistance} cm</span>
              </span>
              <span style={{
                background: radarDistance < 20 ? '#e63946' : '#2a9d8f',
                color: '#FFF',
                padding: '3px 12px',
                borderRadius: '100px',
                fontWeight: 900,
                fontSize: '0.78rem'
              }}>
                {radarDistance < 20 ? '🛑 OBSTACLE ALERT! (< 20cm)' : '🟢 PATH CLEAR (> 20cm)'}
              </span>
            </div>

          </div>
        )}

        {/* 3. PAVIBOT COMPANION CUBE */}
        {currentType === 'pavibot' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            
            <div style={{
              width: '180px',
              height: '140px',
              background: 'linear-gradient(145deg, #7a8288 0%, #575e64 100%)',
              borderRadius: '16px',
              border: '3px solid #3e444a',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
              
              <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '100px',
                marginBottom: '6px'
              }} />

              <div style={{
                width: '140px',
                height: '75px',
                background: '#000000',
                borderRadius: '6px',
                border: '2px solid #222',
                boxShadow: 'inset 0 0 8px rgba(0, 210, 255, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00d2ff',
                fontFamily: 'monospace',
                padding: '6px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                
                {pavibotMode === 'EXPRESSIONS' && (
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    {pavibotExpression === 'HAPPY' && (
                      <>
                        <div style={{ width: '26px', height: '26px', background: '#00d2ff', borderRadius: '4px', boxShadow: '0 0 12px #00d2ff' }} />
                        <div style={{ width: '26px', height: '26px', background: '#00d2ff', borderRadius: '4px', boxShadow: '0 0 12px #00d2ff' }} />
                      </>
                    )}
                    {pavibotExpression === 'ANGRY' && (
                      <>
                        <div style={{ width: '26px', height: '26px', background: '#00d2ff', clipPath: 'polygon(0 35%, 100% 0, 100% 100%, 0 100%)', boxShadow: '0 0 12px #00d2ff' }} />
                        <div style={{ width: '26px', height: '26px', background: '#00d2ff', clipPath: 'polygon(0 0, 100% 35%, 100% 100%, 0 100%)', boxShadow: '0 0 12px #00d2ff' }} />
                      </>
                    )}
                    {pavibotExpression === 'BLINK' && (
                      <>
                        <div style={{ width: '26px', height: '5px', background: '#00d2ff', borderRadius: '2px', boxShadow: '0 0 12px #00d2ff' }} />
                        <div style={{ width: '26px', height: '5px', background: '#00d2ff', borderRadius: '2px', boxShadow: '0 0 12px #00d2ff' }} />
                      </>
                    )}
                    {pavibotExpression === 'SLEEP' && (
                      <>
                        <div style={{ width: '22px', height: '4px', background: '#00d2ff', borderRadius: '2px' }} />
                        <div style={{ width: '22px', height: '4px', background: '#00d2ff', borderRadius: '2px' }} />
                      </>
                    )}
                  </div>
                )}

                {pavibotMode === 'MENU' && (
                  <div style={{ width: '100%', fontSize: '0.65rem', lineHeight: '1.2' }}>
                    <div style={{ textAlign: 'center', borderBottom: '1px solid #00d2ff', paddingBottom: '2px', fontWeight: 'bold' }}>MENU</div>
                    <div style={{ marginTop: '3px' }}>EMO MODE</div>
                    <div style={{ background: '#00d2ff', color: '#000', fontWeight: 'bold', padding: '0 2px' }}>TEMP MODE</div>
                    <div>GAME</div>
                    <div>STOPWATCH</div>
                  </div>
                )}

                {pavibotMode === 'TEMP' && (
                  <div style={{ width: '100%', fontSize: '0.8rem', lineHeight: '1.5', fontWeight: 'bold' }}>
                    <div>Tem: {displayTemp}C</div>
                    <div>Hum: {displayHum}%</div>
                  </div>
                )}

                {pavibotMode === 'STOPWATCH' && (
                  <div style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', lineHeight: '1.6', fontWeight: 'bold' }}>
                    <div style={{ letterSpacing: '1px' }}>STOPWATCH</div>
                    <div style={{ fontSize: '0.95rem' }}>00:00:{String(stopwatchMs).padStart(3, '0')}</div>
                  </div>
                )}

                {pavibotMode === 'TORCH' && (
                  <div style={{ width: '100%', height: '100%', background: '#00d2ff', boxShadow: '0 0 25px #00d2ff' }} />
                )}

              </div>

              <div style={{
                color: '#34383c',
                fontWeight: 900,
                fontSize: '0.9rem',
                letterSpacing: '2px',
                marginTop: '6px',
                textShadow: '0 1px 0 rgba(255,255,255,0.2)'
              }}>
                GROOT
              </div>

            </div>

          </div>
        )}

      </div>

      {/* INTERACTIVE CONTROLS */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#fdfaf6', padding: '8px 12px', borderRadius: '12px', border: '1px solid #e0d5c5', flexWrap: 'wrap' }}>
        {currentType === 'steering' ? (
          <>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7D0A26' }}>Angle:</span>
            <input 
              type="range" 
              min="0" 
              max="180" 
              value={steeringAngle} 
              onChange={(e) => setSteeringAngle(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#7D0A26' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{steeringAngle}°</span>
            
            <button 
              onClick={() => setDriveState(prev => prev === 'FORWARD' ? 'BRAKE' : 'FORWARD')}
              style={{
                background: driveState === 'FORWARD' ? '#2ecc71' : '#e74c3c',
                color: '#FFF',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {driveState === 'FORWARD' ? '🏎️ Drive' : '🛑 Brake'}
            </button>
          </>
        ) : currentType === 'radar' ? (
          <>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7D0A26' }}>Obstacle Distance:</span>
            <input 
              type="range" 
              min="5" 
              max="100" 
              value={radarDistance} 
              onChange={(e) => setRadarDistance(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#7D0A26' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{radarDistance} cm</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7D0A26' }}>OLED Screen Mode:</span>
            <select 
              value={pavibotMode}
              onChange={(e) => setPavibotMode(e.target.value as any)}
              style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #7D0A26', fontWeight: 800, fontSize: '0.75rem' }}
            >
              <option value="EXPRESSIONS">👁️ EMO Eyes</option>
              <option value="MENU">📋 Menu List</option>
              <option value="TEMP">🌡️ Temp & Hum</option>
              <option value="STOPWATCH">⏱️ Stopwatch</option>
              <option value="TORCH">💡 Torch</option>
            </select>

            {pavibotMode === 'EXPRESSIONS' && (
              <select 
                value={pavibotExpression}
                onChange={(e) => setPavibotExpression(e.target.value as any)}
                style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #7D0A26', fontWeight: 800, fontSize: '0.75rem' }}
              >
                <option value="HAPPY">😊 Happy Eyes</option>
                <option value="ANGRY">😠 Angry Eyes</option>
                <option value="BLINK">😉 Blink</option>
                <option value="SLEEP">😴 Sleep</option>
              </select>
            )}

            {pavibotMode === 'TEMP' && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>Temp:</span>
                <input type="range" min="15" max="45" step="0.1" value={simTemp} onChange={(e) => setSimTemp(Number(e.target.value))} style={{ width: '60px', accentColor: '#7D0A26' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>Hum:</span>
                <input type="range" min="20" max="90" step="0.1" value={simHum} onChange={(e) => setSimHum(Number(e.target.value))} style={{ width: '60px', accentColor: '#7D0A26' }} />
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.hwControls}>
        <div className={styles.hwTitle}>⚙️ HARDWARE MONITOR</div>
        <div className={styles.pillRow}>
          <div className={styles.hwPill}>
            <span className={styles.lbl}>VOLTAGE</span>
            <span className={styles.val} style={{ color: isRunning ? '#d9534f' : '#7D0A26' }}>{voltage}</span>
          </div>
          <div className={styles.hwPill}>
            <span className={styles.lbl}>PIN STATUS</span>
            <span className={styles.val} style={{ color: gpioState.includes('ACTIVE') ? '#2ecc71' : '#7D0A26' }}>{gpioState}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
