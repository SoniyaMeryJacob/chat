import React, { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function HomePage() {
  const [openBot, setOpenBot] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState({});
  const [frameContent, setFrameContent] = useState(''); // New state for left frame content

  // Function to toggle open bots
  const toggleBot = (bot) => {
    setOpenBot(openBot === bot ? null : bot);
    if (openBot === bot) {
      setFrameContent(''); // Reset frame content when closing the chat
    } else {
      const welcomeMessage = `Welcome to Chat ${bot}`;
      const botMessages = messages[bot] || [];
      const messageContent = [
        welcomeMessage,
        ...botMessages.map((msg, index) =>
          msg.text ? msg.text : `File: ${msg.fileName}`
        ),
      ].join('\n');
      setFrameContent(messageContent); // Update frame content with bot messages
    }
  };

  // Function to handle sending a message
  const handleSendMessage = (bot) => {
    if (input[bot]?.trim()) {
      const newMessage = { text: input[bot] };
      setMessages({
        ...messages,
        [bot]: [...(messages[bot] || []), newMessage],
      });
      setInput({ ...input, [bot]: '' });
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
            setMessages({
              ...messages,
              [bot]: [...(messages[bot] || []), newMessage],
            });
          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  return (
    <div className={styles.homeContainer}>
      {/* Left Section with dynamic frame content */}
      <div className={styles.leftSection}>
        {frameContent && <div className={styles.frame}>{frameContent}</div>} {/* Display the frame content */}
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
