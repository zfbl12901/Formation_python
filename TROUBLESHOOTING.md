# Guide de Dépannage

## Problèmes Courants

### 1. "Le terme 'start.bat' n'est pas reconnu" dans PowerShell

**Problème** : PowerShell nécessite `.\` pour exécuter des scripts locaux.

**Solution** :
```powershell
# ❌ Incorrect
start.bat

# ✅ Correct
.\start.bat

# Ou avec le chemin complet
backend\start.bat
```

### 2. Erreur "pydantic-core" nécessite Rust lors de l'installation Python

**Problème** : `pydantic-core` essaie de compiler depuis les sources et nécessite Rust.

**Solution 1 (Recommandée)** : Utiliser les versions récentes avec wheels
```powershell
cd backend
.\install-deps-latest.bat
```

**Solution 2** : Installation simple avec wheels précompilés
```powershell
cd backend
.\install-deps-simple.bat
```

**Solution 3** : Forcer les wheels précompilés manuellement
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install --upgrade pip setuptools wheel
pip install --prefer-binary fastapi uvicorn[standard] python-multipart python-frontmatter aiofiles pydantic
```

**Solution 4** : Si erreur "pydantic-core version not found"
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install --prefer-binary "pydantic>=2.6.0"
pip install --prefer-binary -r requirements.txt
```

**Solution 3** : Installer Rust (si les wheels ne sont pas disponibles)
```powershell
winget install Rustlang.Rustup
# Puis réessayez l'installation
```

**Solution 4** : Utiliser une version plus récente de Python (3.11+)
Les versions récentes de Python ont de meilleurs wheels précompilés disponibles.

### 3. "uvicorn n'est pas reconnu"

**Problème** : Les dépendances ne sont pas installées ou l'environnement virtuel n'est pas activé.

**Solution** :
```powershell
cd backend

# Option 1 : Script automatique
.\install-deps.bat
.\start.bat

# Option 2 : Manuel
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### 4. "Cargo/Rust not found" lors de npm install

**Problème** : Certaines dépendances optionnelles nécessitent Rust.

**Solution** :
```powershell
cd frontend
npm install --ignore-scripts
```

Cette erreur est généralement non-bloquante.

### 5. Le backend ne démarre pas

**Vérifications** :
1. Python est installé : `python --version` (doit être 3.8+)
2. L'environnement virtuel existe : `backend\venv\`
3. Les dépendances sont installées : `backend\venv\Scripts\pip.exe` doit exister

**Solution** :
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 6. Le frontend ne charge pas les données

**Vérifications** :
1. Le backend est démarré : http://localhost:8000 doit répondre
2. CORS est configuré (déjà fait dans `backend/main.py`)
3. Console du navigateur : F12 pour voir les erreurs

**Solution** :
- Vérifiez que le backend tourne sur le port 8000
- Vérifiez la console du navigateur (F12)
- Vérifiez les logs du backend

### 7. Les fichiers MD ne s'affichent pas

**Vérifications** :
1. Les fichiers sont dans `content/` (pas `contents/` ou autre)
2. Le frontmatter YAML est valide
3. Les fichiers ont l'extension `.md`

**Solution** :
- Vérifiez le format du frontmatter (doit être valide YAML)
- Vérifiez les logs du backend pour les erreurs de parsing
- Testez avec un fichier simple d'abord

### 8. Erreur "Cannot activate virtual environment" dans PowerShell

**Problème** : PowerShell bloque l'exécution de scripts par défaut.

**Solution** :
```powershell
# Autoriser l'exécution de scripts (une seule fois)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Puis activer le venv
.\venv\Scripts\Activate.ps1
```

### 9. Port déjà utilisé

**Problème** : Le port 8000 (backend) ou 5173 (frontend) est déjà utilisé.

**Solution** :
- Fermez l'application qui utilise le port
- Ou changez le port dans la configuration :
  - Backend : `backend/main.py` ligne 200
  - Frontend : `frontend/vite.config.js`

## Commandes Utiles

### Vérifier l'installation Python
```powershell
python --version
python -m pip --version
```

### Vérifier l'installation Node.js
```powershell
node --version
npm --version
```

### Lister les processus sur un port
```powershell
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :5173
```

### Nettoyer et réinstaller

**Backend** :
```powershell
cd backend
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Frontend** :
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
npm install --ignore-scripts
```

## Obtenir de l'Aide

Si le problème persiste :
1. Vérifiez les logs du backend (dans le terminal)
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que tous les prérequis sont installés (Python 3.8+, Node.js 16+)

