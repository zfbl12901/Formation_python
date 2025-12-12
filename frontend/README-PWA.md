# Configuration PWA

## Icônes nécessaires

Pour que la PWA fonctionne complètement, vous devez créer deux icônes :

1. `public/icon-192.png` - 192x192 pixels
2. `public/icon-512.png` - 512x512 pixels

### Génération des icônes

Vous pouvez utiliser un outil en ligne comme :
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Ou créer les icônes manuellement avec un éditeur d'images.

### Format recommandé

- Format : PNG
- Fond transparent ou couleur de fond #3b82f6
- Icône : Lettre "P" ou logo Python
- Taille : 192x192 et 512x512 pixels

## Installation

Une fois les icônes créées, la PWA sera automatiquement disponible. Les utilisateurs pourront :

1. Installer l'application sur leur appareil
2. Utiliser l'application en mode hors ligne (pour les pages déjà visitées)
3. Recevoir des mises à jour automatiques

## Test

Pour tester la PWA :

1. Ouvrez l'application dans Chrome/Edge
2. Ouvrez les DevTools (F12)
3. Allez dans l'onglet "Application"
4. Vérifiez que le Service Worker est enregistré
5. Testez le mode hors ligne en cochant "Offline" dans les DevTools

