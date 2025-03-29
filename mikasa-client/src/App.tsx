import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("ss", file);

      const response = await axios.post(
        `http://localhost:6600/mikasa/financier/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      setMessage("Error uploading file");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    try {
      const response = await axios.post(
        `http://localhost:6600/mikasa/financier/`,
        { query: "Bought iphone for 60k sbi and bananas for 20" },
        {
          headers: {
            "x-api-key": "",
          },
        }
      );
    } catch (error) {}
  };

  return (
    <div className="upload-container">
      <h2>Upload Transaction File</h2>
      <div className="file-input">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {message && <p className="message">{message}</p>}

      <button onClick={handlePost}>hit post query</button>
    </div>
  );
}

export default App;
