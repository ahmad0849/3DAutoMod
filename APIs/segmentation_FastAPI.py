from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
import torch
from detectron2.config import get_cfg
from detectron2.engine import DefaultPredictor
from detectron2 import model_zoo
from detectron2.data import MetadataCatalog
from fastapi.responses import Response
from io import BytesIO
from PIL import Image

app = FastAPI()

# Load Detectron2 Model
def setup_model():
    cfg = get_cfg()
    cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
    cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
    cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.5
    cfg.MODEL.DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    return DefaultPredictor(cfg)

predictor = setup_model()

@app.post("/segment_car")
async def segment_car(file: UploadFile = File(...)):
    image = np.array(Image.open(BytesIO(await file.read())).convert("RGB"))
    
    # Perform segmentation
    outputs = predictor(image)
    instances = outputs["instances"].to("cpu")
    pred_classes = instances.pred_classes.numpy()
    masks = instances.pred_masks.numpy()
    
    # COCO class ID for 'car' is 2
    car_class_id = 2
    car_masks = masks[pred_classes == car_class_id]
    
    if len(car_masks) > 0:
        car_mask = np.any(car_masks, axis=0)  # Combine multiple car masks
        segmented_car = np.zeros_like(image)
        segmented_car[car_mask] = image[car_mask]
        
        # Convert to JPEG for response
        _, buffer = cv2.imencode(".jpg", segmented_car)
        return Response(content=buffer.tobytes(), media_type="image/jpeg")
    
    return {"error": "No car detected in the image."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
