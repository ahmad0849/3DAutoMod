# not working
# olderway works

from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
import json
import os
from fastapi.responses import Response
from io import BytesIO
from PIL import Image
from pycocotools.coco import COCO

app = FastAPI()

# File Paths
ANNOTATION_FILE = r"Car-Parts-Segmentation/testset/annotations.json"  # Update path if needed

# Load COCO annotations
with open(ANNOTATION_FILE, "r") as f:
    coco_data = json.load(f)

coco = COCO(ANNOTATION_FILE)

# Define car body part IDs (excluding wheels, mirrors, lights)
car_body_part_ids = {2, 3, 4, 6, 8, 9, 10, 12, 14, 17, 18}


def extract_body_masks(image_filename):
    """Extract segmentation masks for car body parts."""
    image_id = next((img['id'] for img in coco_data['images'] if img['file_name'] == image_filename), None)
    if image_id is None:
        return None, "Error: Image not found in annotations."
    
    ann_ids = coco.getAnnIds(imgIds=image_id, catIds=list(car_body_part_ids), iscrowd=None)
    anns = coco.loadAnns(ann_ids)
    masks = [coco.annToMask(ann) for ann in anns if 'segmentation' in ann]

    return masks if masks else None, "Error: No car body masks detected."


def apply_color(image, masks, color, alpha=0.6):
    """Apply the selected color to the car body parts using blending."""
    color = np.array(color, dtype=np.uint8)
    combined_mask = np.zeros_like(image[:, :, 0], dtype=np.uint8)

    for mask in masks:
        combined_mask = np.maximum(combined_mask, mask)

    mask_3ch = cv2.merge([combined_mask] * 3)
    color_overlay = np.full_like(image, color, dtype=np.uint8)

    blended_image = cv2.addWeighted(image, 1 - alpha, color_overlay, alpha, 0)
    result = np.where(mask_3ch > 0, blended_image, image)

    return result


@app.post("/change_car_color")
async def change_car_color(file: UploadFile = File(...), r: int = 255, g: int = 0, b: int = 0):
    """API endpoint to change car color."""
    image_bytes = await file.read()
    image = np.array(Image.open(BytesIO(image_bytes)).convert("RGB"))
    
    masks, message = extract_body_masks(file.filename)
    if masks is None:
        return {"error": message}

    new_color = (b, g, r)  # Convert RGB to BGR
    processed_image = apply_color(image, masks, new_color)

    _, buffer = cv2.imencode(".jpg", processed_image)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
