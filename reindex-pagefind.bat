@echo off
echo =========================================
echo Brainstream Media Group — Pagefind Reindex
echo =========================================
echo.

cd /d G:\Brainstream-Home

echo Running Pagefind indexing...
echo.

npx pagefind --site .

echo.
echo =========================================
echo Pagefind indexing complete.
echo You can now commit the updated index.
echo =========================================

pause
