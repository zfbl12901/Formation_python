# 🔍 Diagnostic : Backend et fichiers .md

## Problème

Le frontend se déploie correctement, mais affiche "Aucune leçon trouvée". Cela signifie que le backend n'est pas accessible ou ne trouve pas les fichiers `.md`.

## 🔍 Étape 1 : Vérifier si le backend est déployé

### Test rapide

Ouvrez la console du navigateur (F12) sur votre site GitHub Pages et regardez les erreurs réseau :

1. Allez sur : `https://zfbl12901.github.io/Formation_python/`
2. Ouvrez la console (F12 → Console)
3. Regardez les erreurs réseau (F12 → Network)

**Si vous voyez des erreurs comme :**
- `Failed to fetch`
- `NetworkError`
- `CORS error`
- `404 Not Found` sur `/api/lessons`

**→ Le backend n'est pas déployé ou l'URL est incorrecte**

### Vérifier l'URL de l'API

Dans la console, tapez :
```javascript
console.log(import.meta.env.VITE_API_URL)
```

**Si c'est `undefined`** → Le secret `VITE_API_URL` n'est pas configuré dans GitHub

## ✅ Solution 1 : Déployer le backend

Le backend FastAPI doit être déployé séparément. Voir `BACKEND-DEPLOYMENT.md` pour les instructions complètes.

### Option rapide : Railway (Recommandé)

1. **Créer un compte** : https://railway.app
2. **Nouveau projet** → "Deploy from GitHub repo"
3. **Sélectionner votre repository** : `Formation_python`
4. **Railway détectera automatiquement** le backend Python
5. **Ajouter les variables d'environnement** :
   - `CONTENT_DIR` = `../content`
   - `CORS_ORIGINS` = `https://zfbl12901.github.io`
6. **Notez l'URL** fournie par Railway (ex: `https://your-app.railway.app`)

## ✅ Solution 2 : Configurer l'URL de l'API dans GitHub

Une fois le backend déployé :

1. **Allez dans votre repository** : Settings → Secrets and variables → Actions → Secrets
2. **Créer un nouveau secret** :
   - **Name** : `VITE_API_URL`
   - **Value** : L'URL de votre backend (ex: `https://your-app.railway.app` - **sans** `/api` à la fin)
3. **Redéployer le frontend** :
   - Le workflow se déclenchera automatiquement au prochain push
   - OU allez dans Actions → "Build and Deploy" → "Run workflow"

## 🔍 Étape 2 : Vérifier que le backend trouve les fichiers

### Tester l'API directement

Une fois le backend déployé, testez l'API directement :

```bash
curl https://your-backend-url.com/api/lessons
```

**Si vous obtenez** :
```json
{"lessons": []}
```

**→ Le backend ne trouve pas les fichiers dans `content/`**

### Solution : Configurer CONTENT_DIR

Dans Railway/Render, ajoutez la variable d'environnement :

- **Name** : `CONTENT_DIR`
- **Value** : `../content` (ou le chemin relatif depuis le dossier backend)

## 🔍 Étape 3 : Vérifier que content/ est dans Git

Le dossier `content/` doit être committé dans Git pour être accessible en production :

```bash
# Vérifier
git ls-files content/ | Select-Object -First 5

# Si vide, ajouter
git add content/
git commit -m "Ajout des fichiers Markdown"
git push origin main
```

## 📋 Checklist complète

- [ ] Backend déployé (Railway/Render/autre)
- [ ] Variable `CONTENT_DIR` configurée dans le backend
- [ ] Variable `CORS_ORIGINS` configurée dans le backend (avec votre URL GitHub Pages)
- [ ] Secret `VITE_API_URL` configuré dans GitHub (avec l'URL du backend)
- [ ] Dossier `content/` committé dans Git
- [ ] Frontend redéployé après configuration de `VITE_API_URL`

## 🐛 Dépannage avancé

### Le backend répond mais retourne une liste vide

1. **Vérifier les logs du backend** (Railway/Render)
2. **Vérifier que `CONTENT_DIR` pointe vers le bon dossier**
3. **Vérifier les permissions** (le backend doit pouvoir lire `content/`)

### Erreur CORS

Si vous voyez des erreurs CORS dans la console :

1. **Vérifier** que `CORS_ORIGINS` dans le backend inclut votre URL GitHub Pages
2. **Format** : `https://zfbl12901.github.io` (sans `/` à la fin)

### L'API ne répond pas du tout

1. **Vérifier** que le backend est bien démarré
2. **Tester** l'URL directement dans le navigateur : `https://your-backend-url.com/api`
3. **Vérifier** les logs du backend pour les erreurs

## 📚 Documentation

- `BACKEND-DEPLOYMENT.md` : Guide complet de déploiement du backend
- `FIX-CONTENT-NOT-FOUND.md` : Guide pour résoudre les problèmes de fichiers .md
- `backend/DEPLOYMENT-CONTENT.md` : Configuration du dossier content/

