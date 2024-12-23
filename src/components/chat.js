import React, { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function HomePage() {
  const [openBot, setOpenBot] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState({});
  const [frameContent, setFrameContent] = useState(null);
  const [activeToggle, setActiveToggle] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // State for expand/collapse
  const [isSecondExpanded, setIsSecondExpanded] = useState(false); // State for second expandable field

  // Function to toggle open bots
  const toggleBot = (bot) => {
    setOpenBot(openBot === bot ? null : bot);
    if (openBot === bot) {
      setFrameContent(null);
    } else {
      const heading = `Welcome to Chat ${bot}`;
      const botMessages = messages[bot] || [];
      const body = botMessages
        .map((msg) => (msg.text ? msg.text : `File: ${msg.fileName}`))
        .join('\n');
      setFrameContent({ heading, body });
    }
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

      const heading = `Welcome to Chat ${bot}`;
      const botMessages = updatedMessages[bot];
      const body = botMessages
        .map((msg) => (msg.text ? msg.text : `File: ${msg.fileName}`))
        .join('\n');
      setFrameContent({ heading, body });

      // Display the messages in the first expandable button
      if (openBot === bot) {
        const newBody = botMessages
          .map((msg) => (msg.text ? msg.text : `File: ${msg.fileName}`))
          .join('\n');
        setFrameContent({ heading, body: newBody });
      }
    }
  };

  // Function to handle file upload
  const handleFileUpload = (bot, event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.fileUrl) {
            const newMessage = { fileName: data.fileUrl };
            const updatedMessages = {
              ...messages,
              [bot]: [...(messages[bot] || []), newMessage],
            };
            setMessages(updatedMessages);

            const heading = `Welcome to Chat ${bot}`;
            const botMessages = updatedMessages[bot];
            const body = botMessages
              .map((msg) => (msg.text ? msg.text : `File: ${msg.fileName}`))
              .join('\n');
            setFrameContent({ heading, body });

            // Update the first expandable section with the new file message
            if (openBot === bot) {
              const newBody = botMessages
                .map((msg) => (msg.text ? msg.text : `File: ${msg.fileName}`))
                .join('\n');
              setFrameContent({ heading, body: newBody });
            }
          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
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
        {frameContent && (
          <div className={styles.frame}>
            <h2 className={styles.frameHeading}>{frameContent.heading}</h2>
            <p className={styles.frameBody}>
              {isExpanded
                ? frameContent.body || "Pellentesque a purus rhoncus, interdum metus in, hendrerit purus. Cras fermentum elit quis ante feugiat, at tempus justo ullamcorper. Duis rhoncus orci in dui vulputate viverra. Ut congue dictum imperdiet. Quisque gravida mattis egestas. Integer vehicula lobortis orci a hendrerit. Morbi sed turpis accumsan, bibendum augue ut, scelerisque dolor. Ut porttitor diam eu nisi faucibus maximus. Aenean nec tincidunt massa."
                : ''}
            </p>

            {/* Add a text entry field in the frameBody */}
            <input
              type="text"
              className={styles.textEntryField}
              placeholder="Enter text here..."
            />

            {/* Expand/Collapse Button for first section */}
            <button
              className={styles.expandButton}
              onClick={handleExpandToggle}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>

            {/* Expand/Collapse Button for second section (empty content) */}
            <button
              className={styles.expandButton}
              onClick={handleSecondExpandToggle}
            >
              {isSecondExpanded ? 'Collapse' : 'Expand'}
            </button>

            {/* Second expandable content (empty initially) */}
            {isSecondExpanded && (
              <div className={styles.secondExpandableField}>
                {/* This is where additional content can be added later */}
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
