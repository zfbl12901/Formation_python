"""
API FastAPI pour la plateforme de formation Python
Gère l'agrégation, la hiérarchisation et la recherche des fichiers Markdown
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import frontmatter
import aiofiles
from pathlib import Path
import json
from datetime import datetime

app = FastAPI(
    title="Formation Python API",
    description="API pour la plateforme de formation Python avec agrégation de fichiers Markdown",
    version="1.0.0"
)

# Configuration CORS
import os

# Origines autorisées (développement + production)
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Ajouter les origines depuis les variables d'environnement
if os.getenv("ALLOWED_ORIGINS"):
    allowed_origins.extend(os.getenv("ALLOWED_ORIGINS").split(","))

# En production, vous pouvez aussi autoriser toutes les origines (moins sécurisé)
# allowed_origins = ["*"]  # ⚠️ À utiliser avec précaution

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
CONTENT_DIR = Path("../content")
CONTENT_DIR.mkdir(exist_ok=True)

class LessonMetadata(BaseModel):
    title: str
    order: int = 0
    parent: Optional[str] = None
    tags: List[str] = []
    path: str
    content: str
    last_modified: str

class LessonList(BaseModel):
    lessons: List[LessonMetadata]

class SearchQuery(BaseModel):
    query: str
    tags: Optional[List[str]] = None

def parse_markdown_file(file_path: Path) -> Dict:
    """Parse un fichier Markdown avec frontmatter"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
            
        metadata = {
            "title": post.metadata.get("title", file_path.stem),
            "order": post.metadata.get("order", 999),
            "parent": post.metadata.get("parent"),
            "tags": post.metadata.get("tags", []),
            "path": str(file_path.relative_to(CONTENT_DIR)),
            "content": post.content,
            "last_modified": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
        }
        return metadata
    except Exception as e:
        return {
            "title": file_path.stem,
            "order": 999,
            "parent": None,
            "tags": [],
            "path": str(file_path.relative_to(CONTENT_DIR)),
            "content": "",
            "last_modified": datetime.now().isoformat()
        }

@app.get("/api")
async def api_info():
    """Informations sur l'API en JSON"""
    return {
        "message": "Formation Python API",
        "version": "1.0.0",
        "endpoints": {
            "lessons": "/api/lessons",
            "lesson": "/api/lessons/{path}",
            "tags": "/api/tags",
            "search": "/api/search",
            "hierarchy": "/api/hierarchy"
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        }
    }

