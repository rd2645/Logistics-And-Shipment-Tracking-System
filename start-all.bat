@echo off
echo ========================================================
echo CargoX Logistics System - Startup Script
echo ========================================================
echo.

echo Cleaning up any old stuck background processes...
taskkill /F /IM java.exe /T >nul 2>&1
taskkill /F /IM dotnet.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
echo Done.

echo [1/3] Starting .NET Auth Service (Port 8081)...
start "Auth Service" cmd /c "cd auth-service && dotnet run"

echo [2/3] Starting Java Spring Boot Backend (Port 8080)...
start "Core Backend" cmd /c "cd backend && mvnw.cmd spring-boot:run"

echo [3/3] Starting React Frontend (Port 5173)...
start "React Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo ========================================================
echo Services are starting in separate windows.
echo Please wait about 15-20 seconds for the backend to boot up.
echo Once the React Frontend terminal shows "Local: http://localhost:5173/", 
echo you can open that link in your browser!
echo ========================================================
pause
