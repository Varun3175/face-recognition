from insightface.app import FaceAnalysis
import numpy as np
import cv2

face_model = FaceAnalysis()
face_model.prepare(ctx_id=0)

def extract_embedding(image_bytes: bytes):
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    faces = face_model.get(img)
    if not faces:
        raise ValueError("No face detected.")
    return faces[0].embedding

def detect_faces(image_bytes: bytes):
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    faces = face_model.get(img)

    boxes = []
    for face in faces:
        x1, y1, x2, y2 = face.bbox.astype(int)
        boxes.append({"x": int(x1), "y": int(y1), "w": int(x2 - x1), "h": int(y2 - y1)})
    return boxes

