# Backend SOLID API

API RESTful desarrollada con **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, **PostgreSQL** y **Redis**, implementando una arquitectura por capas desacoplada basada en los principios **SOLID**.

---

## 📌 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura y Principios SOLID](#-arquitectura-y-principios-solid)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Variables de Entorno](#-variables-de-entorno)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Scripts Disponibles](#-scripts-disponibles)
- [Endpoints de la API](#-endpoints-de-la-api)
  - [Salud del Sistema (Health)](#salud-del-sistema-health)
  - [Módulo de Usuarios](#módulo-de-usuarios)
- [Modelo de Datos](#-modelo-de-datos)

---

## 🚀 Características

- **Diseño Modular y Desacoplado**: Organización por módulos funcionales (`users`, `health`).
- **Arquitectura en Capas**: Rutas, Controladores, Casos de uso/Servicios y Repositorios.
- **Inyección de Dependencias**: Clases desacopladas mediante interfaces TypeScript.
- **ORM Prisma**: Mapeo relacional seguro con soporte para migraciones, índices compuestos y transacciones atómicas.
- **Caché y Monitoreo**: Integración con cliente Redis y verificación del estado del servicio.
- **Operaciones Atómicas**: Transacciones para la creación y eliminación en cascada de Usuarios y sus Perfiles.

---

## 🏛 Arquitectura y Principios SOLID

El proyecto está diseñado bajo los siguientes principios:

- **S (Single Responsibility Principle)**: Cada clase tiene una única responsabilidad.
  - *Controller*: Gestiona las peticiones HTTP y respuestas.
  - *Service*: Contiene la lógica de negocio y validación de reglas.
  - *Repository*: Responsable exclusivo del acceso y manipulación de datos en la base de datos.
- **O (Open/Closed Principle)**: El sistema está abierto a la extensión (ej. agregar nuevos módulos o repositorios) sin modificar el código base de la infraestructura existente.
- **L (Liskov Substitution Principle)**: Los servicios consumen abstracciones (`IUserRepository`, `IHealthRepository`), permitiendo sustituir implementaciones (por ejemplo, mocks de prueba o un repositorio basado en otro motor) sin romper el funcionamiento.
- **I (Interface Segregation Principle)**: Interfaces bien definidas y específicas para clientes (`IUserService`, `IUserRepository`, `IHealthService`, `IHealthRepository`).
- **D (Dependency Inversion Principle)**: Los módulos de alto nivel (Servicios/Controladores) no dependen de detalles de bajo nivel, sino de abstracciones (interfaces inyectadas en sus constructores).

---

## 🛠 Tecnologías Utilizadas

- **Runtime**: [Node.js](https://nodejs.org/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Framework Web**: [Express 5](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Bases de Datos**:
  - [PostgreSQL](https://www.postgresql.org/) (almacenamiento relacional principal)
  - [Redis](https://redis.io/) (soporte de caché / monitoreo)
- **Herramientas de Desarrollo**: `ts-node-dev`, `dotenv`, `@types/express`, `pg`

---

## 📂 Estructura del Proyecto

```text
Bakend-SOLID/
├── prisma/
│   ├── migrations/            # Historial de migraciones de base de datos
│   ├── prisma.config.ts       # Configuración de Prisma
│   └── schema.prisma          # Definición del modelo relacional
├── src/
│   ├── config/                # Configuraciones globales
│   │   ├── database.ts        # Pool de conexión a PostgreSQL
│   │   ├── env.ts             # Variables de entorno tipadas
│   │   └── redis.ts           # Conexión al cliente Redis
│   ├── infra/                 # Clientes de infraestructura
│   │   └── prisma.ts          # Instancia única del cliente Prisma
│   ├── modules/               # Módulos de la aplicación
│   │   ├── health/            # Chequeo de salud del servicio (DB + Redis)
│   │   │   ├── health.controller.ts
│   │   │   ├── health.repository.ts
│   │   │   ├── health.routes.ts
│   │   │   └── health.service.ts
│   │   └── users/             # Gestión de usuarios, perfiles y departamentos
│   │       ├── user.controller.ts
│   │       ├── user.repository.ts
│   │       ├── user.routes.ts
│   │       └── user.service.ts
│   ├── app.ts                 # Configuración de Express y middlewares
│   └── server.ts              # Inicialización y arranque del servidor
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 📋 Requisitos Previos

- **Node.js** (versión 18 o superior recomendada)
- **PostgreSQL** en ejecución
- **Redis** en ejecución

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente plantilla:

```env
PORT=3000

# Conexión para Prisma
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db?schema=public"

# Conexión directa a PostgreSQL (para el pool pg / health check)
DB_HOST=localhost
DB_PORT=5432
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=nombre_db

# Conexión a Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🚀 Instalación y Puesta en Marcha

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/AngieCaiza27/Bakend-SOLID.git
   cd Bakend-SOLID
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar migraciones de base de datos con Prisma:**
   ```bash
   npx prisma migrate dev
   ```

4. **Generar el cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

5. **Iniciar en entorno de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga en caliente (`ts-node-dev`). |
| `npm run build` | Compila el proyecto TypeScript a JavaScript en el directorio `dist/`. |
| `npm start` | Ejecuta la aplicación compilada desde `dist/server.js`. |

---

## 📡 Endpoints de la API

La API expone sus rutas bajo el prefijo `/api`.

### Salud del Sistema (Health)

#### `GET /api/health`
Verifica la disponibilidad de PostgreSQL y Redis, así como el tiempo de actividad del servicio.

- **Respuesta (200 OK):**
  ```json
  {
    "status": "ok",
    "uptime": 12.34,
    "db": true,
    "redis": true
  }
  ```
  *Valores posibles de `status`: `"ok"`, `"degraded"`, `"down"`.*

---

### Módulo de Usuarios

#### `GET /api/usuarios`
Obtiene un listado paginado y filtrable de usuarios. Incluye datos de perfil y departamento.

- **Parámetros de consulta (Query params opcionales):**
  - `page`: Número de página (por defecto: `1`).
  - `limit`: Límite de elementos por página (por defecto: `10`).
  - `nombre`: Filtro parcial e insensible a mayúsculas.
  - `rol`: Filtrar por rol (`ADMIN` o `USUARIO`).
  - `sort`: Campo y dirección de ordenamiento, formato `campo:direccion` (ejemplo: `nombre:asc` o `createdAt:desc`).

#### `GET /api/usuarios/:id`
Obtiene un usuario por su identificador.

- **Respuesta (200 OK):**
  ```json
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "USUARIO",
    "departamentoId": 2,
    "createdAt": "2026-11-17T10:00:00.000Z",
    "departamento": {
      "id": 2,
      "nombre": "Tecnología"
    },
    "perfil": {
      "id": 1,
      "bio": "Desarrollador Full Stack",
      "usuarioId": 1
    }
  }
  ```

#### `POST /api/usuarios`
Crea un nuevo usuario de forma atómica junto a su perfil.

- **Cuerpo de la petición (JSON):**
  ```json
  {
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "USUARIO",
    "departamentoId": 2,
    "bio": "Desarrollador Backend"
  }
  ```

#### `PUT /api/usuarios/:id`
Actualiza parcialmente o totalmente los datos de un usuario y realiza un upsert de su perfil.

- **Cuerpo de la petición (JSON):**
  ```json
  {
    "nombre": "Juan Carlos Pérez",
    "bio": "Líder Técnico"
  }
  ```

#### `DELETE /api/usuarios/:id`
Elimina un usuario y su perfil asociado mediante una transacción en base de datos.

- **Respuesta (204 No Content)**

---

## 🗄 Modelo de Datos

Definido mediante **Prisma Schema**:

- **Usuario**:
  - `id`: Entero autoincremental (Clave primaria).
  - `nombre`: Cadena de texto.
  - `email`: Cadena única.
  - `rol`: Enum (`ADMIN` | `USUARIO`).
  - `departamentoId`: Referencia opcional al departamento.
  - `createdAt`: Fecha de creación.
  - Índice compuesto: `@@index([rol, nombre])`.
- **Departamento**:
  - `id`: Entero autoincremental.
  - `nombre`: Cadena de texto.
- **Perfil**:
  - `id`: Entero autoincremental.
  - `bio`: Cadena de texto opcional.
  - `usuarioId`: Relación uno a uno (`@unique`) hacia `Usuario`.
