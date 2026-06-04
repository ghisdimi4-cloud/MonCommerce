@echo off
echo ========================================================
echo Démarrage du serveur MonCommerce...
echo ========================================================
echo.

npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo ERREUR : Le serveur n'a pas pu démarrer.
    echo.
    echo Si vous voyez un message indiquant que "npm n'est pas reconnu",
    echo cela signifie que Node.js n'est pas installé sur votre ordinateur.
    echo Veuillez télécharger et installer Node.js depuis https://nodejs.org/
    echo ========================================================
    pause
)
