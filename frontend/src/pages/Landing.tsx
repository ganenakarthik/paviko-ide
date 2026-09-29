import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClayButton } from '../components/clay/Clay';
import styles from './Landing.module.css';

const LIGHTHOUSE_XML = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="lighthouse_setup"><field name="PIN">2</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="lighthouse_beacon_on"><field name="PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="lighthouse_beacon_off"><field name="PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;

const TRAIN_XML = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="train_setup"><field name="MOTOR_PIN">12</field><field name="TRIG_PIN">4</field><field name="ECHO_PIN">5</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value><statement name="DO"><block type="train_motor_move"><field name="STATE">FORWARD</field><next><block type="train_check_obstacle"><field name="DISTANCE">20</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></statement></block></next></block></next></block></xml>`;

const TRAFFIC_XML = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="traffic_setup"><field name="RED_PIN">4</field><field name="YELLOW_PIN">2</field><field name="GREEN_PIN">5</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="traffic_set_red"><field name="STATE">HIGH</field><next><block type="esp32_wait"><field name="SECONDS">3</field><next><block type="traffic_set_red"><field name="STATE">LOW</field><next><block type="traffic_set_yellow"><field name="STATE">HIGH</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="traffic_set_yellow"><field name="STATE">LOW</field><next><block type="traffic_set_green"><field name="STATE">HIGH</field><next><block type="esp32_wait"><field name="SECONDS">3</field><next><block type="traffic_set_green"><field name="STATE">LOW</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;

const SERVO_XML = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="servo_setup"><field name="PIN">13</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value><statement name="DO"><block type="servo_set_angle"><field name="ANGLE">0</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="servo_set_angle"><field name="ANGLE">180</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;

const WEATHER_XML = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="dht11_setup"><field name="PIN">4</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="dht11_print_readings"><next><block type="dht11_alert_high_temp"><field name="TEMP_LIMIT">30</field><field name="ALARM_PIN">2</field><next><block type="esp32_wait"><field name="SECONDS">2</field></block></next></block></next></block></statement></block></next></block></next></block></xml>`;

