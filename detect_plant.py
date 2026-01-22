import json
import os

import requests


API_KEY = os.getenv("PLANTNET_API_KEY", "2b10EfVpLTVMBcHs9nZrBldLP")

# 📸 Chemin vers ton image
IMAGE_PATH = "image.jpg"

if not os.path.exists(IMAGE_PATH):
    print("❌ Image introuvable :", IMAGE_PATH)
    raise SystemExit(1)

BASE_URL = "https://my-api.plantnet.org/v2/identify/all"

params = {"api-key": API_KEY}
data = {"organs": "leaf"}

print("Envoi de l'image a l'API...")

with open(IMAGE_PATH, "rb") as f:
    files = {"images": f}
    response = requests.post(BASE_URL, params=params, data=data, files=files, timeout=60)

if response.status_code != 200:
    print("Erreur API :", response.status_code)
    try:
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except Exception:
        print(response.text)
    raise SystemExit(1)

data = response.json()

print("\nREPONSE COMPLETE JSON :")
print(json.dumps(data, indent=2, ensure_ascii=False))

# 🌿 Extraire le meilleur résultat
if "results" in data and len(data["results"]) > 0:
    best = data["results"][0]
    species = best["species"]["scientificNameWithoutAuthor"]
    score = best["score"]

    print("\nRESULTAT PRINCIPAL :")
    print(f"Plante detectee : {species}")
    print(f"Confiance : {round(score * 100, 2)} %")
else:
    print("Aucune plante reconnue")
