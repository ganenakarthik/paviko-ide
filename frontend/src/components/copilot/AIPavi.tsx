import React, { useEffect } from 'react';
import { useEditorStore } from '../../store';
import styles from './AIPavi.module.css';

export default function AIPavi() {
  const { paviReaction, triggerPaviReaction, isHardwareConnected, currentHint } = useEditorStore();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      if (useEditorStore.getState().paviReaction === 'sleep') {
        useEditorStore.getState().triggerPaviReaction(null);
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        useEditorStore.getState().triggerPaviReaction('sleep');
      }, 60000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeout);
    };
  }, []);

  const getReactionClass = () => {
    if (paviReaction === 'yes') return styles.avatarReactionYes;
    if (paviReaction === 'no') return styles.avatarReactionNo;
    if (paviReaction === 'error') return styles.avatarReactionError;
    if (paviReaction === 'sleep') return styles.avatarReactionSleep;
    if (paviReaction === 'look_left') return styles.avatarReactionLookLeft;
    if (paviReaction === 'flip') return styles.avatarReactionFlip;
    return '';
  };

  const getSpeechBubbleText = () => {
    if (paviReaction === 'error' || currentHint === 'error') return "🚨 Check the red error message in the terminal below!";
    if (paviReaction === 'yes') return "Awesome block snap! You're doing great! 🌟";
    if (paviReaction === 'no') return "Block removed! 🗑️";
    if (paviReaction === 'sleep') return "zZz... Wake me up anytime! 😴";
    if (paviReaction === 'look_left') return "👈 The Candy Tray is glowing! Pick a block!";
    if (paviReaction === 'flip') return "Wheee! 360 Spin! 🎉✨";
    if (isHardwareConnected) return "Yay! ESP32 Kit Connected! 🔌🟢";
    if (currentHint === 'toolbox') return "👈 Candy Tray glowing! Drag a block to start!";
    if (currentHint === 'flash') return "⚡ Click glowing 'Flash to Kit' button below!";
    return "Hi! I'm Pavi! Let me guide your project! 🤖✨";
  };

  const handleAvatarClick = () => {
    triggerPaviReaction('flip');
  };

  const isError = paviReaction === 'error' || currentHint === 'error';

  return (
    <div className={styles.panel}>
      <div className={styles.centerStage}>
        {/* Cartoon Speech Bubble */}
        <div className={`${styles.speechBubble} ${isError ? styles.speechBubbleError : ''}`}>
          {getSpeechBubbleText()}
        </div>

        {/* Cute 3D Clay Mascot Pavi */}
        <div 
          className={`${styles.avatar} ${getReactionClass()}`}
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer' }}
          title="Click Pavi for a spin!"
        >
          {/* Top Antenna Bulb */}
          <div className={styles.antennaStem}>
            <div className={styles.antennaBulb} />
          </div>

          <div className={styles.face}>
            {/* Blushing Cheeks */}
            <div className={styles.blushLeft} />
            <div className={styles.blushRight} />

            {/* Cute Glossy Eyes */}
            <div className={styles.eyes}>
              <div className={`${styles.eye} ${styles.leftEye}`}>
                <div className={styles.pupilGleam} />
                <div className={styles.pupilMini} />
              </div>
              <div className={`${styles.eye} ${styles.rightEye}`}>
                <div className={styles.pupilGleam} />
                <div className={styles.pupilMini} />
              </div>
            </div>

            {/* Cute Expression Mouth */}
            <div className={styles.mouth}>
              <div className={styles.tongue} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
