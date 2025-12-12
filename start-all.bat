@echo off
echo ========================================
echo   DEMARRAGE COMPLET - Formation Python
echo ========================================
echo.
echo Ce script va demarrer le backend ET le frontend
echo dans deux fenetres separees.
echo.
echo Appuyez sur une touche pour continuer...
pause >nul
echo.

echo Demarrage du BACKEND (Python/FastAPI)...
start "Backend - FastAPI" cmd /k "cd /d %~dp0backend && start.bat"

timeout /t 3 /nobreak >nul

echo Demarrage du FRONTEND (React/Vite)...
start "Frontend - React" cmd /k "cd /d %~dp0frontend && start.bat"

echo.
echo ========================================
echo   Les deux serveurs sont en cours de demarrage
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul

