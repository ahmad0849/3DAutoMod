from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
from fastapi.responses import Response
from io import BytesIO
from PIL import Image

app = FastAPI()

def segment_car(image):
    """Uses GrabCut to segment the car body."""
    mask = np.zeros(image.shape[:2], np.uint8)
    height, width = image.shape[:2]
    rect = (20, 20, width - 40, height - 40)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    cv2.grabCut(image, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    mask = np.where((mask == 2) | (mask == 0), 0, 1).astype("uint8")
    return mask

def apply_realistic_color(image, mask, new_color):
    """Applies the selected color while preserving texture."""
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    new_color_bgr = np.uint8([[new_color]])
    new_color_hsv = cv2.cvtColor(new_color_bgr, cv2.COLOR_BGR2HSV)[0][0]
    hsv[:, :, 0] = np.where(mask == 1, new_color_hsv[0], hsv[:, :, 0])
    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

@app.post("/change_car_color_olderway")
async def change_car_color(file: UploadFile = File(...), r: int = 255, g: int = 0, b: int = 0):
    car_image = np.array(Image.open(BytesIO(await file.read())).convert("RGB"))
    car_mask = segment_car(car_image)
    new_color = (b, g, r)
    processed_image = apply_realistic_color(car_image, car_mask, new_color)
    _, buffer = cv2.imencode(".jpg", processed_image)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9200, log_level="info")