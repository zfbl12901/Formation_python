@echo off
echo ========================================
echo   Installation des dependances Backend
echo ========================================
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

echo Mise a jour de pip...
%PYTHON_VENV% -m pip install --upgrade pip setuptools wheel

echo.
echo Installation des dependances (utilisation de wheels precompiles)...
echo Cette installation peut prendre quelques minutes...
%PYTHON_VENV% -m pip install --only-binary :all: --prefer-binary -r requirements.txt

if errorlevel 1 (
    echo.
    echo ERREUR: Echec de l'installation
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

