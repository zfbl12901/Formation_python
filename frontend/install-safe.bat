@echo off
echo ========================================
echo Installation securisee des dependances
echo ========================================
echo.
echo Cette installation ignore les scripts optionnels
echo qui necessitent Rust/Cargo.
echo.
echo Appuyez sur une touche pour continuer...
pause >nul
echo.
echo Installation en cours...
call npm install --ignore-scripts
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo Installation reussie !
    echo ========================================
    echo.
    echo Vous pouvez maintenant lancer: npm run dev
) else (
    echo ========================================
    echo Erreur lors de l'installation
    echo ========================================
)
pause

