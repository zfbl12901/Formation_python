# Configuration GitHub Pages avec Branche Main

Ce guide explique comment configurer GitHub Pages pour servir votre application React depuis la branche `main`.

## 📋 Deux options de déploiement

### Option 1 : GitHub Pages depuis `/docs` de la branche `main` (RECOMMANDÉ)

Cette option est **activée par défaut** et est la plus sûre car elle ne modifie pas les fichiers à la racine.

**Configuration GitHub Pages :**
1. Settings → Pages
2. Source : "Deploy from a branch"
3. Branch : `main` / `/docs`
4. Save

**Le workflow déploiera automatiquement dans `/docs`.**

### Option 2 : GitHub Pages depuis `/root` de la branche `main`

⚠️ **ATTENTION** : Cette option peut écraser certains fichiers à la racine.

**Pour activer cette option lors d'un déploiement manuel :**
1. Allez dans l'onglet **Actions**
2. Sélectionnez "Deploy to GitHub Pages (Branch)"
3. Cliquez sur "Run workflow"
4. Cochez la case "Déployer à la racine au lieu de /docs"
5. Cliquez sur "Run workflow"

**Pour activer cette option par défaut :**
Modifiez le workflow `.github/workflows/deploy-pages-branch.yml` et changez les conditions `if` :
```yaml
- name: Deploy to /docs folder
  if: false  # Désactivez cette option

- name: Deploy to root of main branch
  if: true  # Activez cette option
```

**Configuration GitHub Pages :**
1. Settings → Pages
2. Source : "Deploy from a branch"
3. Branch : `main` / `/(root)`
4. Save

## ⚙️ Configuration dans GitHub

### Vérifier la configuration actuelle

1. Allez sur votre repository : `https://github.com/zfbl12901/Formation_python`
2. Cliquez sur **Settings** → **Pages**
3. Vérifiez la configuration :
   - **Source** : Doit être "Deploy from a branch"
   - **Branch** : Doit être `main` (ou `master`)
   - **Folder** : Doit être `/root` ou `/docs`

### Configurer pour `/root`

1. Settings → Pages
2. Source : "Deploy from a branch"
3. Branch : `main` / `/(root)`
4. Save

### Configurer pour `/docs`

1. Settings → Pages
2. Source : "Deploy from a branch"
3. Branch : `main` / `/docs`
4. Save

## 🚀 Utilisation

Une fois configuré, le workflow se déclenchera automatiquement à chaque push sur `main`.

### Déclencher manuellement

1. Allez dans l'onglet **Actions**
2. Sélectionnez "Deploy to GitHub Pages (Branch)"
3. Cliquez sur "Run workflow"

## 📝 Notes importantes

### Base path

Le base path dans `vite.config.js` est configuré pour `/Formation_python/`. 

**Si vous déployez dans `/docs`** : Le base path reste `/Formation_python/` (URL : `https://zfbl12901.github.io/Formation_python/`)

**Si vous déployez à la racine** : Vous devrez peut-être ajuster le base path dans `vite.config.js` :

```javascript
// Pour déploiement à la racine (si votre repo s'appelle Formation_python)
const base = '/Formation_python/'

// OU si vous voulez servir depuis la racine du domaine
const base = '/'
```

**Note** : L'URL GitHub Pages est toujours `https://username.github.io/repository-name/`, donc même si vous déployez à la racine de la branche, l'URL contiendra toujours le nom du repository.

### Fichiers ignorés

Le workflow utilise `keep_files: false`, ce qui signifie que les anciens fichiers seront supprimés. Les fichiers suivants sont préservés :
- `.git/`
- `.github/`
- `backend/`
- `frontend/`
- `content/`
- `README.md`
- `.gitignore`

### Sécurité

Le workflow utilise `GITHUB_TOKEN` qui est automatiquement fourni par GitHub Actions. Aucune configuration supplémentaire n'est nécessaire.

## 🔍 Vérification

Après le déploiement :

1. Vérifiez que les fichiers sont bien dans la branche `main` (ou dans `/docs`)
2. Visitez votre site : `https://zfbl12901.github.io/Formation_python/`
3. Vérifiez la console du navigateur (F12) pour les erreurs éventuelles

## 🐛 Dépannage

### Les fichiers ne sont pas déployés

- Vérifiez que le workflow s'est exécuté dans l'onglet **Actions**
- Vérifiez les logs du workflow pour les erreurs
- Vérifiez que les permissions `contents: write` sont correctes

### Erreur 404 sur les routes

- Vérifiez que le base path dans `vite.config.js` correspond à votre configuration
- Vérifiez que le fichier `.nojekyll` est présent dans le build

### Les assets ne se chargent pas

- Vérifiez que les chemins dans `index.html` utilisent le bon base path
- Videz le cache du navigateur (Ctrl+Shift+R)

## 📚 Alternatives

Si vous préférez utiliser GitHub Actions (recommandé) au lieu de déployer vers une branche :

1. Utilisez le workflow `.github/workflows/deploy-pages.yml`
2. Configurez GitHub Pages pour utiliser "GitHub Actions" comme source
3. Voir `GITHUB-PAGES-SETUP.md` pour plus de détails

