# Script PowerShell pour démarrer le backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BACKEND - Serveur FastAPI (Python)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Création de l'environnement virtuel si nécessaire
if (-not (Test-Path "venv")) {
    Write-Host "Création de l'environnement virtuel..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: Impossible de créer l'environnement virtuel" -ForegroundColor Red
        Write-Host "Vérifiez que Python est installé et dans le PATH" -ForegroundColor Red
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
} else {
    Write-Host "Environnement virtuel déjà existant" -ForegroundColor Green
}

# Activation de l'environnement virtuel
Write-Host "Activation de l'environnement virtuel..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# Mise à jour de pip
Write-Host "Mise à jour de pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip setuptools wheel

# Installation des dépendances (wheels précompilés pour éviter Rust)
Write-Host "Installation des dépendances Python (wheels précompilés)..." -ForegroundColor Yellow
pip install --only-binary :all: --prefer-binary -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Échec de l'installation des dépendances" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Démarrage du serveur sur http://localhost:8000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

# Démarrage du serveur
uvicorn main:app --reload --host 0.0.0.0 --port 8000

