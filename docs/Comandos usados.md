**Crear frontend con Vite + React + TypeScript**
npm create vite@latest . -- --template react-ts
npm install

**Arrancar server**
npm run dev

**instalar Tailwind**
npm install tailwindcss @tailwindcss/vite

**instalar React Router**
npm install react-router-dom

**Crear carpetas frontend**
New-Item -ItemType Directory -Force -Path src\components,src\hooks,src\types,src\utils,src\context,src\api

**Crear estructura server**
cd server
npm init -y
npm install express cors
npm install -D typescript @types/express @types/cors @types/node tsx

**Inicializar Git + first commit**
git init
git add .
git commit -m "chore: inicializar FlashLearn con frontend y backend base"

**Crear una rama de seguridad**
git checkout -b chore/ui-cva-migration