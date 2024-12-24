import React, { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function HomePage() {
  const [openBot, setOpenBot] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState({});
  const [activeToggle, setActiveToggle] = useState(null);
  const [isExpanded, setIsExpanded] = useState({}); // To manage expansion per bot
  const [isSecondExpanded, setIsSecondExpanded] = useState({}); // To manage second expansion

  const layoutClasses = {
    1: styles.layout1,
    2: styles.layout2,
    3: styles.layout3,
  };

  const toggleBot = (bot) => {
    setOpenBot(openBot === bot ? null : bot);
  };

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

  const handleToggleClick = (toggle) => {
    setActiveToggle(activeToggle === toggle ? null : toggle);
  };

  const handleExpandToggle = (bot) => {
    setIsExpanded({
      ...isExpanded,
      [bot]: !isExpanded[bot], // Toggle expand/collapse state per bot
    });
  };

  const handleSecondExpandToggle = (bot) => {
    setIsSecondExpanded({
      ...isSecondExpanded,
      [bot]: !isSecondExpanded[bot], // Toggle second expand/collapse state
    });
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.leftSection}>
        {openBot && (
          <div className={`${styles.frame} ${layoutClasses[openBot]}`}>
            <h2 className={styles.frameHeading}>Welcome to Chat {openBot}</h2>
            <div className={styles.frameBody}>
              {/* Chat 1 Specific UI */}
              {openBot === 1 && (
                <>
                  {/* Input Field */}
                  <input
                    type="text"
                    className={styles.textEntryField}
                    placeholder="Enter text here..."
                  />

                  {/* Expand/Collapse Buttons */}
                  <div className={styles.chat1Buttons}>
                    <button
                      className={styles.expandButton}
                      onClick={() => handleExpandToggle(1)}
                    >
                {isExpanded[1] ? 'Collapse' : 'Expand'}
                </button>
                    <button
                      className={styles.expandButton}
                      onClick={() => handleSecondExpandToggle(1)}
                    >
                {isSecondExpanded[1] ? 'Collapse' : 'Expand'}
                </button>
                  </div>

                  {/* Expandable Content */}
                  {isExpanded[1] && (
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
                  {/* Second Expandable Content */}
                  {isSecondExpanded[1] && (
                    <div className={styles.secondExpandableField}>
                      {/* Table with sample data */}
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
                  {/* Toggle Buttons */}
                  <div className={styles.chat1Toggles}>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleClick('Toggle 1')}
                    >
                      Toggle 1
                    </button>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleClick('Toggle 2')}
                    >
                      Toggle 2
                    </button>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleClick('Toggle 3')}
                    >
                      Toggle 3
                    </button>
                  </div>
                </>
              )}

              {/* Chat 2 UI */}
              {openBot === 2 && (
                <>
                  {/* Expand Button */}
                  <button
                    className={styles.expandButton}
                    onClick={() => handleExpandToggle(2)}
                  >
                {isExpanded[2] ? 'Collapse' : 'Expand'}
                </button>

                  {/* Expandable Content */}
                  {isExpanded[2] && (
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

                  {/* Input Field */}
                  <input
                    type="text"
                    className={styles.textEntryField}
                    placeholder="Enter text here..."
                  />

                  {/* Toggle Buttons */}
                  <div className={styles.toggleButtonsContainer}>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleClick('Toggle 1')}
                    >
                      Toggle 1
                    </button>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleClick('Toggle 2')}
                    >
                      Toggle 2
                    </button>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleClick('Toggle 3')}
                    >
                      Toggle 3
                    </button>
                  </div>

                  {/* Second Expand Button */}
                  <button
                    className={styles.expandButton}
                    onClick={() => handleSecondExpandToggle(2)}
                  >
                {isSecondExpanded[2] ? 'Collapse' : 'Expand'}
                </button>

                  {/* Second Expandable Content */}
                  {isSecondExpanded[2] && (
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
                </>
              )}

              {/* Chat 3 UI */}
              {openBot === 3 && (
                <>
                  {/* Expand Button */}
                  <button
                    className={styles.expandButton}
                    onClick={() => handleExpandToggle(3)}
                  >
                {isExpanded[3] ? 'Collapse' : 'Expand'}
                </button>

                  {/* Expandable Content */}
                  {isExpanded[3] && (
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

                  {/* Toggle Buttons in a Row */}
                  <div className={styles.toggleButtonsRow}>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleClick('Toggle 1')}
                    >
                      Toggle 1
                    </button>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleClick('Toggle 2')}
                    >
                      Toggle 2
                    </button>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleClick('Toggle 3')}
                    >
                      Toggle 3
                    </button>
                  </div>

                  {/* Second Expand Button */}
                  <button
                    className={styles.expandButton}
                    onClick={() => handleSecondExpandToggle(3)}
                  >
                {isSecondExpanded[3] ? 'Collapse' : 'Expand'}
                </button>

                  {/* Second Expandable Content */}
                  {isSecondExpanded[3] && (
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

                  {/* Input Field */}
                  <input
                    type="text"
                    className={styles.textEntryField}
                    placeholder="Enter text here..."
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        <h2 className={styles.botsHeader}>BOTS</h2>
        {[1, 2, 3].map((bot) => (
          <div key={bot} className={styles.botContainer}>
            <div className={styles.botHeader} onClick={() => toggleBot(bot)}>
              CHAT {bot}
              <span className={styles.dropdownIcon}>
                {openBot === bot ? '▲' : '▼'}
              </span>
            </div>

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
