import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store';
import { generateCpp } from '../../customGenerator';
import styles from './Simulator.module.css';

export default function SimulatorPanel() {
  const { 
    projectName, 
    activeTemplate, 
    addTerminalLog,
    isHardwareConnected,
    hardwareTemp,
    hardwareHumidity,
    hardwareDistance,
    hardwareServoAngle
  } = useEditorStore();
  const [isRunning, setIsRunning] = useState(false);
  const [voltage, setVoltage] = useState('5.0V');
  const [gpioState, setGpioState] = useState('SAFE 2');
  const [servoAngle, setServoAngle] = useState(0);
  const [trafficStep, setTrafficStep] = useState<'red' | 'yellow' | 'green'>('red');
  const [trainPos, setTrainPos] = useState(0);
  const [customDistance, setCustomDistance] = useState(15);
  const [simSpeed, setSimSpeed] = useState(800);
  const [simTemp, setSimTemp] = useState(26);
  const [simHumidity, setSimHumidity] = useState(55);

  const displayTemp = hardwareTemp !== null ? hardwareTemp.toFixed(1) : simTemp.toFixed(1);
  const displayHum = hardwareHumidity !== null ? hardwareHumidity : simHumidity;
  const displayDist = hardwareDistance !== null ? hardwareDistance : customDistance;
  const displayServo = hardwareServoAngle !== null ? hardwareServoAngle : servoAngle;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        // Fluctuate voltage slightly
        const v = (5.0 + (Math.random() * 0.2 - 0.1)).toFixed(2);
        setVoltage(`${v}V`);
        
        // Blink GPIO state
        setGpioState(Math.random() > 0.5 ? 'ACTIVE 4' : 'SAFE 4');

        // Servo angle swing
        setServoAngle(prev => (prev === 0 ? 180 : prev === 180 ? 90 : 0));

        // Traffic Light step
        setTrafficStep(prev => prev === 'red' ? 'yellow' : prev === 'yellow' ? 'green' : 'red');

        // Train movement
        setTrainPos(prev => (prev + 20) % 100);

        // Fluctuate temperature and humidity slightly for realism
        const tFluc = (simTemp + (Math.random() * 0.4 - 0.2)).toFixed(1);
        const hFluc = Math.round(simHumidity + (Math.random() * 2 - 1));
        
        // Output live sensor readings to serial terminal log if active
        if (activeTemplate === 'weather' || projectName.toLowerCase().includes('weather') || projectName.toLowerCase().includes('dht')) {
          addTerminalLog(`[DHT11 Sensor] 🌡️ Temp: ${tFluc}°C | 💧 Humidity: ${hFluc}%`, 'info');
        }
      }, simSpeed);
    } else {
      setVoltage('5.0V');
      setGpioState('SAFE 4');
      setServoAngle(0);
      setTrafficStep('red');
      setTrainPos(0);
    }
    return () => clearInterval(interval);
  }, [isRunning, simSpeed, simTemp, simHumidity, activeTemplate, projectName, addTerminalLog]);

  const handleRunSim = () => {
    let { generatedCode, triggerPaviReaction } = useEditorStore.getState();

    // Auto-generate fresh C++ code directly from global workspace if code is generic or missing
    const ws = (window as any).BlocklyWorkspace;
    if (ws) {
      const freshCode = generateCpp(ws);
      if (freshCode && freshCode.trim()) {
        generatedCode = freshCode;
        useEditorStore.setState({ generatedCode });
      }
    }

    if (!isRunning) {
      // Validate generated C++ code structure
      const hasSetup = 
        generatedCode.includes('setup()') || 
        generatedCode.includes('pinMode') || 
        generatedCode.includes('myServo.attach') ||
        generatedCode.includes('dht.begin()') ||
        generatedCode.includes('Serial.begin');

      const hasAction = 
        generatedCode.includes('digitalWrite') || 
        generatedCode.includes('delay') || 
        generatedCode.includes('analogWrite') || 
        generatedCode.includes('myServo.write') ||
        generatedCode.includes('readUltrasonicDistance') ||
        generatedCode.includes('dht.readTemperature') ||
        generatedCode.includes('dht.readHumidity') ||
        generatedCode.includes('Serial.print') ||
        generatedCode.includes('for (');

      if (!generatedCode.trim() || !hasSetup || !hasAction) {
        addTerminalLog('[Error] Simulation failed: Code structure incomplete! Make sure you have a Pin/Sensor Setup and Action block connected.', 'error');
        triggerPaviReaction('error');
        return;
      }

      setIsRunning(true);
      addTerminalLog('[Simulator] Code validated successfully! Simulation active! 🚀', 'success');
    } else {
      setIsRunning(false);
      addTerminalLog('[Simulator] Simulation stopped.', 'info');
    }
  };

  const currentType = activeTemplate || (
    projectName.toLowerCase().includes('lighthouse') ? 'lighthouse' :
    projectName.toLowerCase().includes('train') || projectName.toLowerCase().includes('car') ? 'train' :
    projectName.toLowerCase().includes('traffic') ? 'traffic' :
    projectName.toLowerCase().includes('servo') ? 'servo' :
    projectName.toLowerCase().includes('weather') || projectName.toLowerCase().includes('dht') ? 'weather' : 'custom'
  );

  return (
    <div className={styles.panel}>
      <div className={styles.simHeader}>
        <div>
          <div className={styles.title}>
            {currentType === 'lighthouse' ? '🚨 LIGHTHOUSE SIM' :
             currentType === 'train' ? '🚂 SMART TRAIN SIM' :
             currentType === 'traffic' ? '🚦 TRAFFIC LIGHT SIM' :
             currentType === 'servo' ? '🤖 SERVO ARM SIM' :
             currentType === 'weather' ? '🌡️ DHT11 WEATHER STATION SIM' : '🚀 ESP32 BOARD SIM'}
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
        minHeight: '130px',
        background: '#fdfaf6',
        borderRadius: '20px',
        padding: '12px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.06)'
      }}>

        {/* 1. LIGHTHOUSE VIEW */}
        {currentType === 'lighthouse' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              fontSize: '3.5rem',
              filter: isRunning ? 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.9))' : 'none',
              transform: isRunning ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}>
              🚨
            </div>
            <div style={{
              height: '10px',
              width: '110px',
              background: isRunning ? '#F1C40F' : '#ccc',
              borderRadius: '100px',
              boxShadow: isRunning ? '0 0 15px #F1C40F' : 'none',
              transition: 'all 0.3s ease'
            }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7D0A26' }}>
              {isRunning ? `✨ Beacon Speed: ${simSpeed}ms` : 'Beacon Offline'}
            </span>
          </div>
        )}

        {/* 2. TRAIN VIEW */}
        {currentType === 'train' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '100%', height: '6px', background: '#d6c9b8', borderRadius: '4px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: `${displayDist > 20 ? trainPos : 10}%`,
                top: '-24px',
                fontSize: '2.2rem',
                transition: 'left 0.8s ease-in-out'
              }}>
                🚂
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: displayDist <= 20 ? '#C0392B' : '#7D0A26' }}>
              📡 Ultrasonic Radar: {displayDist}cm {displayDist <= 20 ? '🛑 OBSTACLE DETECTED!' : '🟢 TRACK CLEAR'}
            </span>
          </div>
        )}

        {/* 3. TRAFFIC LIGHT VIEW */}
        {currentType === 'traffic' && (
          <div style={{
            background: '#2b040d',
            padding: '10px 18px',
            borderRadius: '24px',
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: isRunning && trafficStep === 'red' ? '#E74C3C' : '#551111',
              boxShadow: isRunning && trafficStep === 'red' ? '0 0 20px #E74C3C' : 'none',
              transition: 'all 0.3s ease'
            }} />
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: isRunning && trafficStep === 'yellow' ? '#F1C40F' : '#554411',
              boxShadow: isRunning && trafficStep === 'yellow' ? '0 0 20px #F1C40F' : 'none',
              transition: 'all 0.3s ease'
            }} />
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: isRunning && trafficStep === 'green' ? '#2ECC71' : '#115522',
              boxShadow: isRunning && trafficStep === 'green' ? '0 0 20px #2ECC71' : 'none',
              transition: 'all 0.3s ease'
            }} />
          </div>
        )}

        {/* 4. SERVO ARM VIEW */}
        {currentType === 'servo' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              fontSize: '3rem',
              transform: `rotate(${displayServo}deg)`,
              transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              🤖
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7D0A26' }}>
              Angle: {displayServo}° {isRunning ? '🔄 Swinging' : 'Stopped'}
            </span>
          </div>
        )}

        {/* 5. DHT11 WEATHER STATION VIEW */}
        {currentType === 'weather' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                fontSize: '3rem',
                filter: isRunning || isHardwareConnected ? 'drop-shadow(0 0 20px rgba(52, 152, 219, 0.8))' : 'none',
                transform: isRunning || isHardwareConnected ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}>
                🌡️
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{
                  background: Number(displayTemp) > 30 ? '#FFF0F0' : '#E8F8F0',
                  color: Number(displayTemp) > 30 ? '#C0392B' : '#27AE60',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  border: `2px solid ${Number(displayTemp) > 30 ? '#E74C3C' : '#2ECC71'}`
                }}>
                  Temperature: {displayTemp}°C {Number(displayTemp) > 30 ? '🔥 HOT ALERT!' : '🟢 NORMAL'}
                </div>
                <div style={{
                  background: '#EBF5FB',
                  color: '#2980B9',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  border: '2px solid #3498DB'
                }}>
                  Humidity: {displayHum}% 💧
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isHardwareConnected ? '#27AE60' : '#7D0A26' }}>
              {isHardwareConnected ? '🟢 USB HARDWARE CONNECTED — Live Telemetry Streaming' : isRunning ? '📡 DHT11 Live Data Streaming to Terminal' : 'DHT11 Sensor Ready (GPIO 4)'}
            </span>
          </div>
        )}

        {/* 6. CUSTOM ESP32 BOARD VIEW */}
        {currentType === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              fontSize: '3rem',
              filter: isRunning || isHardwareConnected ? 'drop-shadow(0 0 20px rgba(46, 204, 113, 0.8))' : 'none',
              transform: isRunning || isHardwareConnected ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}>
              ⚡
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7D0A26' }}>
              {isHardwareConnected ? '🟢 ESP32 DevKit V1 (USB Hardware Connected)' : 'ESP32 DevKit V1 (Pin 2 Active)'}
            </span>
          </div>
        )}

      </div>

      {/* INTERACTIVE SIMULATOR SLIDERS */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#fdfaf6', padding: '6px 12px', borderRadius: '12px', border: '1px solid #e0d5c5' }}>
        {currentType === 'train' ? (
          <>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7D0A26' }}>Distance:</span>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={customDistance} 
              onChange={(e) => setCustomDistance(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#7D0A26' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{customDistance}cm</span>
          </>
        ) : currentType === 'weather' ? (
          <>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7D0A26' }}>Sim Temp:</span>
            <input 
              type="range" 
              min="10" 
              max="50" 
              value={simTemp} 
              onChange={(e) => setSimTemp(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#7D0A26' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{simTemp}°C</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7D0A26', marginLeft: '6px' }}>Humidity:</span>
            <input 
              type="range" 
              min="20" 
              max="90" 
              value={simHumidity} 
              onChange={(e) => setSimHumidity(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#7D0A26' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{simHumidity}%</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7D0A26' }}>Speed:</span>
            <input 
              type="range" 
              min="200" 
              max="1500" 
              step="100" 
              value={simSpeed} 
              onChange={(e) => setSimSpeed(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#7D0A26' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{simSpeed}ms</span>
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
