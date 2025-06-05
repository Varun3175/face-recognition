from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from deepface import DeepFace
import numpy as np
import cv2

router = APIRouter()

@router.post("/")
async def detect_faces_endpoint(
    image: UploadFile = File(...),
    det_model: str = Form("retinaface"),
    embed_model: str = Form("Facenet")
):
    image_bytes = await image.read()
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    faces = DeepFace.extract_faces(img_path=img, detector_backend=det_model, enforce_detection=False)
    boxes = [
        {
            "x": int(f["facial_area"]["x"]),
            "y": int(f["facial_area"]["y"]),
            "w": int(f["facial_area"]["w"]),
            "h": int(f["facial_area"]["h"]),
        } for f in faces
    ]

    return {"boxes": boxes}
