import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Configure the browser frontend origins via FRONTEND_ORIGINS (comma-separated).
# Defaults support Vite's common local development addresses.
frontend_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/change_car_color")
async def change_color(file: UploadFile = File(...), r: int = 255, g: int = 0, b: int = 0):
    # Import on demand: this module loads local dataset annotations at import time.
    try:
        from colorChangeFastAPI_partseg import change_car_color as change_car_color_impl
    except (ImportError, FileNotFoundError) as exc:
        raise HTTPException(
            status_code=503,
            detail="Color-change service unavailable: install its dependencies and provide the car-parts annotation dataset.",
        ) from exc

    return await change_car_color_impl(file, r, g, b)


@app.post("/segment_car")
async def segment(file: UploadFile = File(...)):
    # Import on demand so the heavy Detectron2 model is initialized only when
    # segmentation is requested, not when the API server starts.
    try:
        from segmentation_FastAPI import segment_car as segment_car_impl
    except (ImportError, OSError) as exc:
        raise HTTPException(
            status_code=503,
            detail="Segmentation service unavailable: install Detectron2 and ensure model weights can be loaded.",
        ) from exc

    return await segment_car_impl(file)


@app.post("/segment_car_rims")
async def segment_rims(car_file: UploadFile = File(...), rim_file: UploadFile = File(...)):
    # This module loads local dataset annotations at import time.
    try:
        from rim_change_coco_FastAPI import change_rims as change_rims_impl
    except (ImportError, FileNotFoundError) as exc:
        raise HTTPException(
            status_code=503,
            detail="Rim-change service unavailable: install its dependencies and provide the car-parts annotation dataset.",
        ) from exc

    return await change_rims_impl(car_file, rim_file)


@app.post("/generate_3d")
async def generate_3d_api(file: UploadFile = File(...)):
    # Construct the Gradio client only when 3D generation is requested.
    try:
        from API_file_return_3d import generate_3d as generate_3d_impl
    except ImportError as exc:
        raise HTTPException(
            status_code=503,
            detail="3D-generation service unavailable: install the Python dependencies.",
        ) from exc

    return await generate_3d_impl(file)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
