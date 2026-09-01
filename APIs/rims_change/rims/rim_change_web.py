from flask import Flask, request, jsonify, send_file
import cv2
import numpy as np
import os
from pycocotools.coco import COCO

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ANNOTATION_FILE = os.path.join("Car-Parts-Segmentation", "testset", "annotations.json")

# Load COCO annotations
coco = COCO(ANNOTATION_FILE)


def extract_rim_masks(image_filename):
    """Extract rim masks from the given car image using COCO annotations."""
    image_id = next((img['id'] for img in coco.dataset['images'] if img['file_name'] == image_filename), None)
    if image_id is None:
        return None, "Error: Image not found in annotations."
    
    rim_category_id = 19  # COCO category ID for wheels/rims
    ann_ids = coco.getAnnIds(imgIds=image_id, catIds=[rim_category_id], iscrowd=None)
    anns = coco.loadAnns(ann_ids)
    
    masks = [coco.annToMask(ann) for ann in anns if 'segmentation' in ann]
    return masks if masks else None, "Error: No rim masks detected."


def overlay_rim(image, rim_overlay, mask):
    """Overlay the rim image onto the detected rim location with transparency."""
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
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
                )
        else:
            image[y:y+h, x:x+w] = resized_rim


def segment_car_rims(car_image_path, rim_image_path):
    """Perform segmentation and replace the car rims."""
    image = cv2.imread(car_image_path)
    if image is None:
        return None, "Error: Car image not found."
    
    rim_overlay = cv2.imread(rim_image_path, cv2.IMREAD_UNCHANGED)
    if rim_overlay is None:
        return None, "Error: Rim image not found."
    
    masks, message = extract_rim_masks(os.path.basename(car_image_path))
    if masks is None:
        return None, message
    
    for mask in masks:
        overlay_rim(image, rim_overlay, mask)
    
    output_path = os.path.join(UPLOAD_FOLDER, f"rim_changed_{os.path.basename(car_image_path)}")
    cv2.imwrite(output_path, image)
    return output_path, "Success"


@app.route("/rim-change", methods=["POST"])
def rim_change():
    if "car_image" not in request.files or "rim_image" not in request.files:
        return jsonify({"error": "Both car_image and rim_image are required."}), 400
    
    car_image = request.files["car_image"]
    rim_image = request.files["rim_image"]
    
    car_path = os.path.join(UPLOAD_FOLDER, car_image.filename)
    rim_path = os.path.join(UPLOAD_FOLDER, rim_image.filename)
    car_image.save(car_path)
    rim_image.save(rim_path)
    
    output_path, message = segment_car_rims(car_path, rim_path)
    if output_path:
        return send_file(output_path, mimetype="image/jpeg")
    else:
        return jsonify({"error": message}), 400


if __name__ == "__main__":
    app.run(debug=True)