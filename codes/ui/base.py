import streamlit as st
from deepface import DeepFace
from PIL import Image
import numpy as np
import tempfile
import cv2

st.title("Face Detection with DeepFace")

uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    image = Image.open(uploaded_file).convert("RGB")
    st.image(image, caption="Uploaded Image", use_column_width=True)

    # Convert PIL image to numpy array
    img_array = np.array(image)

    # DeepFace expects BGR images
    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

    with st.spinner("Detecting faces..."):
        try:
            detections = DeepFace.extract_faces(img_path = img_bgr, enforce_detection=False)
            if detections:
                for face in detections:
                    x, y, w, h = face["facial_area"].values()
                    cv2.rectangle(img_array, (x, y), (x + w, y + h), (0, 255, 0), 2)
                st.image(img_array, caption="Detected Faces", use_column_width=True)
                st.success(f"Detected {len(detections)} face(s).")
            else:
                st.warning("No faces detected.")
        except Exception as e:
            st.error(f"Error: {e}")