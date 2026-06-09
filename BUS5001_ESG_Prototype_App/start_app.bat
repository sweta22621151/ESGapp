@echo off
cd /d "%~dp0"
echo Starting BUS5001 ESG prototype app...
echo Open http://localhost:8000 in your browser.
python -m http.server 8000
pause
