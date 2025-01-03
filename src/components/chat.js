import React, { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function HomePage() {
  const [openBot, setOpenBot] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState({});
  const [activeToggle, setActiveToggle] = useState(null);
  const [isExpanded, setIsExpanded] = useState({}); // To manage expansion per bot
  const [isSecondExpanded, setIsSecondExpanded] = useState({}); // To manage second expansion
  const [chatHistory, setChatHistory] = useState({}); // State for chat histories
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visibility state

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
      const updatedHistory = {
        ...chatHistory,
        [bot]: [...(chatHistory[bot] || []), newMessage],
      };

      setMessages(updatedMessages);
      setChatHistory(updatedHistory);
      setInput({ ...input, [bot]: '' });
    }
  };

  const handleToggleClick = (toggle) => {
    setActiveToggle(activeToggle === toggle ? null : toggle);
  };

  const handleExpandToggle = (bot) => {
    setIsExpanded({
      ...isExpanded,
      [bot]: !isExpanded[bot],
    });
  };

  const handleSecondExpandToggle = (bot) => {
    setIsSecondExpanded({
      ...isSecondExpanded,
      [bot]: !isSecondExpanded[bot],
    });
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddNewChat = () => {
    alert('New Chat feature coming soon!'); // Placeholder for actual functionality
  };

  const handleCloseHistory = () => {
    setIsSidebarOpen(false); // Closes chat history when header is clicked
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.leftSection}>
      {!isSidebarOpen && openBot && (
          <button
          className={styles.sidebarToggleIcon}
          onClick={handleToggleSidebar}
          aria-label="Toggle Chat History"
        >
          ☰
        </button>
        
      )}
      {!isSidebarOpen && openBot &&(
              <button
                className={styles.addChatIcon}
                onClick={handleAddNewChat}
                aria-label="Add New Chat"
              >
              <img src="/icons/new.png" alt="New Chat" className={styles.newChatIcon}/>
              </button>       
                    )}
        {/* Sidebar for Chat History */}
        {isSidebarOpen && openBot && (
          <div className={styles.sidebar}>
             <div className={styles.sidebarHeader}>
              <h3 onClick={handleCloseHistory}>Chat {openBot} History</h3>

              {/* + Icon to add new chat */}
              <button
                className={styles.addChatIcon}
                onClick={handleAddNewChat}
                aria-label="Add New Chat"
              >
              <img src="/icons/new.png" alt="New Chat" className={styles.newChatIcon}/>
              </button>
            </div>
            <div className={styles.historyList}>
              {(chatHistory[openBot] || []).map((msg, index) => (
                <div key={index} className={styles.historyItem}>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {!openBot && <h1>RAG APP</h1>}
        {openBot && (
          <div className={`${styles.frame} ${layoutClasses[openBot]}`}>
            <h2 className={styles.frameHeading}>Welcome to Chat {openBot}</h2>
            <div className={styles.frameBody}>
              {openBot === 1 && (
                <>
                  <input
                    type="text"
                    className={styles.textEntryField}
                    placeholder="Enter text here..."
                  />

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

                  {isExpanded[1] && (
                    <div className={styles.expandContent}>
                      <p className={styles.loremText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                      <div className={styles.messageList}>
                        {(messages[openBot] || []).map((msg, index) => (
                          <p key={index} className={styles.messageItem}>
                            {msg.text || 'Uploaded File'}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {isSecondExpanded[1] && (
                    <div className={styles.secondExpandableField}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Column 1</th>
                            <th>Column 2</th>
                            <th>Column 3</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  )}

                  <div className={styles.toggleButtonsContainer}>
                    {['Toggle 1', 'Toggle 2', 'Toggle 3'].map((toggle) => (
                      <div
                        key={toggle}
                        className={`${styles.toggleSwitch} ${
                          activeToggle === toggle ? styles.active : ''
                        }`}
                        onClick={() => handleToggleClick(toggle)}
                      ></div>
                    ))}
                  </div>
                </>
              )}

              {openBot === 2 && (
                <>
                  <button
                    className={styles.expandButton}
                    onClick={() => handleExpandToggle(2)}
                  >
                    {isExpanded[2] ? 'Collapse' : 'Expand'}
                  </button>

                  {isExpanded[2] && (
                    <div className={styles.expandContent}>
                      <p className={styles.loremText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                      <div className={styles.messageList}>
                        {(messages[openBot] || []).map((msg, index) => (
                          <p key={index} className={styles.messageItem}>
                            {msg.text || 'Uploaded File'}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    className={styles.textEntryField}
                    placeholder="Enter text here..."
                  />

                  <div className={styles.toggleButtonsContainer}>
                    {['Toggle 1', 'Toggle 2', 'Toggle 3'].map((toggle) => (
                      <div
                        key={toggle}
                        className={`${styles.toggleSwitch} ${
                          activeToggle === toggle ? styles.active : ''
                        }`}
                        onClick={() => handleToggleClick(toggle)}
                      ></div>
                    ))}
                  </div>

                  <button
                    className={styles.expandButton}
                    onClick={() => handleSecondExpandToggle(2)}
                  >
                    {isSecondExpanded[2] ? 'Collapse' : 'Expand'}
                  </button>

                  {isSecondExpanded[2] && (
                    <div className={styles.secondExpandableField}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Column 1</th>
                            <th>Column 2</th>
                            <th>Column 3</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {openBot === 3 && (
                <>
                  <button
                    className={styles.expandButton}
                    onClick={() => handleExpandToggle(3)}
                  >
                    {isExpanded[3] ? 'Collapse' : 'Expand'}
                  </button>

                  {isExpanded[3] && (
                    <div className={styles.expandContent}>
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
  <div className={styles.toggleSwitch}>
    <input
      type="checkbox"
      id="toggle1"
      onChange={() => handleToggleClick('Toggle 1')}
    />
    <label htmlFor="toggle1" className={styles.slider}></label>
  </div>
  <div className={styles.toggleSwitch}>
    <input
      type="checkbox"
      id="toggle2"
      onChange={() => handleToggleClick('Toggle 2')}
    />
    <label htmlFor="toggle2" className={styles.slider}></label>
  </div>
  <div className={styles.toggleSwitch}>
    <input
      type="checkbox"
      id="toggle3"
      onChange={() => handleToggleClick('Toggle 3')}
    />
    <label htmlFor="toggle3" className={styles.slider}></label>
  </div>
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
