from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Add CORS middleware to allow cross-origin requests.
# Keep the current development behavior; production deployments should restrict
# this to the actual frontend origin(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/change_car_color")
async def change_color(file: UploadFile = File(...), r: int = 255, g: int = 0, b: int = 0):
    # Import on demand: this module loads local dataset annotations at import time.
    from colorChangeFastAPI_partseg import change_car_color as change_car_color_impl

    return await change_car_color_impl(file, r, g, b)


@app.post("/segment_car")
async def segment(file: UploadFile = File(...)):
    # Import on demand so the heavy Detectron2 model is initialized only when
    # segmentation is requested, not when the API server starts.
    from segmentation_FastAPI import segment_car as segment_car_impl

    return await segment_car_impl(file)


@app.post("/segment_car_rims")
async def segment_rims(car_file: UploadFile = File(...), rim_file: UploadFile = File(...)):
    # This module loads local dataset annotations at import time.
    from rim_change_coco_FastAPI import change_rims as change_rims_impl

    return await change_rims_impl(car_file, rim_file)


@app.post("/generate_3d")
async def generate_3d_api(file: UploadFile = File(...)):
    # Construct the Gradio client only when 3D generation is requested.
    from API_file_return_3d import generate_3d as generate_3d_impl

    return await generate_3d_impl(file)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
