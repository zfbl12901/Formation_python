@echo off
echo ========================================
echo   BACKEND - Serveur FastAPI (Python)
echo ========================================
echo.
echo ATTENTION: Ceci est le BACKEND Python
echo Pour le frontend, allez dans le dossier frontend/
echo.

REM Creation de l'environnement virtuel si necessaire
if not exist venv (
    echo Creation de l'environnement virtuel...
    python -m venv venv
    if errorlevel 1 (
        echo ERREUR: Impossible de creer l'environnement virtuel
        echo Verifiez que Python est installe et dans le PATH
        pause
        exit /b 1
    )
) else (
    echo Environnement virtuel deja existant
)

REM Utilisation du Python du venv directement (plus fiable que l'activation)
set PYTHON_VENV=venv\Scripts\python.exe

REM Verification que le Python du venv existe
if not exist %PYTHON_VENV% (
    echo ERREUR: Python du venv introuvable
    pause
    exit /b 1
)

echo.
echo Installation/Mise a jour des dependances Python...
echo (Utilisation de wheels precompiles pour eviter Rust)...
%PYTHON_VENV% -m pip install --upgrade pip setuptools wheel
%PYTHON_VENV% -m pip install --only-binary :all: --prefer-binary -r requirements.txt
if errorlevel 1 (
    echo ERREUR: Echec de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Demarrage du serveur sur http://localhost:8000
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

REM Utilisation de python -m uvicorn au lieu de uvicorn directement
%PYTHON_VENV% -m uvicorn main:app --reload --host 0.0.0.0 --port 8000


