import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const FaceDetector = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const canvasRef = useRef();

  const [detModel, setDetModel] = useState("retinaface");
  const [embedModel, setEmbedModel] = useState("Facenet");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setImagePreview(imgURL);
    setBoxes([]); // Clear old boxes

    const formData = new FormData();
    formData.append("image", file);
    formData.append("det_model", detModel);
    formData.append("embed_model", embedModel);

    try {
      const res = await axios.post("http://localhost:8000/detect_faces", formData);
      console.log("🔍 Full API Response:", res.data); // DEBUG: See full response
      
      if (Array.isArray(res.data.boxes)) {
        console.log("✅ Detected boxes:", res.data.boxes);
        console.log("📊 Number of boxes:", res.data.boxes.length);
        setBoxes(res.data.boxes);
      } else {
        console.error("❌ Invalid response format for boxes:", res.data.boxes);
        console.error("📋 Response type:", typeof res.data.boxes);
      }
    } catch (err) {
      console.error("💥 Error detecting faces:", err);
    }
  };

  // ✅ Draw boxes after image & boxes are ready
  useEffect(() => {
    console.log("🎨 useEffect triggered - boxes:", boxes.length);
    
    const img = document.getElementById("source-img");
    const canvas = canvasRef.current;
    
    console.log("🖼️ Image element:", img ? "Found" : "Not found");
    console.log("🎯 Canvas element:", canvas ? "Found" : "Not found");
    console.log("📦 Boxes length:", boxes.length);
    
    if (!img || !canvas) {
      console.log("⚠️ Missing img or canvas, returning early");
      return;
    }

    if (boxes.length === 0) {
      console.log("⚠️ No boxes to draw, returning early");
      return;
    }

    const ctx = canvas.getContext("2d");

    // Wait for image to load
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      console.log("⚠️ Image not loaded yet, waiting...");
      img.onload = () => {
        console.log("🎉 Image loaded, retrying draw");
        // Retry after image loads
        setTimeout(() => {
          drawBoxes(img, canvas, ctx);
        }, 100);
      };
      return;
    }

    drawBoxes(img, canvas, ctx);
  }, [boxes, imagePreview]);

  const drawBoxes = (img, canvas, ctx) => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    console.log("📐 Image dimensions:", width, "x", height);
    console.log("📐 Canvas current size:", canvas.width, "x", canvas.height);

    canvas.width = width;
    canvas.height = height;

    console.log("📐 Canvas new size:", canvas.width, "x", canvas.height);

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // DON'T draw the image on canvas - let the img element handle that
    // ctx.drawImage(img, 0, 0, width, height); // ❌ Remove this line

    // Set up drawing style
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(0, 255, 0, 0.2)"; // Semi-transparent fill

    console.log("🎨 Drawing", boxes.length, "boxes");

    boxes.forEach((box, index) => {
      console.log(`📦 Box ${index}:`, box);
      console.log(`   Position: (${box.x}, ${box.y})`);
      console.log(`   Size: ${box.w} x ${box.h}`);
      
      // Draw stroke
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      // Draw fill
      ctx.fillRect(box.x, box.y, box.w, box.h);
      
      // Draw box number
      ctx.fillStyle = "lime";
      ctx.font = "16px Arial";
      ctx.fillText(`Box ${index + 1}`, box.x, box.y - 5);
      ctx.fillStyle = "rgba(0, 255, 0, 0.2)"; // Reset fill
    });

    console.log("✅ Finished drawing boxes");
  };

  // Add a test function to create dummy boxes
  const addTestBoxes = () => {
    const testBoxes = [
      { x: 50, y: 50, w: 100, h: 100 },
      { x: 200, y: 150, w: 120, h: 120 }
    ];
    console.log("🧪 Adding test boxes:", testBoxes);
    setBoxes(testBoxes);
  };

  return (
    <div>
      <h2>Face Detection - Debug Version</h2>

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
      
      {/* Debug button */}
      <button 
        onClick={addTestBoxes} 
        style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "3px" }}
        disabled={!imagePreview}
      >
        Add Test Boxes
      </button>

      {/* Debug info */}
      {imagePreview && (
        <div style={{ margin: "10px 0", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
          <strong>Debug Info:</strong><br />
          Boxes loaded: {boxes.length}<br />
          Image preview: {imagePreview ? "✅" : "❌"}<br />
          {boxes.length > 0 && (
            <details>
              <summary>Box Details</summary>
              <pre>{JSON.stringify(boxes, null, 2)}</pre>
            </details>
          )}
        </div>
      )}

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
            <h4>Output (Boxes: {boxes.length})</h4>
            <div
              style={{
                maxWidth: "800px",
                maxHeight: "600px",
                overflow: "auto",
                position: "relative", // ✅ Added explicit relative positioning
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
                  pointerEvents: "none",
                  border: "2px dashed red" // ✅ Debug border to see canvas position
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