@app.get("/", response_class=HTMLResponse)
async def root():
    """Page d'accueil de l'API avec documentation"""
    html_content = """
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Formation Python API</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #e5e5e5;
                min-height: 100vh;
                padding: 2rem;
                line-height: 1.6;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            header {
                text-align: center;
                margin-bottom: 3rem;
                padding: 2rem;
                background: rgba(59, 130, 246, 0.1);
                border-radius: 12px;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }
            h1 {
                font-size: 2.5rem;
                margin-bottom: 0.5rem;
                color: #3b82f6;
            }
            .version {
                color: #a0a0a0;
                font-size: 1rem;
            }
            .content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-bottom: 2rem;
            }
            .card {
                background: rgba(26, 26, 26, 0.8);
                border: 1px solid rgba(51, 51, 51, 0.5);
                border-radius: 8px;
                padding: 1.5rem;
                transition: all 0.3s ease;
            }
            .card:hover {
                border-color: #3b82f6;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
            }
            .card h2 {
                color: #3b82f6;
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            .card p {
                color: #a0a0a0;
                margin-bottom: 1rem;
            }
            .endpoint {
                background: rgba(10, 10, 10, 0.5);
                padding: 0.5rem;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                color: #3b82f6;
                margin: 0.5rem 0;
                word-break: break-all;
            }
            .btn {
                display: inline-block;
                padding: 0.75rem 1.5rem;
                background: #3b82f6;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin-top: 1rem;
                transition: background 0.3s ease;
            }
            .btn:hover {
                background: #2563eb;
            }
            .btn-secondary {
                background: rgba(59, 130, 246, 0.2);
                border: 1px solid #3b82f6;
            }
            .btn-secondary:hover {
                background: rgba(59, 130, 246, 0.3);
            }
            .status {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                background: rgba(34, 197, 94, 0.2);
                color: #22c55e;
                border-radius: 4px;
                font-size: 0.875rem;
                margin-left: 1rem;
            }
            footer {
                text-align: center;
                margin-top: 3rem;
                padding: 2rem;
                color: #a0a0a0;
                border-top: 1px solid rgba(51, 51, 51, 0.5);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🐍 Formation Python API</h1>
                <p class="version">Version 1.0.0 <span class="status">● En ligne</span></p>
                <p style="margin-top: 1rem; color: #a0a0a0;">
                    API pour la plateforme de formation Python avec agrégation de fichiers Markdown
                </p>
            </header>

            <div class="content">
                <div class="card">
                    <h2>📚 Documentation Interactive</h2>
                    <p>Accédez à la documentation complète de l'API avec Swagger UI</p>
                    <div class="endpoint">GET /docs</div>
                    <a href="/docs" class="btn">Ouvrir Swagger UI</a>
                </div>

                <div class="card">
                    <h2>📖 Documentation Alternative</h2>
                    <p>Version alternative de la documentation avec ReDoc</p>
                    <div class="endpoint">GET /redoc</div>
                    <a href="/redoc" class="btn btn-secondary">Ouvrir ReDoc</a>
                </div>

                <div class="card">
                    <h2>🔍 Endpoints Disponibles</h2>
                    <p>Liste des principaux endpoints de l'API :</p>
                    <div class="endpoint">GET /api/lessons</div>
                    <div class="endpoint">GET /api/lessons/{path}</div>
                    <div class="endpoint">GET /api/tags</div>
                    <div class="endpoint">POST /api/search</div>
                    <div class="endpoint">GET /api/hierarchy</div>
                </div>

                <div class="card">
                    <h2>🚀 Frontend</h2>
                    <p>Accédez à l'interface utilisateur de la formation</p>
                    <p style="color: #a0a0a0; font-size: 0.9rem;">
                        Le frontend devrait être disponible sur <strong>http://localhost:5173</strong>
                    </p>
                    <a href="http://localhost:5173" class="btn" target="_blank">Ouvrir le Frontend</a>
                </div>
            </div>

            <footer>
                <p>API développée avec FastAPI • Documentation générée automatiquement</p>
                <p style="margin-top: 0.5rem; font-size: 0.875rem;">
                    Pour plus d'informations, consultez la documentation interactive ci-dessus
                </p>
            </footer>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/api/lessons", response_model=LessonList)
async def get_all_lessons():
    """Récupère tous les fichiers Markdown avec leurs métadonnées"""
    lessons = []
    
    if not CONTENT_DIR.exists():
        return LessonList(lessons=[])
    
    for md_file in CONTENT_DIR.rglob("*.md"):
        metadata = parse_markdown_file(md_file)
        lessons.append(LessonMetadata(**metadata))
    
    # Trier par ordre puis par titre
    lessons.sort(key=lambda x: (x.order, x.title))
    
    return LessonList(lessons=lessons)

@app.get("/api/lessons/{lesson_path:path}")
async def get_lesson(lesson_path: str):
    """Récupère le contenu d'une leçon spécifique"""
    file_path = CONTENT_DIR / lesson_path
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Leçon non trouvée")
    
    metadata = parse_markdown_file(file_path)
    return LessonMetadata(**metadata)

@app.get("/api/tags")
async def get_all_tags():
    """Récupère tous les tags uniques avec leur nombre d'occurrences"""
    lessons = []
    
    if not CONTENT_DIR.exists():
        return {"tags": {}}
    
    for md_file in CONTENT_DIR.rglob("*.md"):
        metadata = parse_markdown_file(md_file)
        lessons.append(metadata)
    
    tag_counts = {}
    for lesson in lessons:
        for tag in lesson.get("tags", []):
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
    
    return {"tags": tag_counts}

@app.post("/api/search")
async def search_lessons(search: SearchQuery):
    """Recherche dans les leçons par texte et/ou tags"""
    lessons = []
    
    if not CONTENT_DIR.exists():
        return LessonList(lessons=[])
    
    query_lower = search.query.lower()
    
    for md_file in CONTENT_DIR.rglob("*.md"):
        metadata = parse_markdown_file(md_file)
        
        # Filtre par tags si spécifiés
        if search.tags:
            lesson_tags = [tag.lower() for tag in metadata.get("tags", [])]
            if not any(tag.lower() in lesson_tags for tag in search.tags):
                continue
        
        # Recherche dans le titre et le contenu
        title = metadata.get("title", "").lower()
        content = metadata.get("content", "").lower()
        
        if query_lower in title or query_lower in content:
            lessons.append(LessonMetadata(**metadata))
    
    # Trier par ordre puis par titre
    lessons.sort(key=lambda x: (x.order, x.title))
    
    return LessonList(lessons=lessons)

def flatten_hierarchy(hierarchy_list, flat_list=None, parent_path=None):
    """Aplatit la hiérarchie en liste ordonnée"""
    if flat_list is None:
        flat_list = []
    
    for item in hierarchy_list:
        flat_list.append({
            "path": item["path"],
            "title": item["title"],
            "order": item.get("order", 999),
            "parent": parent_path
        })
        if item.get("children"):
            flatten_hierarchy(item["children"], flat_list, item["path"])
    
    return flat_list

