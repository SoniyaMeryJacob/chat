//chat.js
import React, { useState } from "react";
import styles from "../styles/Chat.module.css";
import { useRouter } from "next/router";

export default function HomePage() {
  const [openBot, setOpenBot] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState(""); // Ensures input is a string
  const [activeToggle, setActiveToggle] = useState(null);
  const [isExpanded, setIsExpanded] = useState({}); // To manage expansion per bot
  const [isSecondExpanded, setIsSecondExpanded] = useState({}); // To manage second expansion
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visibility state
  const [chatHistory, setChatHistory] = useState({});
  const [chatSessions, setChatSessions] = useState([]); // Initialize as an empty array
  const [activeChat, setActiveChat] = useState(1);

  const layoutClasses = {
    1: styles.layout1,
    2: styles.layout2,
    3: styles.layout3,
  };



  const toggleBot = (bot) => {
    setOpenBot(openBot === bot ? null : bot);
  };

  const handleSendMessage = () => {
    const inputString = String(input); // Ensure input is a string
    if (inputString.trim()) {
      const newMessage = { text: inputString };

      // Ensure "Session 1" is created if it doesn't exist
      if (!Array.isArray(chatSessions)) {
        setChatSessions([1]); // Reset to an array with "Session 1"
      } else if (!chatSessions.includes(1)) {
        setChatSessions([...chatSessions, 1]); // Add "Session 1" to the list
      }

      // Set "Session 1" as active if no session is active
      if (!activeChat) {
        setActiveChat(1);
      }

      // Update messages for the specific bot and session
      const updatedMessages = {
        ...messages,
        [openBot]: {
          ...(messages[openBot] || {}),
          [activeChat || 1]: [
            ...(messages[openBot]?.[activeChat || 1] || []),
            newMessage,
          ],
        },
      };

      // Update chat history for the specific bot and session
      const updatedHistory = {
        ...chatHistory,
        [openBot]: {
          ...(chatHistory[openBot] || {}),
          [activeChat || 1]: [
            ...(chatHistory[openBot]?.[activeChat || 1] || []),
            newMessage,
          ],
        },
      };

      setMessages(updatedMessages);
      setChatHistory(updatedHistory);
      setInput(""); // Reset input field
    }
  };

  const handleFileUpload = (bot, event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      // Simulate file upload (or replace with your own upload logic)
      const uploadUrl = `/uploads/${file.name}`; // Example URL for the uploaded file

      const newMessage = {
        fileName: file.name,
        fileUrl: uploadUrl, // File URL for download/view
      };

      // Update messages for the specific bot and session
      const updatedMessages = {
        ...messages,
        [bot]: {
          ...(messages[bot] || {}),
          [activeChat]: [...(messages[bot]?.[activeChat] || []), newMessage],
        },
      };

      // Update chat history for the specific bot and session
      const updatedHistory = {
        ...chatHistory,
        [bot]: {
          ...(chatHistory[bot] || {}),
          [activeChat]: [...(chatHistory[bot]?.[activeChat] || []), newMessage],
        },
      };

      setMessages(updatedMessages);
      setChatHistory(updatedHistory);

      // Reset the file input field
      event.target.value = "";
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
    // Determine the next session number based on existing sessions
    const nextSessionId =
      Array.isArray(chatSessions) && chatSessions.length > 0
        ? Math.max(...chatSessions) + 1
        : 1;

    // Add the new session to the chatSessions list and set it as active
    setChatSessions([...chatSessions, nextSessionId]);
    setActiveChat(nextSessionId);

    // Optionally, initialize messages and history for the new session
    setMessages((prevMessages) => ({
      ...prevMessages,
      [openBot]: {
        ...(prevMessages[openBot] || {}),
        [nextSessionId]: [],
      },
    }));
    setChatHistory((prevHistory) => ({
      ...prevHistory,
      [openBot]: {
        ...(prevHistory[openBot] || {}),
        [nextSessionId]: [],
      },
    }));
  };

  const handleCloseHistory = () => {
    setIsSidebarOpen(false); // Closes chat history when header is clicked
  };
  const handleSessionClick = (sessionId) => {
    // Set the clicked session as active
    setActiveChat(sessionId);

    // Refresh chat window content by ensuring messages for the session are displayed
    const updatedMessages = {
      ...messages,
      [openBot]: {
        ...(messages[openBot] || {}),
        [sessionId]: messages[openBot]?.[sessionId] || [], // Ensure session has messages
      },
    };

    setMessages(updatedMessages);

    // Optionally, perform a "refresh" action like re-rendering a component
    setInput(""); // Clear the input field to reflect a clean state
  };

  const handleDeleteSession = (sessionId) => {
    // Ask for confirmation before deleting the session
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (confirmDelete) {
      // Filter out the session to delete it
      const updatedSessions = chatSessions.filter((id) => id !== sessionId);
      setChatSessions(updatedSessions);

      // Remove messages and history associated with this session
      const updatedMessages = { ...messages };
      delete updatedMessages[openBot]?.[sessionId];
      setMessages(updatedMessages);

      const updatedHistory = { ...chatHistory };
      delete updatedHistory[openBot]?.[sessionId];
      setChatHistory(updatedHistory);
    }
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

        {/* Sidebar for Chat History */}
        {isSidebarOpen && openBot && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3 onClick={handleCloseHistory}>Chat {openBot} History</h3>

              {/* + Icon to add new chat */}
              <button
                className={styles.newChatButton}
                onClick={handleAddNewChat}
                aria-label="Add New Chat"
              >
                <img
                  src="/icons/new.png"
                  alt="New Chat"
                  className={styles.newChatIcon}
                />
                <span className={styles.newChatText}>New Chat</span>
              </button>
            </div>
            <div className={styles.historyList}>
              {Array.isArray(chatSessions) &&
                chatSessions.map((sessionId) => (
                  <div
                    key={sessionId}
                    className={styles.historyItem}
                    style={{
                      margin: "5px 0",
                      cursor: "pointer",
                      color: activeChat === sessionId ? "blue" : "black", // Highlight active session
                    }}
                    onClick={() => handleSessionClick(sessionId)} // Use a separate handler for session click
                  >
                    {`Session ${sessionId}`}
                    {/* Add delete button */}
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering session click
                        handleDeleteSession(sessionId);
                      }}
                      aria-label="Delete Chat Session"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!openBot && <h1>RAG APP</h1>}
        {openBot && (
          <div className={`${styles.frame} ${layoutClasses[openBot]}`}>
            <h2 className={styles.frameHeading}>
              {" "}
              Welcome to Session {activeChat} of Chat {openBot}
            </h2>
            <div className={styles.frameBody}>
              {openBot === 1 && (
                <>
                  <input
                    id="text-entry"
                    type="text"
                    className={styles.textEntryField}
                    placeholder="Enter text here..."
                  />

                  <div className={styles.chat1Buttons}>
                    <button
                      className={styles.expandButton}
                      onClick={() => handleExpandToggle(1)}
                    >
                      {isExpanded[1] ? "Collapse" : "Expand"}
                    </button>
                    <button
                      className={styles.expandButton}
                      onClick={() => handleSecondExpandToggle(1)}
                    >
                      {isSecondExpanded[1] ? "Collapse" : "Expand"}
                    </button>
                  </div>

                  {isExpanded[1] && (
                    <div className={styles.expandContent}>
                      <p className={styles.loremText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                      <div className={styles.messageList}>
                        {(messages[openBot]?.[activeChat] || []).map(
                          (msg, index) => (
                            <p key={index} className={styles.messageItem}>
                              {msg.text || (
                                <a
                                  href={msg.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.fileLink}
                                >
                                  {msg.fileName}
                                </a>
                              )}
                            </p>
                          )
                        )}
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
                    {["Toggle 1", "Toggle 2", "Toggle 3"].map((toggle) => (
                      <div
                        key={toggle}
                        className={`${styles.toggleSwitch} ${
                          activeToggle === toggle ? styles.active : ""
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
                    {isExpanded[2] ? "Collapse" : "Expand"}
                  </button>

                  {isExpanded[2] && (
                    <div className={styles.expandContent}>
                      <p className={styles.loremText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                      <div className={styles.messageList}>
                        {(messages[openBot]?.[activeChat] || []).map(
                          (msg, index) => (
                            <p key={index} className={styles.messageItem}>
                              {msg.text || (
                                <a
                                  href={msg.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.fileLink}
                                >
                                  {msg.fileName}
                                </a>
                              )}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <input
                    id="text"
                    type="text"
                    className={styles.textEntryField}
                    placeholder="Enter text here..."
                  />

                  <div className={styles.toggleButtonsContainer}>
                    {["Toggle 1", "Toggle 2", "Toggle 3"].map((toggle) => (
                      <div
                        key={toggle}
                        className={`${styles.toggleSwitch} ${
                          activeToggle === toggle ? styles.active : ""
                        }`}
                        onClick={() => handleToggleClick(toggle)}
                      ></div>
                    ))}
                  </div>

                  <button
                    className={styles.expandButton}
                    onClick={() => handleSecondExpandToggle(2)}
                  >
                    {isSecondExpanded[2] ? "Collapse" : "Expand"}
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
                    {isExpanded[3] ? "Collapse" : "Expand"}
                  </button>

                  {isExpanded[3] && (
                    <div className={styles.expandContent}>
                      <p className={styles.loremText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Curabitur dignissim elit vel augue tempor, id sagittis
                        dolor pharetra. Donec scelerisque urna a felis congue,
                        in sodales justo suscipit.
                      </p>
                      <div className={styles.messageList}>
                        {(messages[openBot]?.[activeChat] || []).map(
                          (msg, index) => (
                            <p key={index} className={styles.messageItem}>
                              {msg.text || (
                                <a
                                  href={msg.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.fileLink}
                                >
                                  {msg.fileName}
                                </a>
                              )}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles.toggleButtonsRow}>
                    <div className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="toggle1"
                        onChange={() => handleToggleClick("Toggle 1")}
                      />
                      <label
                        htmlFor="toggle1"
                        className={styles.slider}
                      ></label>
                    </div>
                    <div className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="toggle2"
                        onChange={() => handleToggleClick("Toggle 2")}
                      />
                      <label
                        htmlFor="toggle2"
                        className={styles.slider}
                      ></label>
                    </div>
                    <div className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        id="toggle3"
                        onChange={() => handleToggleClick("Toggle 3")}
                      />
                      <label
                        htmlFor="toggle3"
                        className={styles.slider}
                      ></label>
                    </div>
                  </div>

                  <button
                    className={styles.expandButton}
                    onClick={() => handleSecondExpandToggle(3)}
                  >
                    {isSecondExpanded[3] ? "Collapse" : "Expand"}
                  </button>

                  {isSecondExpanded[3] && (
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

                  <input
                    id="text"
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
                {openBot === bot ? "▲" : "▼"}
              </span>
            </div>

            {openBot === bot && (
              <div className={styles.chatBox}>
                <div className={styles.chatContainer}>
                  <div className={styles.chatMessages}>
                    {(messages[openBot]?.[activeChat] || []).map(
                      (msg, index) => (
                        <div key={index} className={styles.message}>
                          {msg.text || "Uploaded File"}
                        </div>
                      )
                    )}
                  </div>

                  <div className={styles.inputArea}>
                    <input
                      id={`input-${bot}`}
                      type="text"
                      className={styles.inputField}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                    />
                    <input
                      id={`file-upload-${bot}`}
                      type="file"
                      className={styles.fileUpload}
                      onChange={(e) => handleFileUpload(bot, e)}
                    />
                    <button
                      className={styles.sendButton}
                      onClick={handleSendMessage}
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
