# Guide de Démarrage Rapide

## 🚀 Démarrage en 3 étapes

### ⚡ Démarrage Rapide (Tout en un)

**Windows - Script automatique** :
```bash
start-all.bat
```
Ce script démarre automatiquement le backend ET le frontend dans deux fenêtres séparées.

---

### 📋 Démarrage Manuel

#### 1. Backend (Terminal 1) - **PYTHON**

⚠️ **IMPORTANT** : Le backend utilise **Python**, pas Node.js !

**Option A - Script automatique (Recommandé)** :
```powershell
cd backend
.\start.bat
```

**Option B - Installation des dépendances d'abord** :
Si vous voyez une erreur "uvicorn n'est pas reconnu" ou "Rust required", installez d'abord les dépendances :
```powershell
cd backend
.\install-deps-simple.bat
.\start.bat
```

**Si vous avez une erreur Rust/pydantic-core ou "pydantic-core version not found"** :

**Option 1 - Versions récentes (Recommandé)** :
```powershell
cd backend
.\install-deps-latest.bat
```

**Option 2 - Installation simple** :
```powershell
cd backend
.\install-deps-simple.bat
```

Ces scripts utilisent les wheels précompilés (pas de compilation Rust nécessaire).

**Option C - PowerShell (alternative)** :
```powershell
cd backend
.\start.ps1
```

**Option D - Installation manuelle** :
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

**Note importante pour PowerShell** :
- Utilisez toujours `.\` devant les scripts (ex: `.\start.bat`)
- Ou utilisez le chemin complet : `backend\start.bat`

Le serveur API sera disponible sur : http://localhost:8000

#### 2. Frontend (Terminal 2) - **NODE.JS**

⚠️ **IMPORTANT** : Le frontend utilise **Node.js/npm**, pas Python !

**Option A - Installation standard** (peut afficher un avertissement Rust, mais fonctionne) :
```bash
cd frontend
npm install
npm run dev
```

**Option B - Installation sans scripts** (évite l'avertissement Rust) :
```bash
cd frontend
npm install --ignore-scripts
npm run dev
```

**Option C - Script Windows automatique** :
```bash
cd frontend
start.bat
```

L'application sera disponible sur : http://localhost:5173

### 3. Accéder à l'application

Ouvrez votre navigateur et allez sur **http://localhost:5173**

## 📝 Ajouter vos propres leçons

1. Créez un fichier `.md` dans le dossier `content/`
2. Ajoutez le frontmatter YAML en haut :

```yaml
---
title: "Mon Titre"
order: 10
parent: null
tags: ["python", "mon-tag"]
---

# Mon Contenu

Votre contenu Markdown ici...
```

3. Rechargez la page dans le navigateur

## 🎨 Fonctionnalités

- **Accueil** : Liste toutes les leçons
- **Hiérarchie** : Vue arborescente des leçons organisées
- **Tags** : Navigation par tags
- **Recherche** : Recherche textuelle et filtrage par tags

## 🔧 Configuration

### Changer le port du backend

Modifiez `backend/main.py` ligne 200 :
```python
uvicorn.run(app, host="0.0.0.0", port=8000)  # Changez le port ici
```

### Changer le port du frontend

Modifiez `frontend/vite.config.js` :
```javascript
server: {
  port: 5173,  // Changez le port ici
}
```

## 📚 Structure Recommandée

```
content/
├── 01-introduction.md
├── 02-basics/
│   ├── 01-variables.md
│   └── 02-fonctions.md
└── 03-advanced/
    └── 01-ia.md
```

## 🐛 Dépannage

> 📖 **Guide complet de dépannage** : Consultez `TROUBLESHOOTING.md` pour plus de détails

### Erreur "Cargo/Rust not found" lors de npm install

Si vous voyez une erreur concernant Rust/Cargo lors de l'installation :

**Solution 1 (Recommandée)** : Ignorer les scripts optionnels
```bash
npm install --ignore-scripts
```

**Solution 2** : Installer Rust (si vous avez besoin des fonctionnalités natives)
- Téléchargez Rust depuis https://rustup.rs/
- Ou utilisez : `winget install Rustlang.Rustup`

**Solution 3** : Utiliser yarn à la place
```bash
npm install -g yarn
yarn install
```

Note : Cette erreur est généralement non-bloquante. Les dépendances principales fonctionnent sans Rust.

### Le backend ne démarre pas

**Erreur "uvicorn n'est pas reconnu"** :
1. Assurez-vous que l'environnement virtuel est créé :
   ```bash
   cd backend
   python -m venv venv
   ```

2. Installez les dépendances :
   ```bash
   cd backend
   install-deps.bat
   ```
   Ou manuellement :
   ```bash
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Utilisez `python -m uvicorn` au lieu de `uvicorn` :
   ```bash
   python -m uvicorn main:app --reload
   ```

**Autres problèmes** :
- Vérifiez que Python 3.8+ est installé : `python --version`
- Vérifiez que le dossier `content/` existe
- Si vous êtes dans PowerShell, essayez `.\start.ps1` au lieu de `start.bat`

### Le frontend ne charge pas les données
- Vérifiez que le backend est bien démarré
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que CORS est bien configuré dans `backend/main.py`

### Les fichiers MD ne s'affichent pas
- Vérifiez que les fichiers sont dans `content/`
- Vérifiez le format du frontmatter (doit être valide YAML)
- Vérifiez les logs du backend pour les erreurs de parsing


