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
  const [isTestDriving, setIsTestDriving] = useState(false);
  const [steeringAngle, setSteeringAngle] = useState(90);
  const [radarDistance, setRadarDistance] = useState(25);

  // Pavibot State
  const [pavibotMode, setPavibotMode] = useState<'EXPRESSIONS' | 'MENU' | 'TEMP' | 'STOPWATCH' | 'TORCH'>('EXPRESSIONS');
  const [pavibotExpression, setPavibotExpression] = useState<'HAPPY' | 'ANGRY' | 'BLINK' | 'SLEEP'>('HAPPY');
  const [stopwatchMs, setStopwatchMs] = useState(458);

  const displayAngle = hardwareServoAngle !== null ? hardwareServoAngle : steeringAngle;
  // Calculate front wheel rotation relative to 90 degrees center
  const wheelTurnDeg = displayAngle - 90;

  // Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning || isTestDriving) {
      interval = setInterval(() => {
        if (activeTemplate === 'steering' || projectName.toLowerCase().includes('steering')) {
          // Swing steering angle smoothly during Test Drive
          setSteeringAngle(prev => (prev >= 145 ? 35 : prev + 15));
        } else if (activeTemplate === 'pavibot' || projectName.toLowerCase().includes('pavibot') || projectName.toLowerCase().includes('bot')) {
          setStopwatchMs(prev => (prev + 45) % 1000);
        } else if (activeTemplate === 'radar' || projectName.toLowerCase().includes('radar') || projectName.toLowerCase().includes('sonar')) {
          const distFluc = (radarDistance + (Math.random() * 0.6 - 0.3)).toFixed(1);
          addTerminalLog(`[HC-SR04 Radar] Distance: ${distFluc} cm ${Number(distFluc) < 20 ? '🛑 OBSTACLE ALERT!' : '🟢 CLEAR'}`, 'info');
        }
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isRunning, isTestDriving, activeTemplate, projectName, pavibotMode, radarDistance, addTerminalLog]);

  const handleTestDriveToggle = () => {
    const nextState = !isTestDriving;
    setIsTestDriving(nextState);
    if (nextState) {
      addTerminalLog('[Simulator] 🏎️ Test Drive active! Vehicle steering active in real-time.', 'success');
    } else {
      addTerminalLog('[Simulator] ⏸ Test Drive paused.', 'info');
    }
  };

  const handleRunSim = () => {
    let { generatedCode, triggerPaviReaction } = useEditorStore.getState();
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
        addTerminalLog('[Error] Simulation failed: Workspace is empty! Connect blocks first.', 'error');
        triggerPaviReaction('error');
        return;
      }
      setIsRunning(true);
      addTerminalLog('[Simulator] Simulation running 🚀', 'success');
    } else {
      setIsRunning(false);
      addTerminalLog('[Simulator] Simulation stopped.', 'info');
    }
  };

  const currentType = activeTemplate || (
    projectName.toLowerCase().includes('steering') ? 'steering' :
    projectName.toLowerCase().includes('radar') || projectName.toLowerCase().includes('sonar') ? 'radar' : 'pavibot'
  );

  return (
    <div className={styles.simStageCard}>
      {/* STAGE HEADER */}
      <div className={styles.stageHeader}>
        <div className={styles.stageTitle}>
          {currentType === 'steering' ? '🏎️ CAR STEERING STAGE' :
           currentType === 'radar' ? '📡 SONAR RADAR STAGE' : '🤖 PAVIBOT OLED CUBE STAGE'}
        </div>
        <div className={styles.statusPill} style={{ background: isRunning || isTestDriving ? '#E8F8F0' : '#FFF0F3', color: isRunning || isTestDriving ? '#27AE60' : '#5A0B1A' }}>
          {isRunning || isTestDriving ? 'ACTIVE' : 'READY'}
        </div>
      </div>

      {/* DARK ROUNDED CLAY STAGE CONTAINER */}
      <div className={styles.darkClayStage}>

        {/* 1. STEERING CAR VIEW (Top-down car with dynamic front-wheel turning angle) */}
        {currentType === 'steering' && (
          <div className={styles.carStageWrapper}>
            
            {/* ARC GAUGE (0° to 180°) */}
            <div className={styles.arcGaugeWrapper}>
              <svg viewBox="0 0 100 50" className={styles.arcGaugeSvg}>
                {/* Background Track */}
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#2C3545" strokeWidth="8" strokeLinecap="round" />
                {/* Active Highlight Arc */}
                <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="#5A0B1A" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray="126"
                  strokeDashoffset={126 - (displayAngle / 180) * 126}
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              {/* Center Needle & Text */}
              <div className={styles.gaugeCenterText}>
                <span className={styles.gaugeAngleVal}>{displayAngle}°</span>
                <span className={styles.gaugeSublabel}>STEERING</span>
              </div>
            </div>

            {/* TOP-DOWN CAR GRAPHIC WITH DYNAMIC TURNING FRONT WHEELS */}
            <div className={styles.topDownCarBox}>
              
              {/* FRONT LEFT WHEEL (Rotates dynamically with wheelTurnDeg!) */}
              <div 
                className={styles.wheelFrontLeft}
                style={{ transform: `rotate(${wheelTurnDeg}deg)`, transition: 'transform 0.2s ease-out' }}
              />

              {/* FRONT RIGHT WHEEL (Rotates dynamically with wheelTurnDeg!) */}
              <div 
                className={styles.wheelFrontRight}
                style={{ transform: `rotate(${wheelTurnDeg}deg)`, transition: 'transform 0.2s ease-out' }}
              />

              {/* REAR LEFT WHEEL (Fixed) */}
              <div className={styles.wheelRearLeft} />

              {/* REAR RIGHT WHEEL (Fixed) */}
              <div className={styles.wheelRearRight} />

              {/* CAR BODY */}
              <div className={styles.carBody}>
                <div className={styles.windshield} />
                <div className={styles.carRoof}>
                  <div className={styles.steeringWheelIcon} style={{ transform: `rotate(${wheelTurnDeg * 2}deg)` }}>🚗</div>
                </div>
                <div className={styles.rearGlass} />
              </div>

            </div>

          </div>
        )}

        {/* 2. ULTRASONIC RADAR VIEW */}
        {currentType === 'radar' && (
          <div className={styles.radarStageWrapper}>
            <div className={styles.hcModule}>
              <div className={styles.transducer}>T</div>
              <div className={styles.transducer}>R</div>
            </div>
            <div className={styles.sonarRings}>
              <div className={styles.sonarRing1} style={{ opacity: isRunning ? 0.9 : 0.3 }} />
              <div className={styles.sonarRing2} style={{ opacity: isRunning ? 0.6 : 0.2 }} />
              <div className={styles.sonarRing3} style={{ opacity: isRunning ? 0.4 : 0.1 }} />
            </div>
            <div className={styles.obstacleTarget} style={{ transform: `translateX(${Math.min(radarDistance, 50)}px)` }}>
              📦
            </div>
          </div>
        )}

        {/* 3. PAVIBOT COMPANION CUBE VIEW */}
        {currentType === 'pavibot' && (
          <div className={styles.grootCubeStageWrapper}>
            <div className={styles.grootBox}>
              <div className={styles.grootArch} />
              <div className={styles.oledDisplay}>
                {pavibotMode === 'EXPRESSIONS' && (
                  <div className={styles.oledEyesRow}>
                    {pavibotExpression === 'HAPPY' && (
                      <>
                        <div className={styles.eyeSquare} />
                        <div className={styles.eyeSquare} />
                      </>
                    )}
                    {pavibotExpression === 'ANGRY' && (
                      <>
                        <div className={styles.eyeAngryLeft} />
                        <div className={styles.eyeAngryRight} />
                      </>
                    )}
                    {pavibotExpression === 'BLINK' && (
                      <>
                        <div className={styles.eyeBlink} />
                        <div className={styles.eyeBlink} />
                      </>
                    )}
                    {pavibotExpression === 'SLEEP' && (
                      <>
                        <div className={styles.eyeSleep} />
                        <div className={styles.eyeSleep} />
                      </>
                    )}
                  </div>
                )}
                {pavibotMode === 'MENU' && (
                  <div className={styles.oledText}>
                    <div className={styles.oledHeader}>MENU</div>
                    <div>EMO MODE</div>
                    <div className={styles.oledHighlight}>TEMP MODE</div>
                    <div>STOPWATCH</div>
                  </div>
                )}
                {pavibotMode === 'TEMP' && (
                  <div className={styles.oledTextLarge}>
                    <div>Tem: 33.30C</div>
                    <div>Hum: 44.00%</div>
                  </div>
                )}
                {pavibotMode === 'STOPWATCH' && (
                  <div className={styles.oledTextLarge}>
                    <div>STOPWATCH</div>
                    <div>00:00:{String(stopwatchMs).padStart(3, '0')}</div>
                  </div>
                )}
                {pavibotMode === 'TORCH' && (
                  <div className={styles.oledTorchFull} />
                )}
              </div>
              <div className={styles.grootLogoText}>GROOT</div>
            </div>
          </div>
        )}

      </div>

      {/* CONTROLS & TEST DRIVE BUTTON BELOW STAGE */}
      <div className={styles.controlsRow}>
        {currentType === 'steering' ? (
          <>
            <div className={styles.sliderGroup}>
              <span className={styles.sliderLabel}>Steer Angle:</span>
              <input 
                type="range" 
                min="0" 
                max="180" 
                value={steeringAngle} 
                onChange={(e) => setSteeringAngle(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <span className={styles.sliderValText}>{steeringAngle}°</span>
            </div>

            {/* TEST DRIVE CLAY BUTTON */}
            <button 
              className={`clayBtn ${styles.testDriveBtn}`}
              onClick={handleTestDriveToggle}
              style={{ background: isTestDriving ? '#5A0B1A' : '#7D0A26' }}
            >
              {isTestDriving ? '⏹ Stop Drive' : '🏎️ Test Drive'}
            </button>
          </>
        ) : currentType === 'radar' ? (
          <div className={styles.sliderGroup}>
            <span className={styles.sliderLabel}>Obstacle Distance:</span>
            <input 
              type="range" 
              min="5" 
              max="100" 
              value={radarDistance} 
              onChange={(e) => setRadarDistance(Number(e.target.value))}
              className={styles.rangeInput}
            />
            <span className={styles.sliderValText}>{radarDistance} cm</span>
          </div>
        ) : (
          <div className={styles.pavibotControlsGroup}>
            <span className={styles.sliderLabel}>OLED Mode:</span>
            <select 
              value={pavibotMode}
              onChange={(e) => setPavibotMode(e.target.value as any)}
              className={styles.selectInput}
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
                className={styles.selectInput}
              >
                <option value="HAPPY">😊 Happy</option>
                <option value="ANGRY">😠 Angry</option>
                <option value="BLINK">😉 Blink</option>
                <option value="SLEEP">😴 Sleep</option>
              </select>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
