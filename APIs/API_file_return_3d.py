from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import uvicorn
from gradio_client import Client, handle_file
import shutil
import os

app = FastAPI()
client = Client("JeffreyXiang/TRELLIS")

@app.post("/generate_3d")
async def generate_3d(file: UploadFile = File(...)):
    # Save uploaded file
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Start session
    client.predict(api_name="/start_session")
    
    # Preprocess image
    client.predict(
        image=handle_file(file_path),
        api_name="/preprocess_image"
    )
    
    # Get seed
    seed_result = client.predict(
        randomize_seed=True,
        seed=0,
        api_name="/get_seed"
    )
    
    # Generate 3D model
    image_to_3d_result = client.predict(
        image=handle_file(file_path),
        multiimages=[],
        seed=seed_result,
        ss_guidance_strength=7.5,
        ss_sampling_steps=12,
        slat_guidance_strength=3,
        slat_sampling_steps=12,
        multiimage_algo="stochastic",
        api_name="/image_to_3d"
    )
    
    # Remove temp file
    os.remove(file_path)

    # Extract video file path
    video_path = image_to_3d_result.get("video", "")

    if os.path.exists(video_path):
        return FileResponse(video_path, media_type="video/mp4", filename="generated_3D.mp4")
    else:
        return {"error": "Video file not found."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
