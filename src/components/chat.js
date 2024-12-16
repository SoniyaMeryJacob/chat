import React, { useState } from 'react';
import SlidingChat from './SlidingChat'; // Reuse the existing chat
import styles from '../styles/Chat.module.css';

export default function HomePage() {
  const [openBot, setOpenBot] = useState(null);

  // Function to toggle open bots
  const toggleBot = (bot) => {
    setOpenBot(openBot === bot ? null : bot);
  };

  return (
    <div className={styles.homeContainer}>
      {/* Left Empty Section */}
      <div className={styles.leftSection}></div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <h2 className={styles.botsHeader}>BOTS</h2>
        
        {/* Bot List */}
        {[1, 2, 3].map((bot) => (
          <div key={bot} className={styles.botContainer}>
            <div className={styles.botHeader} onClick={() => toggleBot(bot)}>
              CHAT {bot}
              <span className={styles.dropdownIcon}>
                {openBot === bot ? '▲' : '▼'}
              </span>
            </div>
            
            {/* Chat Box - Reusing SlidingChat */}
            {openBot === bot && (
              <div className={styles.chatBox}>
                <SlidingChat />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
