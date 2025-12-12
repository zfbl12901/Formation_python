# Dockerfile pour le backend FastAPI
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de requirements
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application
COPY . .

# Copier le dossier content depuis le répertoire parent
# Note: Ce Dockerfile doit être exécuté depuis le répertoire racine du projet
# avec: docker build -f backend/Dockerfile -t formation-python-backend .
COPY content/ ./content/

# Créer le dossier content s'il n'existe pas (fallback)
RUN mkdir -p ./content

# Exposer le port
EXPOSE 8000

# Commande pour démarrer l'application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

