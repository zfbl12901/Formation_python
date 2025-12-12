@echo off
echo ========================================
echo   Installation avec Versions Recentes
echo ========================================
echo.
echo Cette version installe les dernieres versions
echo compatibles avec des wheels precompiles.
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
echo Installation des dependances (versions recentes)...
echo Cette operation peut prendre quelques minutes...
echo.

REM Installation avec versions recentes
%PYTHON_VENV% -m pip install --prefer-binary fastapi uvicorn[standard] python-multipart python-frontmatter aiofiles "pydantic>=2.6.0"

if errorlevel 1 (
    echo.
    echo ========================================
    echo   Tentative avec requirements-latest.txt...
    echo ========================================
    echo.
    %PYTHON_VENV% -m pip install -r requirements-latest.txt --prefer-binary
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
    echo 4. Essayer: pip install pydantic --upgrade --prefer-binary
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

