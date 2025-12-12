# Déploiement du Backend

Pour que votre application fonctionne sur GitHub Pages, vous devez déployer le backend FastAPI séparément.

## 🚀 Options de déploiement

### Option 1 : Railway (Recommandé - Gratuit)

1. **Créer un compte Railway** : https://railway.app
2. **Créer un nouveau projet** :
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository `Formation_python`
3. **Configurer le service** :
   - Railway détectera automatiquement le backend Python
   - Ajoutez une variable d'environnement :
     - `CORS_ORIGINS`: `https://zfbl12901.github.io`
4. **Obtenir l'URL** :
   - Railway vous donnera une URL comme : `https://your-app.railway.app`
   - L'URL de l'API sera : `https://your-app.railway.app/api`

5. **Configurer le frontend** :
   - Dans GitHub : Settings → Secrets and variables → Actions → Secrets
   - Créez un secret : `VITE_API_URL` = `https://your-app.railway.app`

### Option 2 : Render (Gratuit)

1. **Créer un compte Render** : https://render.com
2. **Créer un nouveau Web Service** :
   - Connectez votre repository GitHub
   - Sélectionnez le dossier `backend/`
   - Build Command : `pip install -r requirements.txt`
   - Start Command : `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Configurer les variables d'environnement** :
   - `CORS_ORIGINS`: `https://zfbl12901.github.io`
4. **Obtenir l'URL** :
   - Render vous donnera une URL comme : `https://your-app.onrender.com`
   - L'URL de l'API sera : `https://your-app.onrender.com/api`

5. **Configurer le frontend** :
   - Dans GitHub : Settings → Secrets and variables → Actions → Secrets
   - Créez un secret : `VITE_API_URL` = `https://your-app.onrender.com`

### Option 3 : Heroku (Payant après le plan gratuit)

1. **Créer un compte Heroku** : https://heroku.com
2. **Installer Heroku CLI**
3. **Créer l'application** :
   ```bash
   cd backend
   heroku create your-app-name
   ```
4. **Configurer les variables** :
   ```bash
   heroku config:set CORS_ORIGINS=https://zfbl12901.github.io
   ```
5. **Déployer** :
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 4 : VPS / Serveur dédié

Si vous avez un serveur VPS :

1. **Installer les dépendances** :
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv nginx
   ```

2. **Cloner le repository** :
   ```bash
   git clone https://github.com/zfbl12901/Formation_python.git
   cd Formation_python/backend
   ```

3. **Créer l'environnement virtuel** :
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Configurer systemd** :
   Créez `/etc/systemd/system/formation-python-backend.service` :
   ```ini
   [Unit]
   Description=Formation Python Backend
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/path/to/Formation_python/backend
   Environment="PATH=/path/to/Formation_python/backend/venv/bin"
   ExecStart=/path/to/Formation_python/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

5. **Démarrer le service** :
   ```bash
   sudo systemctl enable formation-python-backend
   sudo systemctl start formation-python-backend
   ```

6. **Configurer Nginx** (reverse proxy) :
   Créez `/etc/nginx/sites-available/formation-python-backend` :
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## ⚙️ Configuration du Frontend

Une fois le backend déployé :

1. **Obtenir l'URL du backend** (ex: `https://your-backend.railway.app`)

2. **Configurer le secret GitHub** :
   - Allez dans votre repository : Settings → Secrets and variables → Actions → Secrets
   - Créez un nouveau secret :
     - Name : `VITE_API_URL`
     - Value : `https://your-backend.railway.app` (sans `/api` à la fin)

3. **Redéployer le frontend** :
   - Le workflow `.github/workflows/deploy-pages-branch.yml` utilisera automatiquement cette URL lors du build

## 🔍 Vérification

1. **Tester l'API backend** :
   ```bash
   curl https://your-backend.railway.app/api/lessons
   ```

2. **Vérifier CORS** :
   - L'API doit accepter les requêtes depuis `https://zfbl12901.github.io`
   - Vérifiez dans `backend/main.py` que `CORS_ORIGINS` inclut votre URL GitHub Pages

3. **Tester le frontend** :
   - Ouvrez la console du navigateur (F12)
   - Vérifiez que les requêtes vers `/api/lessons` fonctionnent
   - Si vous voyez des erreurs CORS, vérifiez la configuration du backend

## 🐛 Dépannage

### Erreur CORS

Si vous voyez des erreurs CORS dans la console :

1. Vérifiez que `CORS_ORIGINS` dans le backend inclut votre URL GitHub Pages
2. Vérifiez que l'URL est exacte (avec ou sans `/` à la fin)
3. Redémarrez le backend après modification

### L'API ne répond pas

1. Vérifiez que le backend est bien démarré
2. Testez l'URL directement dans le navigateur
3. Vérifiez les logs du backend (Railway/Render/Heroku)

### Les fichiers .md ne sont pas trouvés

1. Vérifiez que le dossier `content/` est bien présent dans le backend déployé
2. Vérifiez que les fichiers `.md` sont bien dans le repository GitHub
3. Vérifiez les logs du backend pour les erreurs de lecture de fichiers

## 📝 Notes

- Le backend doit être accessible publiquement (pas de localhost)
- L'URL doit utiliser HTTPS (requis pour GitHub Pages)
- Le backend doit accepter les requêtes CORS depuis votre domaine GitHub Pages

