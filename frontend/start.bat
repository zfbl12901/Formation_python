@echo off
echo ========================================
echo   FRONTEND - Application React (Node.js)
echo ========================================
echo.
echo ATTENTION: Ceci est le FRONTEND Node.js
echo Pour le backend, allez dans le dossier backend/
echo.
echo Installation des dependances...
echo (Si vous voyez une erreur Rust/Cargo, c'est normal et non-bloquant)
if not exist node_modules (
    call npm install --ignore-scripts
) else (
    echo Dependances deja installees, passage au demarrage...
)
echo.
echo ========================================
echo   Demarrage du serveur sur http://localhost:5173
echo ========================================
echo.
call npm run dev


