# Guide d'Installation - Résolution des Problèmes

## Erreur Rust/Cargo

Si vous rencontrez l'erreur :
```
Cargo, the Rust package manager, is not installed or is not on PATH.
```

### ✅ Solution Rapide (Recommandée)

Utilisez l'option `--ignore-scripts` lors de l'installation :

```bash
npm install --ignore-scripts
```

Cette option ignore les scripts de compilation optionnels qui nécessitent Rust. **Cela n'affecte pas le fonctionnement de l'application** car toutes les dépendances principales ont des binaires précompilés.

### Alternative 1 : Installation normale (avec avertissement)

Vous pouvez simplement ignorer l'avertissement et continuer :

```bash
npm install
```

L'installation se terminera normalement malgré l'avertissement.

### Alternative 2 : Installer Rust (si nécessaire)

Si vous avez vraiment besoin des fonctionnalités natives :

1. **Via winget (Windows)** :
   ```powershell
   winget install Rustlang.Rustup
   ```

2. **Via le site officiel** :
   - Visitez https://rustup.rs/
   - Téléchargez et installez Rust
   - Redémarrez votre terminal

3. **Puis réinstallez** :
   ```bash
   npm install
   ```

### Alternative 3 : Utiliser Yarn

Yarn gère mieux les dépendances optionnelles :

```bash
npm install -g yarn
yarn install
```

## Vérification de l'Installation

Après l'installation, vérifiez que tout fonctionne :

```bash
npm run dev
```

Si le serveur démarre sur http://localhost:5173, tout est OK ! ✅

## Note Importante

L'erreur Rust/Cargo est généralement **non-bloquante**. Elle concerne des dépendances optionnelles qui ne sont pas nécessaires pour le fonctionnement de base de l'application.

