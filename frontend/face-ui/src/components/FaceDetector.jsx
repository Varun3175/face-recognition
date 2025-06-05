import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const FaceDetector = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const canvasRef = useRef();
  const [currentFile, setCurrentFile] = useState(null); // ✅ Added

  const [detModel, setDetModel] = useState("retinaface");
  const [embedModel, setEmbedModel] = useState("Facenet");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCurrentFile(file); // ✅ Added - Store the file

    const imgURL = URL.createObjectURL(file);
    setImagePreview(imgURL);
    setBoxes([]); // Clear old boxes

    const formData = new FormData();
    formData.append("image", file);
    formData.append("det_model", detModel);
    formData.append("embed_model", embedModel);

    try {
      const res = await axios.post("http://localhost:8000/detect_faces", formData);
      if (Array.isArray(res.data.boxes)) {
        console.log("Detected boxes:", res.data.boxes);
        setBoxes(res.data.boxes);
      } else {
        console.error("Invalid response format for boxes:", res.data.boxes);
      }
    } catch (err) {
      console.error("Error detecting faces:", err);
    }
  };

  // ✅ Added - Re-detect when models change
  useEffect(() => {
    if (currentFile) {
      // Re-run detection with current file and new models
      const formData = new FormData();
      formData.append("image", currentFile);
      formData.append("det_model", detModel);
      formData.append("embed_model", embedModel);

      axios.post("http://localhost:8000/detect_faces", formData)
        .then(res => {
          if (Array.isArray(res.data.boxes)) {
            console.log("Re-detected boxes with new model:", res.data.boxes);
            setBoxes(res.data.boxes);
          } else {
            console.error("Invalid response format for boxes:", res.data.boxes);
          }
        })
        .catch(err => console.error("Error re-detecting faces:", err));
    }
  }, [detModel, embedModel]); // Triggers when dropdowns change

  // ✅ Draw boxes after image & boxes are ready
  useEffect(() => {
    const img = document.getElementById("source-img");
    const canvas = canvasRef.current;
    if (!img || !canvas || boxes.length === 0) return;

    const ctx = canvas.getContext("2d");

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.clearRect(0, 0, width, height);
    // ✅ Removed ctx.drawImage line - this was covering the boxes

    ctx.strokeStyle = "lime";
    ctx.lineWidth = 4;

    boxes.forEach(box => {
      console.log("Drawing box at:", box.x, box.y, box.w, box.h);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
    });
  }, [boxes, imagePreview]);

  return (
    <div>
      <h2>Face Detection</h2>

      <label>Detection Model: </label>
      <select value={detModel} onChange={(e) => setDetModel(e.target.value)}>
        <option value="opencv">OpenCV</option>
        <option value="retinaface">RetinaFace</option>
        <option value="mtcnn">MTCNN</option>
        <option value="ssd">SSD</option>
        <option value="dlib">Dlib</option>
        <option value="mediapipe">MediaPipe</option>
      </select>

      <label style={{ marginLeft: "20px" }}>Embedding Model: </label>
      <select value={embedModel} onChange={(e) => setEmbedModel(e.target.value)}>
        <option value="Facenet">Facenet</option>
        <option value="ArcFace">ArcFace</option>
        <option value="Dlib">Dlib</option>
        <option value="SFace">SFace</option>
      </select>

      <br /><br />
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imagePreview && (
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          {/* Input Image */}
          <div>
            <h4>Input</h4>
            <div
              style={{
                maxWidth: "800px",
                maxHeight: "600px",
                overflow: "auto",
                border: "1px solid #ccc"
              }}
            >
              <img
                src={imagePreview}
                style={{ display: "block" }}
                alt="Input"
              />
            </div>
          </div>

          {/* Output Image with Bounding Boxes */}
          <div>
            <h4>Output</h4>
            <div
              style={{
                maxWidth: "800px",
                maxHeight: "600px",
                overflow: "auto",
                position: "relative", // ✅ Added explicit positioning
                border: "1px solid #ccc"
              }}
            >
              <img
                id="source-img"
                src={imagePreview}
                alt="Output"
                style={{
                  display: "block"
                }}
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none"
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceDetector;