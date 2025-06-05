from retinaface import RetinaFace
import cv2
import matplotlib.pyplot as plt

def detect_faces_retina(image_path):
    img = cv2.imread(image_path)
    assert img is not None, "Image failed to load."

    detections = RetinaFace.detect_faces(image_path)

    if detections is None:
        print("No faces detected.")
        return img

    print(f"Detected {len(detections)} face(s).")
    for key in detections:
        x1, y1, x2, y2 = detections[key]['facial_area']
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    return img, detections

# Run detection
image_path = "data/sad_people.jpg"
# image_path = "data/preparing.png"
# image_path = "data/indians.png"
result, detections = detect_faces_retina(image_path)
# Resize window to fit on the screen if image is too large
screen_res = 1280, 720  # Example screen resolution
scale_width = screen_res[0] / result.shape[1]
scale_height = screen_res[1] / result.shape[0]
scale = min(scale_width, scale_height, 1.0)
window_width = int(result.shape[1] * scale)
window_height = int(result.shape[0] * scale)
resized_result = cv2.resize(result, (window_width, window_height), interpolation=cv2.INTER_AREA)

print("Detections:\n", detections)

cv2.imshow("Detected Faces", resized_result)
cv2.waitKey(0)
cv2.destroyAllWindows()
