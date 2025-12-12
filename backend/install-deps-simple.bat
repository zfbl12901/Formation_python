@echo off
echo ========================================
echo   Installation Simple (sans Rust)
echo ========================================
echo.
echo Cette version installe uniquement les wheels precompiles
echo pour eviter les problemes de compilation Rust.
echo.

REM Creation de l'environnement virtuel si necessaire
if not exist venv (
    echo Creation de l'environnement virtuel...
    python -m venv venv
    if errorlevel 1 (
        echo ERREUR: Impossible de creer l'environnement virtuel
        pause
        exit /b 1
    )
)

REM Utilisation du Python du venv
set PYTHON_VENV=venv\Scripts\python.exe

echo Mise a jour de pip, setuptools et wheel...
%PYTHON_VENV% -m pip install --upgrade pip setuptools wheel

echo.
echo Installation des dependances (wheels precompiles uniquement)...
echo Cette operation peut prendre quelques minutes...
echo.

REM Installation avec preference pour les wheels precompiles
echo Installation des dependances individuelles...
%PYTHON_VENV% -m pip install --upgrade pip setuptools wheel
%PYTHON_VENV% -m pip install --prefer-binary fastapi
%PYTHON_VENV% -m pip install --prefer-binary "uvicorn[standard]"
%PYTHON_VENV% -m pip install --prefer-binary python-multipart
%PYTHON_VENV% -m pip install --prefer-binary python-frontmatter
%PYTHON_VENV% -m pip install --prefer-binary aiofiles
%PYTHON_VENV% -m pip install --prefer-binary pydantic

if errorlevel 1 (
    echo.
    echo ========================================
    echo   Tentative avec installation depuis requirements.txt...
    echo ========================================
    echo.
    %PYTHON_VENV% -m pip install -r requirements.txt --prefer-binary --upgrade
)

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERREUR: Echec de l'installation
    echo ========================================
    echo.
    echo Solutions possibles:
    echo 1. Installer Rust: winget install Rustlang.Rustup
    echo 2. Utiliser Python 3.11+ (meilleur support des wheels)
    echo 3. Verifier votre connexion internet
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo   Installation reussie !
    echo ========================================
    echo.
    echo Vous pouvez maintenant lancer: start.bat
)

pause

