## 📦 challengefinal-akademi-aylenpattuzzi-backend

Proyecto backend para el challenge final de Akademi. Esta API está construida con **Node.js**, **Express**, y usa **MongoDB** como base de datos.

---

### 📁 Estructura del Proyecto

```
challengefinal-akademi-aylenpattuzzi-backend/
├── node_modules/
├── Postman/                # Colecciones de pruebas con Postman
├── src/
│   ├── controllers/        # Lógica de negocio y controladores
│   ├── middlewares/        # Middlewares personalizados
│   ├── models/             # Modelos de Mongoose
│   ├── routes/             # Rutas de la API
│   └── utils/              # Funciones auxiliares
├── .env                    # Variables de entorno
├── .gitignore              # Archivos ignorados por git
├── package.json
├── package-lock.json
└── server.js               # Punto de entrada de la aplicación
```

---

### ⚙️ Requisitos

* Node.js >= 16.x
* npm >= 8.x
* MongoDB (local o en la nube, como MongoDB Atlas)

---

### 🚀 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/AylenRominaPattuzzi/challengefinal-akademi-aylenpattuzzi-backend.git
cd challengefinal-akademi-aylenpattuzzi-backend
```

2. Instala las dependencias:

```bash
npm install
```
---

### 📦 Dependencias Principales

* `express`: Framework para servidor HTTP.
* `mongoose`: ODM para MongoDB.
* `bcrypt` / `bcryptjs`: Para el hash de contraseñas.
* `jsonwebtoken`: Para generar y verificar tokens JWT.
* `cors`: Middleware para permitir peticiones desde otros orígenes.
* `dotenv`: Para manejar variables de entorno.
* `nodemailer`: Envío de correos electrónicos.

