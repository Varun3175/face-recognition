from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def identify_dummy():
    return {"message": "Identify endpoint not implemented yet."}
