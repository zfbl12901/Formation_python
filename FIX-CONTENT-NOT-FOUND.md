# 🔧 Correction : Fichiers .md non trouvés

## Problème

Le backend ne trouve pas les fichiers Markdown dans le dossier `content/` en production.

## ✅ Solution rapide

### 1. Vérifier que le dossier `content/` est dans Git

Le dossier `content/` doit être **commité dans Git** pour être accessible en production.

```bash
# Vérifier que les fichiers sont dans Git
git ls-files content/

# Si aucun fichier n'apparaît, ajoutez-les :
git add content/
git commit -m "Ajout des fichiers Markdown"
git push origin main
```

### 2. Configuration selon votre plateforme de déploiement

#### Railway

1. **Variable d'environnement** :
   - Allez dans votre service Railway → Variables
   - Ajoutez : `CONTENT_DIR` = `../content`

2. **Root Directory** :
   - Assurez-vous que "Root Directory" est `backend`
   - Railway cherchera `content/` via `../content`

#### Render

1. **Variable d'environnement** :
   - Allez dans Environment → Environment Variables
   - Ajoutez : `CONTENT_DIR` = `../content`

2. **Root Directory** :
   - Assurez-vous que "Root Directory" est `backend`

#### Docker

Le Dockerfile a été mis à jour pour copier automatiquement le dossier `content/`.

Build depuis la racine du projet :
```bash
docker build -f backend/Dockerfile -t formation-python-backend .
```

### 3. Redéployer le backend

Après avoir configuré les variables d'environnement :

1. **Railway** : Le redéploiement se fait automatiquement
2. **Render** : Cliquez sur "Manual Deploy" → "Deploy latest commit"
3. **Docker** : Rebuild l'image et redémarrez le conteneur

### 4. Vérifier que ça fonctionne

Testez l'API :
```bash
curl https://your-backend-url.com/api/lessons
```

Vous devriez voir une liste de leçons au lieu d'un tableau vide.

## 🔍 Détection automatique

Le backend a été mis à jour pour détecter automatiquement le dossier `content/` :

1. Il essaie d'abord la variable d'environnement `CONTENT_DIR`
2. Sinon, il essaie plusieurs chemins :
   - `../content` (développement local depuis backend/)
   - `./content` (si content est dans backend/)
   - `/app/content` (Docker)
   - Depuis le repo root

## 📝 Structure attendue

```
Formation_python/
├── backend/
│   ├── main.py
│   └── ...
└── content/          ← Doit être au même niveau que backend/
    ├── 01-introduction.md
    └── ...
```

## 🐛 Si ça ne fonctionne toujours pas

1. **Vérifiez les logs du backend** :
   - Les logs indiqueront le chemin utilisé
   - Cherchez des messages comme "CONTENT_DIR" ou "content"

2. **Testez localement** :
   ```bash
   cd backend
   python main.py
   # Vérifiez que les fichiers sont trouvés
   ```

3. **Vérifiez les permissions** :
   - Le backend doit avoir les droits de lecture sur `content/`

4. **Forcez le chemin** :
   - Utilisez la variable d'environnement `CONTENT_DIR` avec le chemin absolu

## 📚 Documentation complète

Voir `backend/DEPLOYMENT-CONTENT.md` pour plus de détails.

