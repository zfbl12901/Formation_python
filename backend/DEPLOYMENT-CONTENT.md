# Déploiement du Backend avec le Dossier Content

Le backend a besoin d'accéder au dossier `content/` qui contient tous les fichiers Markdown. Voici comment s'assurer que le dossier est accessible en production.

## 🔍 Problème

Le backend cherche les fichiers `.md` dans le dossier `content/`. En production, ce dossier doit être accessible au backend déployé.

## ✅ Solutions selon la plateforme

### Option 1 : Railway

Railway copie automatiquement tous les fichiers du repository. Pour que le dossier `content/` soit accessible :

1. **Configuration du service** :
   - Créez un service "Backend" dans Railway
   - Railway détectera automatiquement le dossier `backend/`
   - **Important** : Le dossier `content/` doit être au même niveau que `backend/` dans votre repository

2. **Variable d'environnement** :
   - Ajoutez : `CONTENT_DIR=../content`
   - Ou laissez le backend utiliser la détection automatique

3. **Structure du repository** :
   ```
   Formation_python/
   ├── backend/
   │   ├── main.py
   │   └── ...
   └── content/          ← Doit être accessible
       ├── 01-introduction.md
       └── ...
   ```

4. **Configuration Railway** :
   - Root Directory : `/backend` (Railway cherchera dans `backend/`)
   - Le dossier `content/` sera accessible via `../content` depuis `backend/`

### Option 2 : Render

1. **Configuration du service** :
   - Créez un "Web Service"
   - Root Directory : `backend`
   - Build Command : `pip install -r requirements.txt`
   - Start Command : `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Variable d'environnement** :
   - `CONTENT_DIR=../content`
   - `CORS_ORIGINS=https://zfbl12901.github.io`

3. **Note** : Render copie tout le repository, donc `content/` sera accessible via `../content`

### Option 3 : Docker

Si vous utilisez Docker :

1. **Build depuis la racine** :
   ```bash
   docker build -f backend/Dockerfile -t formation-python-backend .
   ```
   Note : Le `.` à la fin indique que le build se fait depuis la racine du projet.

2. **Le Dockerfile copiera automatiquement** :
   - Le code du backend
   - Le dossier `content/` dans `/app/content/`

3. **Variable d'environnement** (optionnelle) :
   ```bash
   docker run -e CONTENT_DIR=/app/content formation-python-backend
   ```

### Option 4 : VPS / Serveur dédié

1. **Cloner le repository complet** :
   ```bash
   git clone https://github.com/zfbl12901/Formation_python.git
   cd Formation_python
   ```

2. **Structure** :
   ```
   Formation_python/
   ├── backend/
   └── content/    ← Accessible depuis backend/
   ```

3. **Démarrer le backend** :
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## 🔧 Détection automatique

Le backend a été mis à jour pour détecter automatiquement le dossier `content/` :

1. Il essaie d'abord la variable d'environnement `CONTENT_DIR`
2. Sinon, il essaie plusieurs chemins possibles :
   - `../content` (développement local)
   - `./content` (si content est dans backend/)
   - `/app/content` (Docker)
   - Depuis le repo root

## ✅ Vérification

Pour vérifier que le backend trouve bien les fichiers :

1. **Tester l'API** :
   ```bash
   curl https://your-backend-url.com/api/lessons
   ```

2. **Vérifier les logs** :
   - Si vous voyez "Ajoutez des fichiers Markdown dans le dossier content/", le dossier n'est pas trouvé
   - Si vous voyez une liste de leçons, tout fonctionne !

3. **Vérifier le chemin** :
   - Ajoutez un log dans `backend/main.py` :
   ```python
   print(f"CONTENT_DIR: {CONTENT_DIR}")
   print(f"CONTENT_DIR exists: {CONTENT_DIR.exists()}")
   print(f"Files in CONTENT_DIR: {list(CONTENT_DIR.glob('*.md'))}")
   ```

## 🐛 Dépannage

### Le backend ne trouve pas les fichiers

1. **Vérifiez la structure** :
   - Le dossier `content/` doit être au même niveau que `backend/`
   - Les fichiers `.md` doivent être dans `content/`

2. **Vérifiez les permissions** :
   - Le backend doit avoir les droits de lecture sur `content/`

3. **Vérifiez le chemin** :
   - Utilisez la variable d'environnement `CONTENT_DIR` pour forcer un chemin spécifique

4. **Vérifiez les logs** :
   - Les logs du backend indiqueront le chemin utilisé

### Railway ne trouve pas content/

Si Railway ne trouve pas le dossier `content/` :

1. Vérifiez que le dossier est bien dans le repository GitHub
2. Vérifiez que Railway a accès à tout le repository (pas seulement `backend/`)
3. Utilisez `CONTENT_DIR=../content` comme variable d'environnement

### Render ne trouve pas content/

1. Vérifiez que "Root Directory" est bien `backend`
2. Le dossier `content/` sera accessible via `../content`
3. Utilisez `CONTENT_DIR=../content` comme variable d'environnement

## 📝 Notes importantes

- Le dossier `content/` doit être **commité dans Git** pour être accessible en production
- Ne mettez pas `content/` dans `.gitignore`
- Le backend cherche automatiquement le dossier, mais vous pouvez forcer un chemin avec `CONTENT_DIR`

