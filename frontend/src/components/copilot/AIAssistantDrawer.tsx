import React, { useState } from 'react';
import { useEditorStore } from '../../store';
import styles from './AIAssistantDrawer.module.css';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistantDrawer({ isOpen, onClose }: AIAssistantDrawerProps) {
  const { generatedCode, triggerPaviReaction, activeTemplate } = useEditorStore();
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: "Hi! I'm Pavi, your AI assistant! 🤖 What would you like to know about your code, projects, or ESP32 kit?" }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const handleSend = async (customMsg?: string) => {
    const textToSend = customMsg || inputMsg;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(newMsgs);
    if (!customMsg) setInputMsg('');
    setLoading(true);
    triggerPaviReaction('yes');

    try {
      const res = await fetch(`${API_BASE}/pavi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, code: generatedCode })
      });
      const data = await res.json();
      setMessages([...newMsgs, { sender: 'ai', text: data.reply || "I'm ready to help!" }]);
    } catch (e) {
      setMessages([...newMsgs, { sender: 'ai', text: "I'm connected and watching your blocks! Keep coding! 🚀" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.drawer}>
      <div className={styles.header}>
        <div className={styles.title}>
          🤖 Pavi AI Supercharger
        </div>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div className={styles.content}>
        <div className={styles.actionGrid}>
          <button className={styles.actionBtn} onClick={() => handleSend("Explain my current code blocks step by step!")}>
            <span>💡</span>
            <span>Explain Code</span>
          </button>
          <button className={styles.actionBtn} onClick={() => handleSend("Check my blocks for bugs or missing setups!")}>
            <span>🐛</span>
            <span>Find Bugs</span>
          </button>
          <button className={styles.actionBtn} onClick={() => handleSend("How does the " + activeTemplate + " project work?")}>
            <span>📘</span>
            <span>Project Guide</span>
          </button>
          <button className={styles.actionBtn} onClick={() => handleSend("Give me a fun coding challenge for this project!")}>
            <span>🚀</span>
            <span>New Challenge</span>
          </button>
        </div>

        {/* Quick Topic Chips */}
        <div className={styles.chipRow}>
          <button className={styles.chip} onClick={() => handleSend("Tell me about the DHT11 temp & humidity sensor!")}>🌡️ DHT11 Sensor</button>
          <button className={styles.chip} onClick={() => handleSend("Tell me about the Lighthouse project!")}>🚨 Lighthouse</button>
          <button className={styles.chip} onClick={() => handleSend("How does the Train radar work?")}>🚂 Train Radar</button>
          <button className={styles.chip} onClick={() => handleSend("Explain Traffic Light timing!")}>🚦 Traffic Light</button>
          <button className={styles.chip} onClick={() => handleSend("How do Servo motor angles work?")}>🤖 Servo Arm</button>
          <button className={styles.chip} onClick={() => handleSend("What are GPIO pins and GND?")}>🔌 ESP32 Pins</button>
        </div>

        <div className={styles.chatBox}>
          {messages.map((m, i) => (
            <div key={i} className={m.sender === 'ai' ? styles.messageAi : styles.messageUser}>
              {m.text}
            </div>
          ))}
          {loading && <div className={styles.messageAi}>Pavi is thinking... 🧠✨</div>}
        </div>

        <div className={styles.inputRow}>
          <input 
            type="text" 
            className={styles.chatInput} 
            placeholder="Ask Pavi anything..." 
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className={styles.sendBtn} onClick={() => handleSend()}>Send</button>
        </div>
      </div>
    </div>
  );
}
