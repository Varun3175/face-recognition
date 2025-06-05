from fastapi import APIRouter, UploadFile, Form
from app.services.face import extract_embedding
from app.services.vector import upsert_embedding
import uuid

router = APIRouter()

@router.post("/")
async def register_face(name: str = Form(...), image: UploadFile = Form(...)):
    image_data = await image.read()
    embedding = extract_embedding(image_data)
    person_id = str(uuid.uuid4())
    upsert_embedding(person_id, embedding, {"name": name})
    return {"id": person_id, "name": name}
