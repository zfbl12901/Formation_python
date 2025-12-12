# Configuration CORS pour le Déploiement

Si vous déployez le frontend et le backend sur des domaines différents, vous devrez configurer CORS dans FastAPI.

## Configuration CORS dans main.py

Ajoutez ceci dans `backend/main.py` :

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Développement local
        "https://votre-username.github.io",  # GitHub Pages
        "https://votre-domaine.com",  # Votre domaine de production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Pour la Production

Pour autoriser tous les origines (moins sécurisé mais pratique pour commencer) :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Moins sécurisé
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Ou mieux, utilisez une variable d'environnement :

```python
import os

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

