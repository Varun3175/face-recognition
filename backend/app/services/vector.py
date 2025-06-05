from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct

client = QdrantClient("localhost", port=6333)

def upsert_embedding(id, vector, payload):
    client.upsert(
        collection_name="faces",
        points=[PointStruct(id=id, vector=vector.tolist(), payload=payload)]
    )

def search_embedding(query_vector, top_k=5):
    return client.search(
        collection_name="faces",
        query_vector=query_vector.tolist(),
        limit=top_k
    )
