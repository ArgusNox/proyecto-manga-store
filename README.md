# Fenix Manga Store

Proyecto final de React para una tienda online de mangas/comiquería.

La aplicación incluye catálogo, detalle de producto, carrito global, autenticación con Firebase y panel privado para administrar productos con Firestore.

## Tecnologías

- React + Vite
- React Router DOM
- Context API
- Firebase Authentication mediante API REST
- Firebase Firestore mediante API REST
- Font Awesome
- CSS responsive con Flex, Grid y media queries

## Funcionalidades implementadas

- Home temática de comiquería.
- Catálogo de mangas.
- Detalle individual por ruta dinámica `/producto/:id`.
- Carrito de compras global con Context API.
- Agregar, quitar y vaciar productos del carrito.
- CartWidget con contador en tiempo real.
- Cupones de descuento en el carrito.
- Registro e ingreso de usuarios con Firebase Authentication.
- Ruta protegida `/admin/productos`.
- CRUD de productos con Firestore:
  - crear producto
  - leer productos
  - editar producto
  - eliminar producto
- Modal de confirmación antes de eliminar.
- Estados de carga y mensajes de error visibles.
- Diseño responsive.

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con estas variables:

```env
VITE_FIREBASE_API_KEY=tu_api_key_de_firebase
VITE_FIREBASE_PROJECT_ID=tu_project_id_de_firebase
```

## Instalación local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Deploy

El proyecto puede publicarse en Netlify o Vercel.

Para Netlify se agregó `public/_redirects` para que las rutas internas de React Router funcionen al recargar la página.

## Usuario para administración

Para la entrega final se debe crear un usuario en Firebase Authentication y compartirlo en el aula virtual junto con el deploy y el repositorio.

Ejemplo de formato de entrega:

```text
Deploy: https://tu-deploy.netlify.app
GitHub: https://github.com/ArgusNox/proyecto-manga-store
Usuario admin: correo configurado en Firebase
Clave admin: clave configurada en Firebase
```
