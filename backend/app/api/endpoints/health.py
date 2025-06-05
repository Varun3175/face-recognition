from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def identify_dummy():
    return {"message": "Health endpoint not implemented yet."}
