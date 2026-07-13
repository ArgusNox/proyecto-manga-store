# Fenix Manga Store

Proyecto final de React para una tienda online de mangas/comiquería.

## Funcionalidades

- Catálogo de productos desde Firebase Firestore.
- Vista de detalle por ruta dinámica.
- Carrito global con Context API.
- Agregar, eliminar y vaciar productos.
- Autenticación con Firebase Authentication.
- Rutas privadas para administración.
- CRUD de productos.
- CRUD completo de cupones de descuento.
- Validación de cupones por código, estado, vencimiento y compra mínima.
- Aplicación automática del porcentaje de descuento en el carrito.
- Diseño responsive.

## Gestión de cupones

Los usuarios autenticados pueden ingresar a:

```text
/admin/cupones
```

Desde esa pantalla pueden:

- crear cupones;
- editar cupones;
- activar o desactivar cupones;
- definir porcentaje de descuento;
- definir compra mínima;
- definir fecha de vencimiento;
- eliminar cupones con confirmación.

Los clientes pueden ingresar el código en `/carrito`. La aplicación consulta la colección `coupons` de Firestore y valida que el cupón exista, esté activo, no esté vencido y cumpla la compra mínima.

## Variables de entorno

Crear un archivo `.env` en la raíz:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_PROJECT_ID=tu_project_id
```

## Reglas de Firestore

El archivo `firestore.rules` contiene las reglas requeridas para las colecciones `products` y `coupons`.

Las lecturas son públicas y las operaciones de creación, edición y eliminación requieren autenticación.

## Instalación

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

La aplicación está preparada para Netlify y Vercel.
