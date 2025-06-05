from facenet_pytorch import InceptionResnetV1, MTCNN
import torch
from PIL import Image
import numpy as np

# Load pretrained FaceNet and MTCNN
device = 'cuda' if torch.cuda.is_available() else 'cpu'
mtcnn = MTCNN(image_size=160, margin=0, min_face_size=20, device=device)
print("mtcnn loaded")
# print(mtcnn)
model = InceptionResnetV1(pretrained='vggface2').eval().to(device)
print("model loaded")
# print(model)


# Load and detect face
def get_embedding(img_path):
    img = Image.open(img_path)
    face = mtcnn(img)
    if face is not None:
        face = face.unsqueeze(0).to(device)
        embedding = model(face)
        return embedding
    return None

# Compare two faces
emb1 = get_embedding("data/keanu2.jpg")
emb2 = get_embedding("data/keanu1.jpg")
print("len of emb1:", emb1.shape if emb1 is not None else "None")

# display the cropped faces
def show_face(img_path, cropped_path):
    img = Image.open(img_path)
    face = mtcnn(img)
    if face is not None:
        face_np = face.permute(1, 2, 0).cpu().numpy()  # (H, W, C)
        face_np = np.clip(face_np * 255, 0, 255).astype(np.uint8)

        # save image
        Image.fromarray(face_np).save(cropped_path)
        #Image.fromarray(face_np).show()
    else:
        print(f"No face detected in {img_path}")

# save cropped faces


if emb1 is not None:
    show_face("data/keanu1.jpg", "data/keanu1_cropped.jpg")

if emb2 is not None:
    show_face("data/keanu2.jpg", "data/keanu2_cropped.jpg")



# Cosine similarity
if emb1 is not None and emb2 is not None:
    cos_sim = torch.nn.functional.cosine_similarity(emb1, emb2)
    print(f"Similarity: {cos_sim.item():.4f}")
else:
    print("Face not detected in one of the images.")
