import React, { useState } from 'react';
import styles from '../styles/SlidingChat.module.css';

export default function SlidingChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input }]);
      setInput('');
    }
  };

  const handleFileUpload = (event) => {
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
            setMessages([...messages, { fileName: data.fileUrl }]);
          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {messages.map((msg, index) => (
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <input
          type="file"
          className={styles.fileUpload}
          onChange={handleFileUpload}
        />
        <button className={styles.sendButton} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
