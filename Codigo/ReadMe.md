# Proyecto E-commerce

Esta carpeta contiene el codigo del proyecto tanto el backend como el frontend, sigue los pasos y descarga las aplicaciones dichas aqui para evitar errores al momento de ejecutar el proyecto.

## 🛠️ Requisitos Previos

Asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (u otro sistema compatible con Prisma)

---

## 🚀 Instrucciones de Instalación

### Backend

#### 1️⃣ Navega al directorio del backend:

```bash
cd backend
```

#### 2️⃣ Inicializa un proyecto de Node.js (si aún no se ha hecho):

```bash
npm init -y
```

#### 3️⃣ Instala las dependencias necesarias:

```bash
npm install express prisma nodemon
```

#### 4️⃣ Configura Prisma:

- Inicializa Prisma:

  ```bash
  npx prisma init
  ```

- Esto generará una carpeta `prisma/` con un archivo `schema.prisma`. Configura la conexión a tu base de datos en el archivo `.env` generado (ver detalles abajo).

#### 5️⃣ Configura un script para correr el servidor con Nodemon en el archivo `package.json`:

```json
"scripts": {
  "dev": "nodemon index.js"
}
```

#### 6️⃣ Crea un archivo `.env` en la raíz del proyecto para la conexión a la base de datos:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
```

#### 7️⃣ Ejecuta la migración de Prisma para sincronizar el esquema con la base de datos:

```bash
npx prisma migrate dev --name init
```

#### 8️⃣ Inicia el servidor:

```bash
npm run dev
```

---

### Frontend

#### 1️⃣ Navega al directorio del frontend:

```bash
cd frontend
```

#### 2️⃣ Crea un nuevo proyecto React (si aún no se ha hecho):

```bash
npx create-react-app .
```

#### 3️⃣ Instala TailwindCSS:

- Instala Tailwind y sus dependencias:

  ```bash
  npm install -D tailwindcss postcss autoprefixer
  ```

- Inicializa la configuración de Tailwind:

  ```bash
  npx tailwindcss init
  ```

- Configura `tailwind.config.js` para especificar los archivos a escanear:

  ```javascript
  module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  ```

- Agrega las directivas de Tailwind al archivo CSS principal (`src/index.css`):

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

#### 4️⃣ Inicia la aplicación React:

```bash
npm start
```

---

## 📂 Archivos Clave

### Archivo `.env`

El archivo `.env` es fundamental para la conexión a la base de datos del backend. Asegúrate de incluir:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
```

Reemplaza `usuario`, `contraseña`, y `nombre_base_datos` con los valores correspondientes a tu entorno local.
