# Guide de Déploiement

Ce guide explique comment déployer la Formation Python en ligne via GitHub Actions.

## Options de Déploiement

### Option 1 : GitHub Pages (Recommandé pour commencer)

GitHub Pages permet d'héberger gratuitement le frontend statique.

#### Configuration

1. **Activer GitHub Pages dans les paramètres du repo** :
   - Allez dans Settings → Pages
   - Source : "GitHub Actions"

2. **Le workflow `deploy-pages.yml` s'exécutera automatiquement** à chaque push sur `main` ou `master`

3. **URL de votre site** :
   - `https://votre-username.github.io/Formation_python/`
   - Ou `https://votre-username.github.io/` si vous utilisez un repo nommé `votre-username.github.io`

#### Configuration du base path

Si votre repo s'appelle `Formation_python`, le workflow est déjà configuré avec `base: '/Formation_python/'`.

Si votre repo a un autre nom, modifiez `frontend/vite.config.js` :

```javascript
base: process.env.GITHUB_PAGES ? '/nom-de-votre-repo/' : '/',
```

#### Limitations

- **Frontend uniquement** : Le backend FastAPI ne peut pas tourner sur GitHub Pages
- **API** : Vous devrez héberger le backend séparément (voir Option 2)

### Option 2 : Déploiement Complet (Backend + Frontend)

Pour déployer le backend également, vous avez plusieurs options :

#### A. Vercel / Netlify (Frontend) + Railway / Render (Backend)

**Frontend sur Vercel** :
1. Créez un compte sur [Vercel](https://vercel.com)
2. Connectez votre repo GitHub
3. Configurez :
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

**Backend sur Railway** :
1. Créez un compte sur [Railway](https://railway.app)
2. Créez un nouveau projet depuis GitHub
3. Configurez :
   - Root Directory: `backend`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### B. Serveur VPS (SSH)

1. Configurez les secrets GitHub :
   - `HOST` : Adresse IP de votre serveur
   - `USERNAME` : Nom d'utilisateur SSH
   - `SSH_KEY` : Clé privée SSH

2. Décommentez la section "Deploy to server" dans `.github/workflows/ci-cd.yml`

3. Le workflow déploiera automatiquement sur votre serveur

#### C. Docker + Cloud Provider

Créez des Dockerfiles et déployez sur :
- AWS
- Google Cloud
- Azure
- DigitalOcean

## Configuration des Secrets GitHub

Pour utiliser certains déploiements, vous devrez configurer des secrets :

1. Allez dans Settings → Secrets and variables → Actions
2. Ajoutez les secrets nécessaires :
   - `VITE_API_URL` : URL de votre API backend (pour le frontend)
   - `HOST`, `USERNAME`, `SSH_KEY` : Pour déploiement SSH

## Workflows GitHub Actions

### 1. `ci-cd.yml`
- Teste le backend et le frontend
- Build le frontend
- Déploie (selon configuration)

### 2. `deploy-pages.yml`
- Build et déploie sur GitHub Pages
- S'exécute sur push vers main/master

### 3. `test.yml`
- Exécute les tests (quand vous les ajouterez)

### 4. `lint.yml`
- Vérifie le style de code
- Optionnel mais recommandé

## Variables d'Environnement

### Frontend

Créez un fichier `.env.production` dans `frontend/` :

```env
VITE_API_URL=https://votre-api-backend.com
```

### Backend

Pour le backend, configurez selon votre hébergeur :
- Variables d'environnement dans Railway/Render
- Fichier `.env` sur votre serveur VPS

## Déploiement Manuel

Si vous préférez déployer manuellement :

### Frontend

```bash
cd frontend
npm install
npm run build
# Copiez le contenu de dist/ sur votre serveur web
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
# Ou utilisez un serveur WSGI comme Gunicorn
```

## Vérification du Déploiement

1. **Frontend** : Visitez l'URL de votre site
2. **Backend** : Testez l'API à `https://votre-api.com/api/lessons`
3. **Logs** : Vérifiez les logs dans GitHub Actions ou votre hébergeur

## Problèmes Courants

### Le frontend ne trouve pas l'API

- Vérifiez `VITE_API_URL` dans les variables d'environnement
- Vérifiez que le backend est accessible publiquement
- Vérifiez CORS dans le backend si nécessaire

### Erreur 404 sur GitHub Pages

- Vérifiez le `base` dans `vite.config.js`
- Assurez-vous que le workflow s'est exécuté avec succès
- Vérifiez que GitHub Pages est activé

### Le build échoue

- Vérifiez les logs dans GitHub Actions
- Testez le build localement : `npm run build`
- Vérifiez que toutes les dépendances sont dans `package.json`

## Prochaines Étapes

1. **Ajoutez des tests** : Configurez pytest pour le backend et Jest/Vitest pour le frontend
2. **Configurez ESLint** : Pour maintenir la qualité du code frontend
3. **Ajoutez Prettier** : Pour le formatage automatique
4. **CI/CD avancé** : Ajoutez des tests automatiques avant le déploiement

Bon déploiement ! 🚀

