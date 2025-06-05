import torch
import torch.nn.functional as F

# Suppose 'backbone' is your trained feature extractor (e.g., a ResNet)
# Load your trained backbone model
# backbone = ... (load your model here)

def get_embedding(backbone, img_tensor):
    backbone.eval()
    with torch.no_grad():
        emb = backbone(img_tensor)
        emb = F.normalize(emb)
    return emb

# Example: compare two images
img1 = torch.randn(1, 3, 112, 112)  # Example image tensor
img2 = torch.randn(1, 3, 112, 112)

emb1 = get_embedding(backbone, img1)
emb2 = get_embedding(backbone, img2)

cos_sim = F.cosine_similarity(emb1, emb2)
print("Cosine similarity:", cos_sim.item())
