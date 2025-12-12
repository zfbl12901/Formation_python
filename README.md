# Formation Python - Plateforme d'Apprentissage Personnalisée

Plateforme moderne pour créer et organiser votre formation Python personnalisée avec agrégation de fichiers Markdown.

## Fonctionnalités

- 📚 Agrégation de fichiers Markdown
- 🏗️ Hiérarchisation et organisation des contenus
- 🏷️ Système de tags
- 🔍 Recherche avancée
- 🎨 Design sombre moderne
- 📱 Interface responsive

## Structure du Projet

```
Formation_python/
├── backend/          # API FastAPI (Python)
├── frontend/         # Application React + Vite (Node.js)
└── content/          # Vos fichiers Markdown
```

## 🚀 Démarrage Rapide

### Option 1 : Script Automatique (Windows)

```bash
start-all.bat
```

Ce script démarre automatiquement le backend ET le frontend.

### Option 2 : Démarrage Manuel

**Terminal 1 - Backend (Python)** :
```powershell
cd backend
.\start.bat
```

Ou si les dépendances ne sont pas installées :
```powershell
cd backend
.\install-deps.bat
.\start.bat
```

**Terminal 2 - Frontend (Node.js)** :
```powershell
cd frontend
.\start.bat
```

### Accès

- **Backend API** : http://localhost:8000
- **Frontend** : http://localhost:5173

## ⚠️ Notes Importantes

- **Backend** = Python/FastAPI → Utilisez `uvicorn` ou `start.bat`
- **Frontend** = Node.js/React → Utilisez `npm run dev` ou `start.bat`
- Ne confondez pas les deux ! Le backend n'a pas de `package.json`

## Utilisation

1. Placez vos fichiers `.md` dans le dossier `content/`
2. Utilisez le frontmatter YAML pour ajouter des métadonnées :
   ```yaml
   ---
   title: "Titre de la leçon"
   order: 1
   parent: null
   tags: ["python", "basics"]
   ---
   ```

## Documentation

- **Guide de démarrage rapide** : `QUICKSTART.md`
- **Guide d'installation** : `frontend/INSTALL.md`
- **Guide de contribution** : `CONTRIBUTING.md`
- **Guide de déploiement** : `DEPLOYMENT.md`
- **Configuration GitHub Actions** : `SETUP-GITHUB-ACTIONS.md`

## Technologies

- **Backend**: FastAPI, Python
- **Frontend**: React, Vite, TailwindCSS
- **Markdown**: Marked.js pour le rendu
