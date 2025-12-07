#!/bin/bash

echo "==> Usuwam Tailwind 4.x i stare konfiguracje..."
pnpm remove tailwindcss @tailwindcss/postcss 2>/dev/null
rm -f postcss.config.js
rm -f tailwind.config.js

echo "==> Instaluję TailwindCSS 3.x, PostCSS i Autoprefixer..."
pnpm add -D tailwindcss@3 postcss autoprefixer

echo "==> Generuję konfigurację Tailwind + PostCSS..."
npx tailwindcss init -p

echo "==> Ustawiam poprawne tailwind.config.js..."
cat << 'CONF' > tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
CONF

echo "==> Upewniam się, że plik CSS jest poprawny..."
mkdir -p src/styles
cat << 'CSS' > src/styles/main.css
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS

echo "==> Czyszczę cache Vite..."
rm -rf node_modules/.vite

echo "==> Instaluję zależności..."
pnpm install

echo "==> Naprawa zakończona. Uruchom: pnpm dev"
