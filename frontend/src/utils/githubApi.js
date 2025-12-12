// API GitHub pour récupérer les fichiers .md directement depuis le repository
// Cette solution évite d'avoir besoin d'un backend séparé

const GITHUB_REPO = 'zfbl12901/Formation_python'
const GITHUB_API_BASE = 'https://api.github.com/repos'

// Fonction pour récupérer le contenu brut d'un fichier depuis GitHub
export async function getFileContent(path) {
  try {
    // Essayer d'abord avec l'API GitHub Contents
    const url = `${GITHUB_API_BASE}/${GITHUB_REPO}/contents/${path}`
    const response = await fetch(url)
    
    if (!response.ok) {
      // Si erreur 403, utiliser raw.githubusercontent.com directement
      if (response.status === 403) {
        console.warn(`API GitHub retourne 403 pour ${path}, utilisation de raw.githubusercontent.com`)
        return getFileContentAlternative(path)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Décoder le contenu base64
    if (data.encoding === 'base64' && data.content) {
      const content = atob(data.content.replace(/\n/g, ''))
      return content
    }
    
    return data.content || ''
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${path}:`, error)
    // En cas d'erreur, essayer l'approche alternative
    try {
      return await getFileContentAlternative(path)
    } catch (altError) {
      throw error // Relancer l'erreur originale
    }
  }
}

// Approche alternative : utiliser raw.githubusercontent.com directement
async function getFileContentAlternative(path) {
  try {
    const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${path}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.text()
  } catch (error) {
    console.error(`Erreur lors de la récupération alternative de ${path}:`, error)
    throw error
  }
}

// Fonction pour récupérer la liste des fichiers .md dans un dossier
// Utilise une approche alternative si l'API GitHub échoue (403)
export async function getMarkdownFiles(directory = 'content') {
  try {
    // Essayer d'abord avec l'API GitHub
    const url = `${GITHUB_API_BASE}/${GITHUB_REPO}/contents/${directory}`
    const response = await fetch(url)
    
    if (!response.ok) {
      // Si erreur 403 (privé ou rate limit), utiliser l'approche alternative
      if (response.status === 403) {
        console.warn('API GitHub retourne 403, utilisation de l\'approche alternative')
        return getMarkdownFilesAlternative(directory)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const files = await response.json()
    
    // Filtrer et récupérer récursivement tous les fichiers .md
    const mdFiles = []
    
    for (const file of files) {
      if (file.type === 'file' && file.name.endsWith('.md')) {
        mdFiles.push({
          path: file.path,
          name: file.name,
          sha: file.sha,
          size: file.size,
          url: file.download_url
        })
      } else if (file.type === 'dir') {
        // Récursion pour les sous-dossiers
        const subFiles = await getMarkdownFiles(file.path)
        mdFiles.push(...subFiles)
      }
    }
    
    return mdFiles
  } catch (error) {
    console.error(`Erreur lors de la récupération des fichiers .md:`, error)
    // En cas d'erreur, essayer l'approche alternative
    try {
      return await getMarkdownFilesAlternative(directory)
    } catch (altError) {
      throw error // Relancer l'erreur originale
    }
  }
}

// Approche alternative : utiliser la liste des fichiers depuis le repository GitHub
// via l'API GitHub Trees (plus fiable pour les repos privés)
async function getMarkdownFilesAlternative(directory = 'content') {
  try {
    // Utiliser l'API GitHub Trees pour récupérer l'arborescence
    const treeUrl = `${GITHUB_API_BASE}/${GITHUB_REPO}/git/trees/main?recursive=1`
    const response = await fetch(treeUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Filtrer les fichiers .md dans le dossier content
    const mdFiles = data.tree
      .filter(item => 
        item.type === 'blob' && 
        item.path.startsWith(directory + '/') && 
        item.path.endsWith('.md')
      )
      .map(item => ({
        path: item.path,
        name: item.path.split('/').pop(),
        sha: item.sha,
        size: item.size || 0,
        url: `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${item.path}`
      }))
    
    return mdFiles
  } catch (error) {
    console.error(`Erreur lors de la récupération alternative des fichiers .md:`, error)
    throw error
  }
}

// Parser le frontmatter YAML d'un fichier Markdown
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (match) {
    const frontmatterText = match[1]
    const markdownContent = match[2]
    
    // Parser simple du YAML (basique, pour les cas simples)
    const metadata = {}
    const lines = frontmatterText.split('\n')
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        let value = line.substring(colonIndex + 1).trim()
        
        // Enlever les guillemets
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        
        // Parser les listes
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''))
        }
        
        // Parser les nombres
        if (!isNaN(value) && value !== '') {
          value = Number(value)
        }
        
        // Parser les booléens
        if (value === 'true') value = true
        if (value === 'false') value = false
        if (value === 'null') value = null
        
        metadata[key] = value
      }
    }
    
    return { metadata, content: markdownContent }
  }
  
  return { metadata: {}, content }
}

// Récupérer une leçon complète avec son contenu
export async function getLesson(path) {
  try {
    const content = await getFileContent(path)
    const { metadata, content: markdownContent } = parseFrontmatter(content)
    
    return {
      title: metadata.title || path.split('/').pop().replace('.md', ''),
      order: metadata.order || 999,
      parent: metadata.parent || null,
      tags: metadata.tags || [],
      path: path.replace('content/', ''),
      content: markdownContent,
      last_modified: new Date().toISOString() // GitHub API ne fournit pas toujours cette info facilement
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération de la leçon ${path}:`, error)
    throw error
  }
}

// Récupérer toutes les leçons
export async function getAllLessons() {
  try {
    const files = await getMarkdownFiles('content')
    const lessons = []
    
    for (const file of files) {
      try {
        const lesson = await getLesson(file.path)
        lessons.push(lesson)
      } catch (error) {
        console.error(`Erreur lors du parsing de ${file.path}:`, error)
      }
    }
    
    // Trier par ordre puis par titre
    lessons.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order
      return a.title.localeCompare(b.title)
    })
    
    return { lessons }
  } catch (error) {
    console.error('Erreur lors de la récupération des leçons:', error)
    return { lessons: [] }
  }
}