@app.get("/api/navigation/{lesson_path:path}")
async def get_navigation(lesson_path: str):
    """Retourne la navigation (précédent/suivant) et le breadcrumb pour une leçon"""
    # Récupérer toutes les leçons
    lessons = []
    if CONTENT_DIR.exists():
        for md_file in CONTENT_DIR.rglob("*.md"):
            metadata = parse_markdown_file(md_file)
            lessons.append(metadata)
    
    # Trier par ordre
    lessons.sort(key=lambda x: (x.get("order", 999), x.get("title", "")))
    
    # Trouver l'index de la leçon actuelle
    current_index = None
    for i, lesson in enumerate(lessons):
        if lesson["path"] == lesson_path:
            current_index = i
            break
    
    if current_index is None:
        return {
            "previous": None,
            "next": None,
            "breadcrumb": []
        }
    
    # Navigation précédent/suivant
    previous = lessons[current_index - 1] if current_index > 0 else None
    next_lesson = lessons[current_index + 1] if current_index < len(lessons) - 1 else None
    
    # Construire le breadcrumb
    current_lesson = lessons[current_index]
    
    # Construire la hiérarchie pour le breadcrumb
    lessons_dict = {lesson["path"]: lesson for lesson in lessons}
    root_lessons = []
    
    for lesson in lessons:
        lesson_copy = lesson.copy()
        lesson_copy["children"] = []
        lessons_dict[lesson["path"]]["processed"] = lesson_copy
    
    for lesson in lessons:
        parent_path = lesson.get("parent")
        if parent_path:
            parent_found = None
            for path, lesson_data in lessons_dict.items():
                if parent_path == path or parent_path == Path(path).name:
                    parent_found = lesson_data
                    break
            
            if parent_found and "processed" in parent_found:
                parent_found["processed"]["children"].append(lessons_dict[lesson["path"]]["processed"])
            else:
                root_lessons.append(lessons_dict[lesson["path"]]["processed"])
        else:
            root_lessons.append(lessons_dict[lesson["path"]]["processed"])
    
    def find_path_in_hierarchy(hierarchy_list, target_path, path_so_far=None):
        if path_so_far is None:
            path_so_far = []
        
        for item in hierarchy_list:
            current_path = path_so_far + [{"path": item["path"], "title": item["title"]}]
            
            if item["path"] == target_path:
                return current_path
            
            if item.get("children"):
                result = find_path_in_hierarchy(item["children"], target_path, current_path)
                if result:
                    return result
        
        return None
    
    breadcrumb = find_path_in_hierarchy(root_lessons, lesson_path) or [{"path": current_lesson["path"], "title": current_lesson["title"]}]
    
    return {
        "previous": {
            "path": previous["path"],
            "title": previous["title"]
        } if previous else None,
        "next": {
            "path": next_lesson["path"],
            "title": next_lesson["title"]
        } if next_lesson else None,
        "breadcrumb": breadcrumb
    }

@app.get("/api/hierarchy")
async def get_hierarchy():
    """Retourne la hiérarchie des leçons organisée par parent"""
    lessons = []
    
    if not CONTENT_DIR.exists():
        return {"hierarchy": []}
    
    for md_file in CONTENT_DIR.rglob("*.md"):
        metadata = parse_markdown_file(md_file)
        lessons.append(metadata)
    
    # Organiser en hiérarchie
    lessons_dict = {lesson["path"]: lesson for lesson in lessons}
    root_lessons = []
    
    for lesson in lessons:
        lesson_copy = lesson.copy()
        lesson_copy["children"] = []
        lessons_dict[lesson["path"]]["processed"] = lesson_copy
    
    for lesson in lessons:
        parent_path = lesson.get("parent")
        if parent_path:
            # Chercher le parent par nom de fichier ou chemin
            parent_found = None
            for path, lesson_data in lessons_dict.items():
                # Vérifier si le parent correspond au nom de fichier ou au chemin
                if parent_path == path or parent_path == Path(path).name:
                    parent_found = lesson_data
                    break
            
            if parent_found and "processed" in parent_found:
                parent_found["processed"]["children"].append(lessons_dict[lesson["path"]]["processed"])
            else:
                # Parent non trouvé, traiter comme racine
                root_lessons.append(lessons_dict[lesson["path"]]["processed"])
        else:
            root_lessons.append(lessons_dict[lesson["path"]]["processed"])
    
    # Trier par ordre
    def sort_lessons(lessons_list):
        lessons_list.sort(key=lambda x: (x.get("order", 999), x.get("title", "")))
        for lesson in lessons_list:
            if lesson.get("children"):
                sort_lessons(lesson["children"])
    
    sort_lessons(root_lessons)
    
    return {"hierarchy": root_lessons}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

