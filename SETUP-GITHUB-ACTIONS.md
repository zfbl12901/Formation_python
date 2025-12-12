# 🚀 Configuration GitHub Actions - Guide Rapide

## ✅ Ce qui a été créé

### Workflows GitHub Actions

1. **`.github/workflows/ci-cd.yml`** - Pipeline CI/CD complet
   - Teste backend et frontend
   - Build le frontend
   - Déploie sur GitHub Pages

2. **`.github/workflows/deploy-pages.yml`** - Déploiement GitHub Pages
   - Build et déploie automatiquement le frontend
   - S'exécute sur push vers main/master

3. **`.github/workflows/test.yml`** - Tests automatiques
   - Prêt pour ajouter vos tests

4. **`.github/workflows/lint.yml`** - Vérification du code
   - Lint backend (flake8, black)
   - Lint frontend (ESLint - à configurer)

5. **`.github/workflows/deploy-backend.yml`** - Déploiement backend
   - Prêt pour Railway/Render

6. **`.github/workflows/docker-build.yml`** - Build Docker
   - Build les images Docker pour backend et frontend

### Configuration

- **`.gitignore`** - Mis à jour avec les exclusions nécessaires
- **`frontend/vite.config.js`** - Configuré pour GitHub Pages avec base path
- **`backend/main.py`** - CORS configuré pour la production
- **`docker-compose.yml`** - Configuration Docker complète
- **`backend/Dockerfile`** - Image Docker pour le backend
- **`frontend/Dockerfile`** - Image Docker pour le frontend

### Documentation

- **`DEPLOYMENT.md`** - Guide complet de déploiement
- **`README-DEPLOYMENT.md`** - Guide rapide GitHub Actions
- **`backend/CORS.md`** - Documentation CORS

## 🎯 Étapes pour Mettre en Ligne

### Étape 1 : Préparer le Repository

1. **Initialiser Git** (si pas déjà fait) :
   ```bash
   git init
   git add .
   git commit -m "Initial commit avec GitHub Actions"
   ```

2. **Créer le repository sur GitHub** :
   - Allez sur GitHub.com
   - Créez un nouveau repository (ex: `Formation_python`)
   - **Ne cochez PAS** "Initialize with README" si vous avez déjà des fichiers

3. **Pousser le code** :
   ```bash
   git remote add origin https://github.com/votre-username/Formation_python.git
   git branch -M main
   git push -u origin main
   ```

### Étape 2 : Activer GitHub Pages

1. Allez dans votre repository GitHub
2. **Settings** → **Pages**
3. Sous "Source", sélectionnez **"GitHub Actions"**
4. Cliquez sur **"Save"**

### Étape 3 : Premier Déploiement

1. Le workflow `deploy-pages.yml` s'exécutera automatiquement
2. Allez dans l'onglet **"Actions"** pour voir le déploiement
3. Une fois terminé, votre site sera disponible sur :
   - `https://votre-username.github.io/Formation_python/`

### Étape 4 : Configurer le Backend (Optionnel)

Si vous voulez aussi déployer le backend :

#### Option A : Railway (Recommandé - Gratuit)

1. Créez un compte sur [Railway](https://railway.app)
2. Créez un nouveau projet depuis GitHub
3. Sélectionnez votre repository
4. Configurez :
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Ajoutez la variable d'environnement :
   - `ALLOWED_ORIGINS`: `https://votre-username.github.io`
6. Copiez l'URL de votre backend (ex: `https://votre-backend.railway.app`)

#### Option B : Render

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau "Web Service"
3. Connectez votre repository GitHub
4. Configurez comme Railway

### Étape 5 : Connecter Frontend et Backend

1. **Créer un secret GitHub** :
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Nom : `VITE_API_URL`
   - Valeur : URL de votre backend (ex: `https://votre-backend.railway.app`)

2. **Mettre à jour le workflow** :
   - Le workflow utilisera automatiquement ce secret pour le build

## 🔍 Vérification

### Vérifier que tout fonctionne

1. **Frontend** :
   - Visitez `https://votre-username.github.io/Formation_python/`
   - Vérifiez que l'interface se charge

2. **Backend** (si déployé) :
   - Testez `https://votre-backend.railway.app/api/lessons`
   - Vérifiez que l'API répond

3. **Logs** :
   - Allez dans Actions → Voir les logs des workflows
   - Vérifiez qu'il n'y a pas d'erreurs

## 📝 Notes Importantes

### Base Path GitHub Pages

Si votre repository s'appelle `Formation_python`, le base path est déjà configuré.

Si votre repository a un autre nom, modifiez `frontend/vite.config.js` :

```javascript
base: process.env.GITHUB_PAGES ? '/votre-nom-repo/' : '/',
```

### CORS Backend

Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:5173` (développement)
- GitHub Pages (automatiquement si vous configurez `ALLOWED_ORIGINS`)

Pour ajouter votre domaine GitHub Pages, modifiez `backend/main.py` ou ajoutez la variable d'environnement `ALLOWED_ORIGINS`.

### Variables d'Environnement

**Frontend** : Utilisez des secrets GitHub pour `VITE_API_URL`
**Backend** : Configurez `ALLOWED_ORIGINS` dans votre hébergeur (Railway/Render)

## 🐛 Dépannage

### Le workflow échoue

1. Vérifiez les logs dans Actions
2. Testez le build localement :
   ```bash
   cd frontend && npm run build
   ```

### Erreur 404 sur GitHub Pages

1. Vérifiez que GitHub Pages est activé (Settings → Pages)
2. Vérifiez le base path dans `vite.config.js`
3. Attendez quelques minutes (le déploiement peut prendre du temps)

### Le frontend ne trouve pas l'API

1. Vérifiez `VITE_API_URL` dans les secrets GitHub
2. Vérifiez que le backend est accessible publiquement
3. Vérifiez CORS dans `backend/main.py`

## 🎉 C'est Prêt !

Une fois ces étapes complétées, votre projet sera automatiquement déployé à chaque push sur `main` ou `master`.

Pour plus de détails, consultez :
- `DEPLOYMENT.md` - Guide complet
- `README-DEPLOYMENT.md` - Documentation détaillée

Bon déploiement ! 🚀

