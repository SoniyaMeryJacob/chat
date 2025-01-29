//chat.js
import React, { useState } from "react";
import styles from "../styles/Chat.module.css";

export default function HomePage() {
  const [openBot, setOpenBot] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState(""); // Ensures input is a string
  const [activeToggle, setActiveToggle] = useState(null);
  const [isExpanded, setIsExpanded] = useState({}); // To manage expansion per bot
  const [isSecondExpanded, setIsSecondExpanded] = useState({}); // To manage second expansion
  const [isThirdExpanded, setIsThirdExpanded] = useState({}); // To manage third expansion
  const [isForthExpanded, setIsForthExpanded] = useState({}); // To manage forth expansion});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visibility state
  const [chatHistory, setChatHistory] = useState({});
  const [chatSessions, setChatSessions] = useState([]); // Initialize as an empty array
  const [activeChat, setActiveChat] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState({});

  const layoutClasses = {
    1: styles.layout1,
    2: styles.layout2,
    3: styles.layout3,
  };

  const toggleBot = (bot) => {
    setOpenBot(openBot === bot ? null : bot);
  };

  const handleToggleClick = (toggle) => {
    setActiveToggle(activeToggle === toggle ? null : toggle);
  };

  const handleSendMessage = (e) => {
    const inputString = String(input); // Ensure input is a string
    if ((e.key === "Enter" || !e.key) && inputString.trim()) {
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

  const handleUpload = async (bot, fileCategory) => {
    const fileKey = `${bot}-${fileCategory}`;
    const file = selectedFiles[fileKey];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (result.success) {
        const fileMessage = {
          fileUrl: `/api/files/${result.filename}`, // Serve from local storage
          fileName: file.name,
          category: `File ${fileCategory}`,
        };
  
        const updatedMessages = {
          ...messages,
          [bot]: {
            ...(messages[bot] || {}),
            [activeChat]: [...(messages[bot]?.[activeChat] || []), fileMessage],
          },
        };
        setMessages(updatedMessages);
  
        setSelectedFiles((prev) => ({
          ...prev,
          [fileKey]: null,
        }));
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("An error occurred during file upload.");
    }
  };
  

  const handleFileChange = (bot, event, fileCategory) => {
    const file = event.target.files[0];
    setSelectedFiles((prev) => ({
      ...prev,
      [`${bot}-${fileCategory}`]: file, // Store the file object instead of just the name
    }));
  };

  const handleExpandToggle = (bot) => {
    setIsExpanded((prev) => ({
      ...prev,
      [bot]: !prev[bot],
    }));
  };

  const handleSecondExpandToggle = (bot) => {
    setIsSecondExpanded({
      ...isSecondExpanded,
      [bot]: !isSecondExpanded[bot],
    });
  };

  const handleThirdExpandToggle = (bot) => {
    setIsThirdExpanded({
      ...isThirdExpanded,
      [bot]: !isThirdExpanded[bot],
    });
  };

  const handleForthExpandToggle = (bot) => {
    setIsForthExpanded({
      ...isForthExpanded,
      [bot]: !isForthExpanded[bot],
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
              {/*----------------------------------------------------CHAT1---------------------------------------------------------- */}
              {openBot === 1 && (
                <>
                  <input
                    id="text-msg"
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleSendMessage}
                    className={styles.inputField}
                  />
                  <div className={styles.chat1Buttons}>
                    <button
                      className={styles.expandButton}
                      onClick={() => handleExpandToggle(1)}
                    >
                      {isExpanded[1] ? "Collapse" : "Text"}
                    </button>
                    <button
                      className={styles.expandButton}
                      onClick={() => handleSecondExpandToggle(1)}
                    >
                      {isSecondExpanded[1] ? "Collapse" : "Table"}
                    </button>
                    <button
                      className={styles.expandButton}
                      onClick={() => handleThirdExpandToggle(1)}
                    >
                      {isThirdExpanded[1] ? "Collapse" : "File 1 "}
                    </button>
                    <button
                      className={styles.expandButton}
                      onClick={() => handleForthExpandToggle(1)}
                    >
                      {isForthExpanded[1] ? "Collapse" : "File 2"}
                    </button>
                  </div>
                  {isExpanded[1] && (
                    <div className={styles.expandContent}>
                      <div className={styles.messageList}>
                        {messages[openBot]?.[activeChat]
                          ?.filter((msg) => !msg.category) // Only text messages
                          .map((msg, index) => (
                            <p key={index} className={styles.messageItem}>
                              {msg.text}
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
                  {isThirdExpanded[1] && (
                    <div className={styles.expandContent}>
                      {messages[openBot]?.[activeChat]
                        ?.filter((msg) => msg.category === "File 1") // Matches "File 1" category
                        .map((msg, index) => (
                          <p key={index} className={styles.messageItem}>
                            <a
                              href={msg.fileUrl} // File retrieved from MongoDB via API
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {msg.fileName}
                            </a>
                          </p>
                        ))}
                    </div>
                  )}

                  {isForthExpanded[1] && (
                    <div className={styles.expandContent}>
                      {messages[openBot]?.[activeChat]
                        ?.filter((msg) => msg.category === "File 2") // Matches "File 2" category
                        .map((msg, index) => (
                          <p key={index} className={styles.messageItem}>
                            <a
                              href={msg.fileUrl} // File retrieved from MongoDB via API
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {msg.fileName}
                            </a>
                          </p>
                        ))}
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
                </>
              )}
              {/*----------------------------------------------------CHAT2---------------------------------------------------------- */}
              {openBot === 2 && (
                <>
                  <button
                    className={styles.expandButton}
                    onClick={() => handleExpandToggle(2)}
                  >
                    {isExpanded[2] ? "Collapse" : "Text"}
                  </button>
                  {isExpanded[openBot] && openBot !== 1 && (
                    <div className={styles.expandContent}>
                      <div className={styles.messageList}>
                        {messages[openBot]?.[activeChat]?.map((msg, index) => (
                          <p key={index} className={styles.messageItem}>
                            {msg.text ? (
                              msg.text
                            ) : (
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
                        ))}
                      </div>
                    </div>
                  )}
                  <input
                    id="text-msg"
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleSendMessage}
                    className={styles.inputField}
                  />
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
                    onClick={() => handleSecondExpandToggle(2)}
                  >
                    {isSecondExpanded[2] ? "Collapse" : "Table"}
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
              {/*----------------------------------------------------CHAT3---------------------------------------------------------- */}
              {openBot === 3 && (
                <>
                  <button
                    className={styles.expandButton}
                    onClick={() => handleExpandToggle(3)}
                  >
                    {isExpanded[3] ? "Collapse" : "Text"}
                  </button>
                  {isExpanded[openBot] && openBot !== 1 && (
                    <div className={styles.expandContent}>
                      <div className={styles.messageList}>
                        {messages[openBot]?.[activeChat]?.map((msg, index) => (
                          <p key={index} className={styles.messageItem}>
                            {msg.text ? (
                              msg.text
                            ) : (
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
                        ))}
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
                    {isSecondExpanded[3] ? "Collapse" : "Table"}
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
                    id="text-msg"
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleSendMessage}
                    className={styles.inputField}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {/*----------------------------------------------------RIGHT SECTION-------------------------------------------------- */}
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
                <div className={styles.inputArea}>
                  {bot === 1 ? (
                    <>
                      <button
                        onClick={() =>
                          document.getElementById(`filename-${bot}-1`).click()
                        }
                      >
                        Choose File 1
                      </button>
                      <input
                        id={`filename-${bot}-1`}
                        type="file"
                        className={styles.fileUpload}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(bot, e, 1)}
                      />
                      <button
                        onClick={() =>
                          document.getElementById(`filename-${bot}-2`).click()
                        }
                      >
                        Choose File 2
                      </button>
                      <input
                        id={`filename-${bot}-2`}
                        type="file"
                        className={styles.fileUpload}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(bot, e, 2)}
                      />
                      {selectedFiles[`${bot}-1`] && (
                        <button
                          className={styles.uploadButton}
                          onClick={() => handleUpload(bot, 1)}
                        >
                          Upload File 1
                        </button>
                      )}
                      {selectedFiles[`${bot}-2`] && (
                        <button
                          className={styles.uploadButton}
                          onClick={() => handleUpload(bot, 2)}
                        >
                          Upload File 2
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          document.getElementById(`filename-${bot}-1`).click()
                        }
                      >
                        Choose File
                      </button>
                      <input
                        id={`filename-${bot}-1`}
                        type="file"
                        className={styles.fileUpload}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(bot, e, 1)}
                      />
                      {selectedFiles[`${bot}-1`] && (
                        <button
                          className={styles.uploadButton}
                          onClick={() => handleUpload(bot, 1)}
                        >
                          Upload File
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
