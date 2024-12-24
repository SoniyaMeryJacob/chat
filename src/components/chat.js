import React, { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function HomePage() {
  const [openBot, setOpenBot] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState({});
  const [activeToggle, setActiveToggle] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // State for expand/collapse
  const [isSecondExpanded, setIsSecondExpanded] = useState(false); // State for second expandable field

  // Dynamic layout mapping
  const layoutClasses = {
    1: styles.layout1,
    2: styles.layout2,
    3: styles.layout3,
  };

  // Function to toggle open bots
  const toggleBot = (bot) => {
    setOpenBot(openBot === bot ? null : bot);
  };

  // Function to handle sending a message
  const handleSendMessage = (bot) => {
    if (input[bot]?.trim()) {
      const newMessage = { text: input[bot] };
      const updatedMessages = {
        ...messages,
        [bot]: [...(messages[bot] || []), newMessage],
      };
      setMessages(updatedMessages);
      setInput({ ...input, [bot]: '' });
    }
  };

  // Handle toggle button state
  const handleToggleClick = (toggle) => {
    setActiveToggle(activeToggle === toggle ? null : toggle);
  };

  // Toggle expand/collapse for both sections
  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSecondExpandToggle = () => {
    setIsSecondExpanded(!isSecondExpanded);
  };

  return (
    <div className={styles.homeContainer}>
      {/* Left Section with dynamic frame content */}
      <div className={styles.leftSection}>
        {openBot && (
          <div className={`${styles.frame} ${layoutClasses[openBot]}`}>
            <h2 className={styles.frameHeading}>Welcome to Chat {openBot}</h2>
            <div className={styles.frameBody}>
              {/* Expand/Collapse Button for first section */}
              <button
                className={styles.expandButton}
                onClick={handleExpandToggle}
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>

              {isExpanded && (
                <div className={styles.expandContent}>
                  {/* Static Lorem Ipsum Text */}
                  <p className={styles.loremText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim elit vel augue tempor, id sagittis dolor pharetra. Donec scelerisque urna a felis congue, in sodales justo suscipit.
                  </p>

                  {/* Dynamic Messages */}
                  <div className={styles.messageList}>
                    {(messages[openBot] || []).map((msg, index) => (
                      <p key={index} className={styles.messageItem}>
                        {msg.text || 'Uploaded File'}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Toggle Buttons */}
              <div className={styles.toggleButtonsContainer}>
                {['Toggle 1', 'Toggle 2', 'Toggle 3'].map((option, index) => (
                  <button
                    key={index}
                    className={`${styles.toggleButton} ${
                      activeToggle === option ? styles.activeToggle : ''
                    }`}
                    onClick={() => handleToggleClick(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Expand/Collapse Button for second section */}
              <button
                className={styles.expandButton}
                onClick={handleSecondExpandToggle}
              >
                {isSecondExpanded ? 'Collapse' : 'Expand'}
              </button>

              {isSecondExpanded && (
                <div className={styles.secondExpandableField}>
                  {/* Empty Table */}
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        <th>Column 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Empty Body */}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Text entry field */}
              <input
                type="text"
                className={styles.textEntryField}
                placeholder="Enter text here..."
              />
            </div>
          </div>
        )}
      </div>

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

            {/* Chat Box */}
            {openBot === bot && (
              <div className={styles.chatBox}>
                <div className={styles.chatContainer}>
                  <div className={styles.chatMessages}>
                    {(messages[bot] || []).map((msg, index) => (
                      <div key={index} className={styles.message}>
                        {msg.text ? (
                          msg.text
                        ) : (
                          <a
                            href={`/uploads/${msg.fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.fileLink}
                          >
                            View Uploaded File
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={styles.inputArea}>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={input[bot] || ''}
                      onChange={(e) =>
                        setInput({ ...input, [bot]: e.target.value })
                      }
                      placeholder="Type a message..."
                    />
                    <input
                      type="file"
                      className={styles.fileUpload}
                      onChange={(e) => handleFileUpload(bot, e)}
                    />
                    <button
                      className={styles.sendButton}
                      onClick={() => handleSendMessage(bot)}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
