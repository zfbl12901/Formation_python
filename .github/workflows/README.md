# GitHub Actions - Workflows

## ⚠️ IMPORTANT : Configuration requise

**AVANT** d'utiliser ce workflow, vous DEVEZ configurer GitHub Pages pour utiliser **"GitHub Actions"** et NON "Deploy from a branch".

Voir `URGENT-FIX-JEKYLL.md` pour les instructions détaillées.

## Workflow unique : `deploy.yml`

Ce workflow unique gère le build et le déploiement du frontend sur GitHub Pages en utilisant la méthode **GitHub Actions Pages** (recommandée).

### Déclenchement

- **Automatique** : À chaque push sur `main` ou `master`
- **Manuel** : Via l'onglet Actions → "Run workflow"

### Ce qu'il fait

1. ✅ Checkout du code
2. ✅ Installation de Node.js 20
3. ✅ Installation des dépendances frontend
4. ✅ Build du frontend (avec base path `/Formation_python/`)
5. ✅ Upload de l'artifact
6. ✅ Déploiement via GitHub Actions Pages (méthode native)

### Configuration requise

#### GitHub Pages

**IMPORTANT** : Vous devez configurer GitHub Pages pour utiliser **GitHub Actions** :

1. Allez dans **Settings** → **Pages**
2. **Source** : Sélectionnez **"GitHub Actions"** (pas "Deploy from a branch")
3. **Save**

Cette méthode évite les problèmes de Jekyll et les restrictions de push vers `main`.

#### Secret GitHub (optionnel)

Si votre backend est déployé, créez un secret :

1. **Settings** → **Secrets and variables** → **Actions** → **Secrets**
2. Créez : `VITE_API_URL` = `https://your-backend-url.com` (sans `/api`)

### Structure du déploiement

Le frontend est déployé via GitHub Actions Pages, accessible à :
`https://zfbl12901.github.io/Formation_python/`

### Avantages de cette méthode

- ✅ Pas de problème avec Jekyll (le fichier `.nojekyll` est inclus)
- ✅ Pas de restriction de push vers `main`
- ✅ Méthode native GitHub Pages
- ✅ Déploiement automatique et fiable

### Notes

- Le workflow est simple et ne fait que le nécessaire
- Pas de tests, lint, ou autres jobs complexes
- Utilise le système de déploiement GitHub Pages natif

