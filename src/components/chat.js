import React, { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function HomePage() {
  const [openBot, setOpenBot] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState({});
  const [frameContent, setFrameContent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const colors = ['#0dcaf0','#454545']; // Define colors

  // Sample Lorem Ipsum text
  const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget justo sit amet libero luctus interdum. Sed tincidunt, purus at luctus malesuada, urna justo pharetra erat, a tincidunt odio est a dui. Nam elementum, purus eget rhoncus condimentum, nunc metus tempor lectus, eu tempor libero nulla id dui. Donec in volutpat mi. Ut et mauris in lacus luctus feugiat a a lectus. Curabitur ac tristique justo.`;

  // Function to toggle open bots
  const toggleBot = (bot) => {
    setOpenBot(openBot === bot ? null : bot);
    if (openBot === bot) {
      setFrameContent(null); // Reset frame content when closing the chat
    } else {
      const heading = `Welcome to Chat ${bot}`;
      const botMessages = messages[bot] || [];
      setFrameContent({ heading, body: botMessages });
    }
  };

  // Function to handle sending a message
  const handleSendMessage = (bot) => {
    if (input[bot]?.trim()) {
      const newMessage = { text: input[bot] };

      // Update the messages state
      const updatedMessages = {
        ...messages,
        [bot]: [...(messages[bot] || []), newMessage],
      };
      setMessages(updatedMessages);

      // Update the input state
      setInput({ ...input, [bot]: '' });

      // Update the frame content
      const heading = `Welcome to Chat ${bot}`;
      const botMessages = updatedMessages[bot];
      setFrameContent({ heading, body: botMessages });
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

            // Update the frame content
            const heading = `Welcome to Chat ${bot}`;
            const botMessages = updatedMessages[bot];
            setFrameContent({ heading, body: botMessages });
          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  // Toggle expand/collapse of frame body content
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.homeContainer}>
      {/* Left Section with dynamic frame content */}
      <div className={styles.leftSection}>
        {frameContent && (
          <div className={styles.frame}>
            <h2 className={styles.frameHeading}>{frameContent.heading}</h2>
            <div className={styles.dropdownContainer}>
              <button className={styles.expandButton} onClick={toggleExpand}>
                {isExpanded ? '▲' : '▼ show messages'}
              </button>
              {isExpanded && (
                <div className={styles.frameBody}>
                  {frameContent.body.map((msg, index) => (
                    <p
                      key={index}
                      style={{
                        color: colors[index % colors.length], // Cycle through colors
                      }}
                    >
                      {msg.text ? msg.text : `File: ${msg.fileName}`}
                    </p>
                  ))}
                  {/* Sample Lorem Ipsum text */}
                  <p>{loremIpsumText}</p>
                </div>
              )}
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