// Récupérer tous les tags
export async function getAllTags() {
  try {
    const { lessons } = await getAllLessons()
    const tagCounts = {}
    
    for (const lesson of lessons) {
      for (const tag of lesson.tags || []) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    }
    
    return { tags: tagCounts }
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error)
    return { tags: {} }
  }
}

// Recherche dans les leçons
export async function searchLessons(query, tags = null) {
  try {
    const { lessons } = await getAllLessons()
    const queryLower = query.toLowerCase()
    
    let results = lessons.filter(lesson => {
      // Filtre par tags
      if (tags && tags.length > 0) {
        const lessonTags = (lesson.tags || []).map(t => t.toLowerCase())
        if (!tags.some(tag => lessonTags.includes(tag.toLowerCase()))) {
          return false
        }
      }
      
      // Recherche dans le titre et le contenu
      if (query) {
        const titleMatch = lesson.title.toLowerCase().includes(queryLower)
        const contentMatch = lesson.content.toLowerCase().includes(queryLower)
        return titleMatch || contentMatch
      }
      
      return true
    })
    
    // Trier par ordre puis par titre
    results.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order
      return a.title.localeCompare(b.title)
    })
    
    return { lessons: results }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    return { lessons: [] }
  }
}

// Récupérer la hiérarchie des leçons
export async function getHierarchy() {
  try {
    const { lessons } = await getAllLessons()
    
    // Organiser en hiérarchie
    const lessonsDict = {}
    const rootLessons = []
    
    // Créer un dictionnaire de toutes les leçons
    for (const lesson of lessons) {
      lessonsDict[lesson.path] = {
        ...lesson,
        children: []
      }
    }
    
    // Organiser la hiérarchie
    for (const lesson of lessons) {
      if (lesson.parent) {
        // Chercher le parent
        const parentPath = lesson.parent
        const parent = lessonsDict[parentPath] || 
                      Object.values(lessonsDict).find(l => l.path.endsWith(parentPath))
        
        if (parent) {
          parent.children.push(lessonsDict[lesson.path])
        } else {
          // Parent non trouvé, traiter comme racine
          rootLessons.push(lessonsDict[lesson.path])
        }
      } else {
        // Pas de parent, c'est une racine
        rootLessons.push(lessonsDict[lesson.path])
      }
    }
    
    // Trier par ordre
    const sortLessons = (lessonsList) => {
      lessonsList.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order
        return a.title.localeCompare(b.title)
      })
      for (const lesson of lessonsList) {
        if (lesson.children && lesson.children.length > 0) {
          sortLessons(lesson.children)
        }
      }
    }
    
    sortLessons(rootLessons)
    
    return { hierarchy: rootLessons }
  } catch (error) {
    console.error('Erreur lors de la récupération de la hiérarchie:', error)
    return { hierarchy: [] }
  }
}

