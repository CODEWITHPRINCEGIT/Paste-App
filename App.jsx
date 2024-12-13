import React, { useState, useEffect } from "react";
import "./App.css";
import { FaTrash, FaEdit, FaCopy, FaShareAlt } from "react-icons/fa";

const App = () => {
  const [pastes, setPastes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Load pastes from localStorage on mount
  useEffect(() => {
    const storedPastes = JSON.parse(localStorage.getItem("pastes")) || [];
    setPastes(storedPastes);
  }, []);

  // Save pastes to localStorage whenever pastes change
  useEffect(() => {
    localStorage.setItem("pastes", JSON.stringify(pastes));
  }, [pastes]);

  const handleAddPaste = () => {
    if (editingIndex !== null) {
      // Update existing paste
      const updatedPastes = [...pastes];
      updatedPastes[editingIndex] = { title, content };
      setPastes(updatedPastes);
      setEditingIndex(null);
    } else {
      // Add new paste
      setPastes([...pastes, { title, content }]);
    }
    setTitle("");
    setContent("");
  };

  const handleDeletePaste = (index) => {
    const updatedPastes = pastes.filter((_, i) => i !== index);
    setPastes(updatedPastes);
  };

  const handleEditPaste = (index) => {
    setTitle(pastes[index].title);
    setContent(pastes[index].content);
    setEditingIndex(index);
  };

  const handleCopyPaste = (content) => {
    navigator.clipboard.writeText(content);
    alert("Content copied to clipboard!");
  };

  const handleSharePaste = (paste) => {
    if (navigator.share) {
      navigator.share({
        title: paste.title,
        text: paste.content,
      })
        .then(() => alert("Paste shared successfully!"))
        .catch((error) => console.error("Error sharing paste:", error));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const filteredPastes = pastes.filter(
    (paste) =>
      paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paste.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header>
        <h1>Paste App</h1>
      </header>
      <main>
        <div className="form">
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <button onClick={handleAddPaste}>
            {editingIndex !== null ? "Update Paste" : "Add Paste"}
          </button>
        </div>

        <div className="search">
          <input
            type="text"
            placeholder="Search pastes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="paste-list">
          {filteredPastes.map((paste, index) => (
            <div className="paste" key={index}>
              <h3>{paste.title}</h3>
              <p>{paste.content}</p>
              <div className="actions">
                <button onClick={() => handleCopyPaste(paste.content)}>
                  <FaCopy /> Copy
                </button>
                <button onClick={() => handleEditPaste(index)}>
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDeletePaste(index)}>
                  <FaTrash /> Delete
                </button>
                <button onClick={() => handleSharePaste(paste)}>
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
