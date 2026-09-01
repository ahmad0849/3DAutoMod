from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
import os
from fastapi.responses import Response
from io import BytesIO
from PIL import Image
from pycocotools.coco import COCO

app = FastAPI()

# Define paths
DATA_DIR = "Car-Parts-Segmentation/testset"
ANNOTATION_FILE = os.path.join(DATA_DIR, "annotations.json")
coco = COCO(ANNOTATION_FILE)

rim_category_id = 19  # COCO category ID for wheels/rims

def extract_rim_masks(image_path):
    """Extract rim masks from the given car image using COCO annotations."""
    image_id = next((img['id'] for img in coco.dataset['images'] if img['file_name'] in image_path), None)
    if image_id is None:
        return None, "Error: Image not found in annotations."
    
    ann_ids = coco.getAnnIds(imgIds=image_id, catIds=[rim_category_id], iscrowd=None)
    anns = coco.loadAnns(ann_ids)
    
    masks = [coco.annToMask(ann) for ann in anns if 'segmentation' in ann]
    if not masks:
        return None, "Error: No rim masks detected."
    
    return masks, "Success"

def overlay_rim(image, rim_overlay, mask):
    """Overlay the rim image onto the detected rim location with transparency."""
    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        resized_rim = cv2.resize(rim_overlay, (w, h))
        
        if resized_rim.shape[2] == 4:  # Check if rim image has an alpha channel
            alpha_channel = resized_rim[:, :, 3] / 255.0
            rim_rgb = resized_rim[:, :, :3]
            
            for c in range(3):  # Blend the images
                image[y:y+h, x:x+w, c] = (
                    rim_rgb[:, :, c] * alpha_channel + 
                    image[y:y+h, x:x+w, c] * (1 - alpha_channel)
                ).astype(np.uint8)
        else:
            image[y:y+h, x:x+w] = resized_rim

@app.post("/change_rims")
async def change_rims(car_file: UploadFile = File(...), rim_file: UploadFile = File(...)):
    """Change the rims in the car image with the provided rim image."""
    car_image = np.array(Image.open(BytesIO(await car_file.read())).convert("RGB"))
    rim_image = np.array(Image.open(BytesIO(await rim_file.read())).convert("RGBA"))
    
    masks, message = extract_rim_masks(car_file.filename)
    if masks is None:
        return {"error": message}
    
    for mask in masks:
        overlay_rim(car_image, rim_image, mask)
    
    _, buffer = cv2.imencode(".jpg", car_image)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
