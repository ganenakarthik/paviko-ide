import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClayButton } from '../components/clay/Clay';
import styles from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter((p: any) => 
          p.id === 'proj-steering' || p.id === 'proj-pavibot' || p.id === 'proj-radar' ||
          p.name.toLowerCase().includes('steering') || p.name.toLowerCase().includes('pavibot') || p.name.toLowerCase().includes('radar')
        );
        if (filtered.length > 0) {
          setProjects(filtered);
          return;
        }
      }
    } catch (e) {
      console.error("Could not fetch projects", e);
    }

    setProjects([
      {
        id: 'proj-steering',
        name: 'Smart Steering Wheel 🚗',
        desc: 'Code ESP32 steering angles (0° to 180°), motor drive control, and real-time vehicle simulation!',
        updated_at: new Date().toISOString()
      },
      {
        id: 'proj-pavibot',
        name: 'Pavibot Robot Companion 🤖',
        desc: 'Program the OLED screen for GROOT companion eye expressions, menu modes, DHT11 temp/humidity, and stopwatch timer!',
        updated_at: new Date().toISOString()
      },
      {
        id: 'proj-radar',
        name: 'Ultrasonic Radar (HC-SR04) 📡',
        desc: 'Measure distance in cm using TRIG (Pin 5) & ECHO (Pin 18) with real-time sonar wave simulation!',
        updated_at: new Date().toISOString()
      }
    ]);
  };

  const handleOpenProject = (projectId: string, templateName: string) => {
    navigate(`/editor/${projectId}?template=${templateName}`);
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
      </header>

      {/* HERO TITLE AREA */}
      <div className={styles.heroActions} style={{flexDirection: 'column', gap: '8px', marginBottom: '28px', textAlign: 'center'}}>
        <h2 style={{fontSize: '2.5rem', color: '#7D0A26', fontWeight: 900, margin: 0}}>
          Welcome to Paviko Studio! 🚀
        </h2>
        <p style={{fontSize: '1.1rem', color: '#666', fontWeight: 600, margin: 0}}>
          Pick your real-time ESP32 STEM project to continue building:
        </p>
      </div>

      {/* FIXED REAL-TIME STUDIO PROJECTS */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.6rem', color: '#7D0A26', fontWeight: 900, margin: 0 }}>
            📁 Real-Time Studio Projects ({filteredProjects.length})
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

        <div className={styles.cardsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          
          {/* Project 1: Smart Steering Wheel */}
          <div 
            className={`${styles.cardOuter} ${styles.maroon}`} 
            onClick={() => handleOpenProject('proj-steering', 'steering')} 
            style={{cursor: 'pointer'}}
          >
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.maroon}`}>🚗</div>
              <h2 className={styles.cardTitle}>Smart Steering Wheel 🚗</h2>
              <p className={styles.cardDesc}>
                Code ESP32 steering angles (0° to 180°), motor drive control, and real-time vehicle simulation!
              </p>
              <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <ClayButton variant="maroon" size="md">▶ Continue Building</ClayButton>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888' }}>ID: proj-steering</span>
              </div>
            </div>
          </div>

          {/* Project 2: Pavibot Companion Cube */}
          <div 
            className={`${styles.cardOuter} ${styles.green}`} 
            onClick={() => handleOpenProject('proj-pavibot', 'pavibot')} 
            style={{cursor: 'pointer'}}
          >
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.green}`}>🤖</div>
              <h2 className={styles.cardTitle}>Pavibot Robot Companion 🤖</h2>
              <p className={styles.cardDesc}>
                Program the OLED screen for GROOT companion eye expressions, menu modes, DHT11 temp/humidity, and stopwatch timer!
              </p>
              <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <ClayButton variant="white" size="md">▶ Continue Building</ClayButton>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888' }}>ID: proj-pavibot</span>
              </div>
            </div>
          </div>

          {/* Project 3: Ultrasonic Radar */}
          <div 
            className={`${styles.cardOuter} ${styles.blue}`} 
            onClick={() => handleOpenProject('proj-radar', 'radar')} 
            style={{cursor: 'pointer'}}
          >
            <div className={styles.cardInner}>
              <div className={`${styles.iconWrapper} ${styles.blue}`}>📡</div>
              <h2 className={styles.cardTitle}>Ultrasonic Radar (HC-SR04) 📡</h2>
              <p className={styles.cardDesc}>
                Measure distance in cm using TRIG (Pin 5) & ECHO (Pin 18) with real-time sonar wave simulation!
              </p>
              <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <ClayButton variant="maroon" size="md">▶ Continue Building</ClayButton>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888' }}>ID: proj-radar</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
