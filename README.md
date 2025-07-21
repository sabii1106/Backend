# ÑanEC - Sistema de Gestión de Restaurantes

Este proyecto consiste en un sistema de gestión de restaurantes y tipos de comida, con una API REST construida con Node.js, Express y Sequelize, y un frontend sencillo con HTML, CSS y JavaScript vanilla.

## Estructura del Proyecto

```
Backend-1/
├── frontend/               # Frontend de la aplicación
│   ├── css/                # Estilos CSS
│   ├── js/                 # Scripts JavaScript
│   └── index.html          # Página principal
├── server/                 # Backend con MongoDB (versión anterior)
├── server_mysql/           # Backend con MySQL (versión actual)
│   ├── config/             # Configuración de la base de datos
│   ├── controllers/        # Controladores de la API
│   ├── models/             # Modelos de datos
│   └── routes/             # Rutas de la API
├── temporal/               # Archivos temporales
├── package.json            # Configuración del proyecto
└── server.js               # Punto de entrada del servidor
```

## Requisitos

- Node.js (v14 o superior)
- MySQL

## Instalación

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Configura la base de datos:

   Edita el archivo `server_mysql/config/sequelize.config.js` para ajustar la configuración de tu base de datos MySQL.

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

O, para desarrollo:

```bash
npm run nodemon
```

La aplicación estará disponible en: [http://localhost:8000](http://localhost:8000)

## API Endpoints

### Restaurantes
- `GET /api/v1/restaurantes` - Obtener todos los restaurantes
- `GET /api/v1/restaurantes/:id` - Obtener un restaurante por ID
- `POST /api/v1/restaurantes` - Crear un nuevo restaurante
- `PUT /api/v1/restaurantes/:id` - Actualizar un restaurante
- `DELETE /api/v1/restaurantes/:id` - Eliminar un restaurante

### Tipos de Comida
- `GET /api/v1/tipo-comida` - Obtener todos los tipos de comida
- `GET /api/v1/tipo-comida/:id` - Obtener un tipo de comida por ID
- `POST /api/v1/tipo-comida` - Crear un nuevo tipo de comida
- `PUT /api/v1/tipo-comida/:id` - Actualizar un tipo de comida
- `DELETE /api/v1/tipo-comida/:id` - Eliminar un tipo de comida

### Relaciones (Menú)
- `GET /api/v1/menu` - Obtener todas las relaciones
- `POST /api/v1/menu` - Crear una nueva relación
- `DELETE /api/v1/menu/:id` - Eliminar una relación

### Consultas Especiales
- `GET /api/v1/restaurantesByTipoC/:id` - Obtener restaurantes por tipo de comida
- `GET /api/v1/tipoComidaByResta/:id` - Obtener tipos de comida por restaurante

## Características

- CRUD completo para restaurantes y tipos de comida
- Relación muchos a muchos entre restaurantes y tipos de comida
- Frontend sencillo para visualizar y gestionar los datos
- Filtrado de restaurantes por tipo de comida

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu función (`git checkout -b feature/nueva-funcion`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva función'`)
4. Haz push a la rama (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

## Licencia

ISC - Ver detalles en el archivo `package.json`
