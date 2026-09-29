import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClayButton } from '../components/clay/Clay';
import styles from './Landing.module.css';

const STEERING_XML = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="steering_setup"><field name="SERVO_PIN">13</field><field name="MOTOR_PIN">12</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value><statement name="DO"><block type="steering_set_angle"><field name="ANGLE">90</field><next><block type="steering_drive_motor"><field name="STATE">FORWARD</field><next><block type="esp32_wait"><field name="SECONDS">2</field><next><block type="steering_set_angle"><field name="ANGLE">45</field><next><block type="esp32_wait"><field name="SECONDS">1</field><next><block type="steering_set_angle"><field name="ANGLE">135</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;

const PAVIBOT_XML = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="esp32_start" x="50" y="50"><next><block type="pavibot_setup"><field name="SDA_PIN">21</field><field name="SCL_PIN">22</field><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="pavibot_set_expression"><field name="EXPRESSION">HAPPY</field><next><block type="esp32_wait"><field name="SECONDS">2</field><next><block type="pavibot_show_temp_hum"><next><block type="esp32_wait"><field name="SECONDS">3</field><next><block type="pavibot_set_expression"><field name="EXPRESSION">BLINK</field><next><block type="esp32_wait"><field name="SECONDS">1</field></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>`;

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
          Code real-time ESP32 STEM projects: Smart Steering Wheel 🚗 & Pavibot Robot Companion 🤖!
        </p>
      </div>

      {/* 1. SAVED PROJECTS SECTION */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.6rem', color: '#7D0A26', fontWeight: 900, margin: 0 }}>
            📁 Real-Time Studio Projects ({projects.length})
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
            Pick a real-time STEM project below to begin building! 👇
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {filteredProjects.map(proj => (
              <div key={proj.id} className={`${styles.cardOuter} ${styles.blue}`} onClick={() => navigate(`/editor/${proj.id}`)} style={{cursor: 'pointer'}}>
                <div className={styles.cardInner}>
                  <div className={`${styles.iconWrapper} ${styles.blue}`}>
                    {proj.name.toLowerCase().includes('steering') ? '🚗' : '🤖'}
                  </div>
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

      {/* 2. REAL-TIME STEM PROJECTS SECTION */}
      <div>
        <h3 style={{ fontSize: '1.6rem', color: '#7D0A26', fontWeight: 900, marginBottom: '16px' }}>
          🧩 Real-Time STEM Studio Projects
        </h3>

        <div className={styles.cardsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          
          {/* Project 1: Smart Steering Wheel */}
          <div className={`${styles.cardOuter} ${styles.maroon}`} onClick={() => handleStartTemplate('Smart Steering Wheel', STEERING_XML)} style={{cursor: 'pointer'}}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.maroon}`}>🚗</div>
              <h2 className={styles.cardTitle}>Smart Steering Wheel 🚗</h2>
              <p className={styles.cardDesc}>
                Code ESP32 steering angles (0° to 180°), motor drive control, and real-time vehicle simulation!
              </p>
              <div style={{marginTop: 'auto'}}>
                <ClayButton variant="maroon" size="md">Start Steering Kit</ClayButton>
              </div>
            </div>
          </div>

          {/* Project 2: Pavibot Robot Companion Cube */}
          <div className={`${styles.cardOuter} ${styles.green}`} onClick={() => handleStartTemplate('Pavibot Companion Cube', PAVIBOT_XML)} style={{cursor: 'pointer'}}>
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.green}`}>🤖</div>
              <h2 className={styles.cardTitle}>Pavibot Robot Companion 🤖</h2>
              <p className={styles.cardDesc}>
                Program the OLED screen for GROOT companion eye expressions, menu modes, DHT11 temp/humidity, and stopwatch timer!
              </p>
              <div style={{marginTop: 'auto'}}>
                <ClayButton variant="white" size="md">Start Pavibot Kit</ClayButton>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
