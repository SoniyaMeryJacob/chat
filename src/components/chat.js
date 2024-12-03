import { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function GmailStyleChat() {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({ 1: [], 2: [], 3: [] });
  const [currentMessage, setCurrentMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const openChat = (chatNumber) => {
    setActiveChat(chatNumber);
    setMenuOpen(false);
  };

  const sendMessage = () => {
    if (currentMessage.trim() || selectedFile) {
      setMessages((prev) => ({
        ...prev,
        [activeChat]: [
          ...prev[activeChat],
          { text: currentMessage, file: selectedFile },
        ],
      }));
      setCurrentMessage('');
      setSelectedFile(null); // Reset the file after sending the message
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuIcon}>
          ☰
        </button>
        <h1 className={styles.title}>Chat App</h1>
      </div>

      {/* Side Menu */}
      <div className={`${styles.sideMenu} ${menuOpen ? styles.open : ''}`}>
        {[1, 2, 3].map((chat) => (
          <div
            key={chat}
            className={`${styles.chatItem} ${activeChat === chat ? styles.active : ''}`}
            onClick={() => openChat(chat)}
          >
            <span>Chat {chat}</span>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      {activeChat && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>Welcome to Chat {activeChat}</div>
          <div className={styles.chatMessages}>
            {messages[activeChat].map((msg, index) => (
              <div key={index} className={styles.message}>
                {msg.text}
                {msg.file && (
                  <div className={styles.fileInfo}>
                    <strong>File: </strong> {msg.file.name}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.inputArea}>
            <input
              type="text"
              placeholder="Type a message"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className={styles.input}
            />
            <input
              type="file"
              onChange={handleFileChange}
              className={styles.fileInput}
              id="file-upload"
            />
            <label className={styles.fileInputLabel} htmlFor="file-upload">
              Upload File
            </label>
            <button onClick={sendMessage} className={styles.sendButton}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
