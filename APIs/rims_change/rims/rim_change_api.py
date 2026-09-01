import cv2
import numpy as np
import os
import tkinter as tk
from tkinter import filedialog
from pycocotools.coco import COCO

# Define paths
DATA_DIR = os.path.join("Car-Parts-Segmentation", "testset")
ANNOTATION_FILE = os.path.join(DATA_DIR, "annotations.json")
RIMS_DIR = "rims images"

# Load COCO annotations
coco = COCO(ANNOTATION_FILE)

def load_rim_image():
    """Open file dialog to select a rim image."""
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename(title="Select Rim Image", filetypes=[("Image Files", "*.png;*.jpg;*.jpeg")])
    return cv2.imread(file_path, cv2.IMREAD_UNCHANGED) if file_path else None

def extract_rim_masks(image_path):
    """Extract rim masks from the given car image using COCO annotations."""
    image_id = next((img['id'] for img in coco.dataset['images'] if img['file_name'] in image_path), None)
    
    if image_id is None:
        return None, "Error: Image not found in annotations."
    
    rim_category_id = 19  # COCO category ID for wheels/rims
    ann_ids = coco.getAnnIds(imgIds=image_id, catIds=[rim_category_id], iscrowd=None)
    anns = coco.loadAnns(ann_ids)
    
    masks = [coco.annToMask(ann) for ann in anns if 'segmentation' in ann]
    
    if not masks:
        return None, "Error: No rim masks detected."
    
    return masks, "Success"

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

def segment_car_rims(image_path):
    """Perform segmentation and replace the car rims."""
    image = cv2.imread(image_path)
    if image is None:
        return None, "Error: Image not found."
    
    rim_overlay = load_rim_image()
    if rim_overlay is None:
        return None, "Error: Rim image not selected."
    
    masks, message = extract_rim_masks(image_path)
    if masks is None:
        return None, message
    
    for mask in masks:
        overlay_rim(image, rim_overlay, mask)
    
    input_filename = os.path.splitext(os.path.basename(image_path))[0]
    output_path = f"{input_filename}_rim_changed.jpg"
    cv2.imwrite(output_path, image)
    return output_path, "Success"

def main():
    """Main function to select a car image and process it."""
    root = tk.Tk()
    root.withdraw()
    car_image_path = filedialog.askopenfilename(title="Select Car Image", filetypes=[("Image Files", "*.png;*.jpg;*.jpeg")])
    if not car_image_path:
        print("No car image selected.")
        return
    
    output_path, message = segment_car_rims(car_image_path)
    if output_path:
        print(f"Rim changed image saved at: {output_path}")
    else:
        print(f"Error: {message}")

if __name__ == '__main__':
    main()
