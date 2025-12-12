# Configuration GitHub Pages

Ce guide explique comment configurer GitHub Pages pour que votre application React soit servie correctement au lieu du README.md.

## ✅ Modifications effectuées

Les fichiers suivants ont été modifiés pour supporter GitHub Pages :

1. **`frontend/vite.config.js`** : Configuration du base path `/Formation_python/` pour GitHub Pages
2. **`.github/workflows/deploy-pages.yml`** : Définition de `GITHUB_PAGES=true` lors du build
3. **`.github/workflows/ci-cd.yml`** : Ajout de la variable d'environnement pour le build
4. **`frontend/src/main.jsx`** : Correction du chemin du Service Worker pour le base path
5. **`frontend/public/sw.js`** : Correction du Service Worker pour fonctionner avec le base path
6. **`frontend/public/.nojekyll`** : Fichier créé pour empêcher GitHub Pages de traiter le site comme Jekyll

## 🚀 Étapes pour activer GitHub Pages

### 1. Activer GitHub Pages dans les paramètres du repository

1. Allez sur votre repository GitHub : `https://github.com/zfbl12901/Formation_python`
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous **Source**, sélectionnez :
   - **Source** : `GitHub Actions` (pas "Deploy from a branch")
5. Cliquez sur **Save**

### 2. Vérifier que le workflow est activé

Le workflow `.github/workflows/deploy-pages.yml` devrait se déclencher automatiquement lors d'un push sur `main` ou `master`.

### 3. Commiter et pousser les modifications

```bash
git add .
git commit -m "Configuration GitHub Pages pour servir l'application React"
git push origin main
```

### 4. Vérifier le déploiement

1. Allez dans l'onglet **Actions** de votre repository
2. Vérifiez que le workflow "Deploy to GitHub Pages" s'exécute
3. Une fois terminé, votre site sera disponible à : `https://zfbl12901.github.io/Formation_python/`

## 🔍 Vérifications

### Si vous voyez toujours le README.md

1. **Vérifiez que GitHub Pages utilise GitHub Actions** :
   - Settings → Pages → Source doit être "GitHub Actions"

2. **Vérifiez que le workflow s'est exécuté** :
   - Actions → Vérifiez que "Deploy to GitHub Pages" a réussi

3. **Videz le cache du navigateur** :
   - Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)

4. **Vérifiez l'URL** :
   - L'URL doit être exactement : `https://zfbl12901.github.io/Formation_python/`
   - Notez le `/` à la fin

### Si l'application ne charge pas correctement

1. **Vérifiez la console du navigateur** (F12) pour les erreurs
2. **Vérifiez que les chemins des assets sont corrects** :
   - Les fichiers JS/CSS doivent être dans `/Formation_python/assets/`
3. **Vérifiez que le base path est correct** :
   - Dans `vite.config.js`, le base path doit être `/Formation_python/` en production

## 📝 Notes importantes

- **Base path** : L'application est configurée pour fonctionner sous `/Formation_python/`
- **Service Worker** : Le Service Worker détecte automatiquement le base path
- **Backend API** : Pour que l'API fonctionne en production, vous devrez déployer le backend séparément et mettre à jour `VITE_API_URL` dans les secrets GitHub

## 🔗 URLs

- **Site en production** : `https://zfbl12901.github.io/Formation_python/`
- **Backend API** : À configurer selon votre déploiement backend
- **Repository** : `https://github.com/zfbl12901/Formation_python`

## 🐛 Dépannage

### Le workflow ne se déclenche pas

- Vérifiez que vous avez poussé sur la branche `main` ou `master`
- Vérifiez que le fichier `.github/workflows/deploy-pages.yml` existe

### Erreur 404 sur les routes

- C'est normal pour une SPA (Single Page Application)
- GitHub Pages doit être configuré pour servir `index.html` pour toutes les routes
- Le fichier `.nojekyll` devrait résoudre ce problème

### Les assets ne se chargent pas

- Vérifiez que le base path est correct dans `vite.config.js`
- Vérifiez que les chemins dans `index.html` sont relatifs ou utilisent le base path

## 📚 Ressources

- [Documentation GitHub Pages](https://docs.github.com/en/pages)
- [Documentation Vite - Base Path](https://vitejs.dev/config/shared-options.html#base)
- [Documentation GitHub Actions](https://docs.github.com/en/actions)