export default function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error("Could not fetch projects", e);
    }
  };

  const handleStartTemplate = async (name: string, xml: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, block_xml: xml })
      });
      const data = await res.json();
      navigate(`/editor/${data.id}?template=${name}`);
    } catch (e) {
      console.error(e);
      navigate('/editor/offline');
    }
    setLoading(false);
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <img src="/logo.jpg" alt="Paviko Logo" className={styles.logoImage} />
          <h1 className={styles.title}>PAVIKO STUDIO</h1>
        </div>
        <div className={styles.headerActions}>
          <ClayButton variant="maroon" size="md" onClick={() => handleStartTemplate('My New Project', '')}>
            ➕ New Blank Project
          </ClayButton>
        </div>
      </header>

      {/* HERO TITLE AREA */}
      <div className={styles.heroActions} style={{flexDirection: 'column', gap: '8px', marginBottom: '24px'}}>
        <h2 style={{fontSize: '2.4rem', color: '#7D0A26', fontWeight: 900, margin: 0}}>
          Welcome to Paviko Studio! 🚀
        </h2>
        <p style={{fontSize: '1.05rem', color: '#666', fontWeight: 600, margin: 0}}>
          Code ESP32 microcontrollers with tactile 3D block programming, C++ generators, and 3D virtual simulators.
        </p>
      </div>

      {/* 1. SAVED PROJECTS SECTION */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.6rem', color: '#7D0A26', fontWeight: 900, margin: 0 }}>
            📁 My Saved Projects ({projects.length})
          </h3>
          <div style={{ width: '260px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 16px',
                borderRadius: '100px',
                border: '2px solid #7D0A26',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.9rem',
                outline: 'none',
                background: '#FFFEFB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div style={{ background: '#fdfaf6', border: '2px dashed #d6c9b8', borderRadius: '24px', padding: '24px', textAlign: 'center', color: '#888', fontWeight: 700 }}>
            No saved projects found. Pick a starter kit below to begin building! 👇
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {filteredProjects.map(proj => (
              <div key={proj.id} className={`${styles.cardOuter} ${styles.blue}`} onClick={() => navigate(`/editor/${proj.id}`)} style={{cursor: 'pointer'}}>
                <div className={styles.cardInner}>
                  <div className={`${styles.iconWrapper} ${styles.blue}`}>📝</div>
                  <h2 className={styles.cardTitle} style={{marginTop: 8}}>{proj.name}</h2>
                  <p className={styles.cardDesc}>Updated: {new Date(proj.updated_at).toLocaleDateString()}</p>
                  <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <ClayButton variant="maroon" size="md">Open IDE</ClayButton>
                    <button onClick={(e) => deleteProject(proj.id, e)} style={{background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 800}}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. STARTER KITS SECTION */}
      <div>
        <h3 style={{ fontSize: '1.6rem', color: '#7D0A26', fontWeight: 900, marginBottom: '16px' }}>
          🧩 Quick Starter Kits
        </h3>

        <div className={styles.cardsGrid}>
          
          {/* Starter 1: Lighthouse */}
          <div className={`${styles.cardOuter} ${styles.maroon}`} onClick={() => handleStartTemplate('Blinking Lighthouse', LIGHTHOUSE_XML)} style={{cursor: 'pointer'}}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.maroon}`}>🚨</div>
              <h2 className={styles.cardTitle}>Blinking Lighthouse</h2>
              <p className={styles.cardDesc}>
                Program a 3D lighthouse beacon with warning lights to keep ships safe!
              </p>
              <div style={{marginTop: 'auto'}}>
                <ClayButton variant="maroon" size="md">Start Lighthouse</ClayButton>
              </div>
            </div>
          </div>

          {/* Starter 2: Train */}
          <div className={`${styles.cardOuter} ${styles.green}`} onClick={() => handleStartTemplate('Obstacle Train', TRAIN_XML)} style={{cursor: 'pointer'}}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.green}`}>🚂</div>
              <h2 className={styles.cardTitle}>Obstacle-Avoiding Train</h2>
              <p className={styles.cardDesc}>
                Program an ultrasonic radar to stop the smart train before it crashes!
              </p>
              <div style={{marginTop: 'auto'}}>
                <ClayButton variant="white" size="md">Start Train Kit</ClayButton>
              </div>
            </div>
          </div>

          {/* Starter 3: Traffic Light */}
          <div className={`${styles.cardOuter} ${styles.blue}`} onClick={() => handleStartTemplate('City Traffic Light', TRAFFIC_XML)} style={{cursor: 'pointer'}}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.blue}`}>🚦</div>
              <h2 className={styles.cardTitle}>City Traffic Light</h2>
              <p className={styles.cardDesc}>
                Code a 3-stage Red, Yellow, Green signal system for urban intersections!
              </p>
              <div style={{marginTop: 'auto'}}>
                <ClayButton variant="white" size="md">Start Traffic Light</ClayButton>
              </div>
            </div>
          </div>

          {/* Starter 4: Robotic Servo */}
          <div className={`${styles.cardOuter} ${styles.maroon}`} onClick={() => handleStartTemplate('Robotic Servo Arm', SERVO_XML)} style={{cursor: 'pointer'}}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.maroon}`}>🤖</div>
              <h2 className={styles.cardTitle}>Robotic Servo Arm</h2>
              <p className={styles.cardDesc}>
                Control motor angles from 0° to 180° and program a robotic waving arm!
              </p>
              <div style={{marginTop: 'auto'}}>
                <ClayButton variant="maroon" size="md">Start Servo Arm</ClayButton>
              </div>
            </div>
          </div>

          {/* Starter 5: Smart Weather Station */}
          <div className={`${styles.cardOuter} ${styles.green}`} onClick={() => handleStartTemplate('DHT11 Weather Station', WEATHER_XML)} style={{cursor: 'pointer'}}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.green}`}>🌡️</div>
              <h2 className={styles.cardTitle}>DHT11 Weather Station</h2>
              <p className={styles.cardDesc}>
                Read live temperature & humidity data from a DHT11 sensor and trigger heat alarms!
              </p>
              <div style={{marginTop: 'auto'}}>
                <ClayButton variant="white" size="md">Start Weather Kit</ClayButton>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
