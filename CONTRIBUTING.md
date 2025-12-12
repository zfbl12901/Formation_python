# Guide d'Utilisation

## Structure des Fichiers Markdown

Chaque fichier Markdown doit commencer par un **frontmatter YAML** avec les métadonnées suivantes :

```yaml
---
title: "Titre de votre leçon"
order: 1              # Ordre d'affichage (plus petit = affiché en premier)
parent: null          # Chemin du fichier parent (ex: "01-introduction.md") ou null pour une leçon racine
tags: ["python", "ia"] # Liste de tags pour la catégorisation
---
```

## Exemples de Hiérarchie

### Structure plate (toutes les leçons au même niveau)
```yaml
---
title: "Leçon 1"
order: 1
parent: null
tags: ["basics"]
---
```

### Structure hiérarchique (leçon enfant)
```yaml
---
title: "Sous-leçon"
order: 1
parent: "01-introduction.md"
tags: ["basics", "advanced"]
---
```

## Organisation Recommandée

1. **Basics** : Leçons fondamentales (order: 1-10)
2. **Intermediate** : Concepts intermédiaires (order: 11-20)
3. **Advanced** : Sujets avancés (order: 21-30)
4. **IA/ML** : Sujets liés à l'IA (order: 31+)

## Tags Recommandés

- `python` : Concepts Python généraux
- `basics` : Concepts de base
- `advanced` : Concepts avancés
- `ia` : Intelligence artificielle
- `qdrant` : Base de données vectorielle
- `llm` : Large Language Models
- `embeddings` : Génération d'embeddings
- `prompt-engineering` : Techniques de prompt
- `functions` : Fonctions Python
- `variables` : Variables et types
- `control-flow` : Structures de contrôle

## Ajout d'une Nouvelle Leçon

1. Créez un nouveau fichier `.md` dans le dossier `content/`
2. Ajoutez le frontmatter avec les métadonnées appropriées
3. Écrivez votre contenu en Markdown
4. Le système détectera automatiquement le nouveau fichier au prochain rechargement

## Recherche

La recherche fonctionne sur :
- Le titre de la leçon
- Le contenu Markdown
- Les tags (filtrage)

## Hiérarchie

La hiérarchie est automatiquement construite à partir du champ `parent` dans le frontmatter. Les leçons sans parent apparaissent au niveau racine.


