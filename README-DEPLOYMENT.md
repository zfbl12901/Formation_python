# Guide de Déploiement GitHub Actions

Ce guide vous explique comment configurer le déploiement automatique de votre projet via GitHub Actions.

## 📋 Prérequis

1. Un compte GitHub
2. Un repository GitHub pour votre projet
3. (Optionnel) Un compte sur un service d'hébergement (Railway, Render, Vercel, etc.)

## 🚀 Configuration Initiale

### 1. Activer GitHub Pages

1. Allez dans votre repository GitHub
2. Settings → Pages
3. Source : Sélectionnez "GitHub Actions"
4. Cliquez sur "Save"

### 2. Workflows Disponibles

Le projet contient plusieurs workflows GitHub Actions :

#### `ci-cd.yml` - Pipeline CI/CD complet
- Teste le backend et le frontend
- Build le frontend
- Déploie automatiquement

#### `deploy-pages.yml` - Déploiement GitHub Pages
- Build et déploie le frontend sur GitHub Pages
- S'exécute automatiquement sur push vers main/master

#### `test.yml` - Tests automatiques
- Exécute les tests (quand vous les ajouterez)

#### `lint.yml` - Vérification du code
- Vérifie le style de code

## 🔧 Configuration pour GitHub Pages

### Option A : Déploiement automatique (Recommandé)

Le workflow `deploy-pages.yml` est déjà configuré. Il suffit de :

1. Pousser votre code sur GitHub
2. Le workflow s'exécutera automatiquement
3. Votre site sera disponible sur : `https://votre-username.github.io/Formation_python/`

### Option B : Ajuster le base path

Si votre repository a un nom différent, modifiez `frontend/vite.config.js` :

```javascript
base: process.env.GITHUB_PAGES ? '/votre-nom-repo/' : '/',
```

## 🌐 Configuration pour Déploiement Complet

### Backend sur Railway

1. Créez un compte sur [Railway](https://railway.app)
2. Créez un nouveau projet depuis GitHub
3. Configurez :
   - Root Directory: `backend`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Ajoutez la variable d'environnement :
   - `ALLOWED_ORIGINS`: URL de votre frontend (ex: `https://votre-username.github.io`)

### Backend sur Render

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau "Web Service"
3. Connectez votre repository GitHub
4. Configurez :
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre repository GitHub
3. Configurez :
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: URL de votre backend (ex: `https://votre-backend.railway.app`)

## 🔐 Configuration des Secrets GitHub

Pour certains déploiements, vous devrez configurer des secrets :

1. Allez dans Settings → Secrets and variables → Actions
2. Cliquez sur "New repository secret"
3. Ajoutez les secrets nécessaires :

### Secrets pour GitHub Pages
- Aucun secret nécessaire (utilise `GITHUB_TOKEN` automatiquement)

### Secrets pour Railway
- `RAILWAY_TOKEN`: Token d'API Railway

### Secrets pour Render
- `RENDER_API_KEY`: Clé API Render
- `RENDER_SERVICE_ID`: ID du service Render

### Secrets pour Frontend
- `VITE_API_URL`: URL de votre API backend (pour le build)

## 📝 Variables d'Environnement

### Backend

Créez un fichier `.env` dans `backend/` (ou configurez dans votre hébergeur) :

```env
ALLOWED_ORIGINS=https://votre-username.github.io,https://votre-domaine.com
```

### Frontend

Créez un fichier `.env.production` dans `frontend/` :

```env
VITE_API_URL=https://votre-backend.railway.app
```

## 🐳 Déploiement avec Docker

### Build local

```bash
# Backend
cd backend
docker build -t formation-python-backend .

# Frontend
cd frontend
docker build -t formation-python-frontend --build-arg VITE_API_URL=http://localhost:8000 .
```

### Docker Compose

```bash
docker-compose up -d
```

### Déploiement sur un VPS

1. Configurez les secrets GitHub (HOST, USERNAME, SSH_KEY)
2. Décommentez la section "Deploy to server" dans `ci-cd.yml`
3. Le workflow déploiera automatiquement

## ✅ Vérification

### Vérifier que le workflow s'exécute

1. Allez dans l'onglet "Actions" de votre repository
2. Vous devriez voir les workflows s'exécuter
3. Cliquez sur un workflow pour voir les logs

### Vérifier le déploiement

1. **Frontend** : Visitez `https://votre-username.github.io/Formation_python/`
2. **Backend** : Testez `https://votre-backend.railway.app/api/lessons`
3. **Logs** : Vérifiez les logs dans GitHub Actions ou votre hébergeur

## 🐛 Dépannage

### Le workflow échoue

1. Vérifiez les logs dans l'onglet "Actions"
2. Vérifiez que toutes les dépendances sont correctes
3. Testez le build localement :
   ```bash
   cd frontend && npm run build
   cd ../backend && python -m uvicorn main:app
   ```

### Le frontend ne trouve pas l'API

1. Vérifiez `VITE_API_URL` dans les variables d'environnement
2. Vérifiez que le backend est accessible publiquement
3. Vérifiez CORS dans `backend/main.py`

### Erreur 404 sur GitHub Pages

1. Vérifiez le `base` dans `vite.config.js`
2. Assurez-vous que GitHub Pages est activé
3. Vérifiez que le workflow s'est exécuté avec succès

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)

## 🎯 Prochaines Étapes

1. **Ajoutez des tests** : Configurez pytest et Jest/Vitest
2. **Configurez ESLint** : Pour maintenir la qualité du code
3. **Ajoutez Prettier** : Pour le formatage automatique
4. **CI/CD avancé** : Ajoutez des tests avant le déploiement
5. **Monitoring** : Configurez le monitoring de votre application

Bon déploiement ! 🚀

