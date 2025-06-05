from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import register, identify, health, detect_faces

app = FastAPI(title="Face ID Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register.router, prefix="/register")
app.include_router(identify.router, prefix="/identify")
app.include_router(health.router, prefix="/health")
app.include_router(detect_faces.router, prefix="/detect_faces")  # ✅ Add this
