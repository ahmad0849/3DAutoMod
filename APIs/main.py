from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
from fastapi.responses import Response
from io import BytesIO
from PIL import Image
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from colorChangeFastAPI_partseg import change_car_color as change_car_color_impl
from API_file_return_3d import generate_3d as generate_3d_impl
from rim_change_coco_FastAPI import change_rims as change_rims_impl

app = FastAPI()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.post("/change_car_color")
async def change_color(file: UploadFile = File(...), r: int = 255, g: int = 0, b: int = 0):
    return await change_car_color_impl(file, r, g, b)

@app.post("/segment_car")
async def segment(file: UploadFile = File(...)):
    return await segment_car(file)

@app.post("/segment_car_rims")
async def segment_rims(car_file: UploadFile = File(...), rim_file: UploadFile = File(...)):
    return await change_rims_impl(car_file, rim_file)

@app.post("/generate_3d")
async def generate_3d_api(file: UploadFile = File(...)):
    return await generate_3d_impl(file)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

