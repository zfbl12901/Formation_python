# GitHub Actions - Workflows

## Workflow unique : `deploy.yml`

Ce workflow unique gère le build et le déploiement du frontend sur GitHub Pages.

### Déclenchement

- **Automatique** : À chaque push sur `main` ou `master`
- **Manuel** : Via l'onglet Actions → "Run workflow"

### Ce qu'il fait

1. ✅ Checkout du code
2. ✅ Installation de Node.js 20
3. ✅ Installation des dépendances frontend
4. ✅ Build du frontend (avec base path `/Formation_python/`)
5. ✅ Déploiement dans `/docs` de la branche `main`

### Configuration requise

#### GitHub Pages

1. Allez dans **Settings** → **Pages**
2. **Source** : "Deploy from a branch"
3. **Branch** : `main` / `/docs`
4. **Save**

#### Secret GitHub (optionnel)

Si votre backend est déployé, créez un secret :

1. **Settings** → **Secrets and variables** → **Actions** → **Secrets**
2. Créez : `VITE_API_URL` = `https://your-backend-url.com` (sans `/api`)

### Structure du déploiement

Le frontend est déployé dans `/docs` de la branche `main`, accessible à :
`https://zfbl12901.github.io/Formation_python/`

### Notes

- Le workflow est simple et ne fait que le nécessaire
- Pas de tests, lint, ou autres jobs complexes
- Déploiement direct dans `/docs` de `main`

