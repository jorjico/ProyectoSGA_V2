# Proyecto SGA

**Descripción:**  
Proyecto SGA es una aplicación desarrollada para facilitar la gestión integral de productos, stock, compras, proyectos y clientes en entornos empresariales.  
Su objetivo principal es centralizar la información y los procesos relacionados con el inventario y la administración de pedidos, permitiendo un control más eficiente y preciso de los recursos.  

Con Proyecto SGA, los usuarios pueden llevar un seguimiento detallado de los productos disponibles, registrar entradas y salidas de stock, gestionar proveedores y clientes, así como supervisar el estado de diferentes proyectos de manera organizada y accesible.


## Motivación / Propósito del Proyecto

El principal objetivo de Proyecto SGA es resolver las dificultades que enfrentan las empresas al gestionar productos, inventario, compras y clientes de manera manual o fragmentada.  
Muchas veces, la información se encuentra dispersa en diferentes documentos o sistemas, lo que genera errores, pérdidas de tiempo y dificultad para tomar decisiones informadas.  

Proyecto SGA nace para centralizar todos estos procesos en una sola plataforma, permitiendo:  
- Control preciso del stock de productos. 
- Registro eficiente de compras, albaranes y movimientos de inventario.  
- Gestión organizada de clientes y proveedores.  
- Seguimiento claro de proyectos y pedidos asociados, mejorando la trazabilidad.

En resumen, este proyecto busca **agilizar la gestión empresarial y reducir errores**, ofreciendo una herramienta práctica tanto para el personal administrativo como para el departamento de compras.


## Funcionalidades Principales

Proyecto SGA ofrece un conjunto completo de herramientas para la gestión de productos, stock, compras y clientes, incluyendo:  

- **Gestión de productos:** Crear, editar, eliminar y consultar productos de manera sencilla, incluyendo detalles como SKU, descripción y precio, así como una foto del producto para que sea facilmente identificable.
- **Control de stock:** Registrar entradas y salidas de inventario, así como consultar el stock disponible en tiempo real para evitar faltantes o excedentes. Las salidas pueden asociarse a proyectos específicos, lo que permite conocer el consumo de producto que ha tenido cada proyecto y facilitar la planificación de recursos.
- **Gestión de compras y proveedores:** Registrar pedidos a proveedores, llevar un seguimiento de referencias y precios, y gestionar contactos asociados a cada proveedor.  
- **Administración de clientes:** Crear y mantener información de clientes, facilitando la gestión de pedidos y proyectos asociados.  
- **Seguimiento de proyectos:** Visualizar el estado actual de cada proyecto, permitiendo un control claro del progreso y del consumo de recursos asociados a ellos.  
- **Autenticación y roles de usuario:** Control de acceso mediante login, diferenciando permisos entre administradores y usuarios regulares para mantener la seguridad de la información.  
- **Filtros y búsquedas avanzadas:** Aplicar filtros en listados y tablas para encontrar información rápidamente, mejorando la eficiencia en la gestión diaria.  

Estas funcionalidades hacen de Proyecto SGA una herramienta completa para optimizar los procesos administrativos y logísticos de una empresa. Proyecto SGA se encuentra actualmente en fase de prueba y se prevé la incorporación de nuevas funcionalidades y mejoras en futuras versiones.


## Tecnologías Utilizadas

Proyecto SGA está construido con un stack moderno y robusto, combinando tecnologías que permiten un desarrollo eficiente y escalable:  

- **Frontend:**  
  - **React:** Biblioteca principal para construir la interfaz de usuario.  
  - **Vite:** Herramienta de construcción rápida y ligera para React.  
  - **Chakra UI:** Framework de componentes que facilita el diseño de interfaces accesibles y responsivas.  
  - **React Router:** Manejo de rutas y navegación dentro de la aplicación.
  - **React Hook Form:** Gestión eficiente de formularios y validaciones.  

- **Backend:**  
  - **Node.js:** Entorno de ejecución para JavaScript en el servidor.  
  - **Express:** Framework para crear APIs REST de manera sencilla y estructurada.
  - **cors:** Permite peticiones desde el frontend.
  - **dotenv:** Gestión de variables de entorno. 
  - **Multer:** Manejo de subida de archivos (si aplica).
  - **csv-parse / json2csv:** Lectura y exportación de datos en formato CSV.
  - **nodemon (dev):** Reinicio automático del backend en desarrollo

- **Base de datos:**  
  - **MongoDB / Mongo Atlas:** Base de datos NoSQL utilizada para almacenar productos, clientes, proyectos, movimientos de stock y demás información.  

- **Otras herramientas y librerías:**  
  - **fetch:** API nativa de JavaScript para realizar peticiones HTTP entre frontend y backend.   
  - **JWT (JSON Web Tokens):** Autenticación y gestión de sesiones de usuario.  
  - **bcrypt:** Encriptación de contraseñas para mayor seguridad.  
  - **ESLint:** Estilo de código consistente y detección de errores.


## Estructura del Proyecto

El proyecto está organizado en dos carpetas principales: `backend` y `frontend`, cada una con su propia estructura interna:

/Proyecto-SGA
│
├─ /backend
│ ├─ /config # Archivos de configuración del servidor y la base de datos
│ ├─ /controllers # Lógica de negocio y manejo de peticiones
│ ├─ /data # Datos estáticos o de prueba
│ ├─ /middleware # Funciones intermedias como autenticación y manejo de errores
│ ├─ /models # Modelos de MongoDB (Producto, Movimiento, Usuario, etc.)
│ ├─ /routes # Definición de rutas del API
│ ├─ /utils # Funciones y utilidades generales usadas en el backend
│ │ └─ /seeds # Scripts para cargar datos iniciales en la base de datos
│ ├─ .env # Variables de entorno y configuraciones sensibles
│ ├─ server.js # Punto de entrada del backend
│ └─ package.json # Dependencias y scripts del backend
│
├─ /frontend
│ ├─ /public # Archivos públicos como imágenes, favicon y index.html
│ ├─ /src
│ │ ├─ /components # Componentes reutilizables (Botones, Menús, Tablas...)
│ │ ├─ /context # Contextos para estado global (UsuarioContext)
│ │ ├─ /data # Archivos de datos y configuraciones del frontend
│ │ ├─ /hooks # Hooks personalizados (ej: useProductoBySKU)
│ │ ├─ /paginas # Vistas principales (Home, Login, VerProductos, FichaProducto...)
│ │ ├─ /theme # Estilos personalizados y temas de Chakra UI
│ │ ├─ App.jsx # Componente principal de la aplicación
│ │ └─ main.jsx # Punto de entrada de React
│ └─ package.json # Dependencias y scripts del frontend
│
└─ .gitignore # Archivos y carpetas ignoradas por Git
└─ index.html # Archivo HTML principal del frontend
└─ README.md # Documentación del proyecto



> Esta estructura permite mantener el frontend y backend separados, con carpetas claras para componentes, hooks, modelos, rutas y controladores, facilitando el desarrollo y mantenimiento del proyecto.


## Cómo Ejecutarlo Localmente

Sigue estos pasos para ejecutar Proyecto SGA en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto-SGA
```

### 2. Configurar el backend
Entrar a la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:
```bash
npm install
```

Crear un archivo .env en la raíz del backend con las variables necesarias, por ejemplo:
```bash
MONGO_URI=<tu_url_de_mongodb>
JWT_SECRET=<tu_clave_secreta>
PORT=5000
```

Ejecutar el servidor en modo desarrollo:
```bash
npm run dev
```

### 3. Configurar el frontend
Abrir otra terminal y entrar a la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:
```bash
npm install
```

Ejecutar la aplicación en modo desarrollo:
```bash
npm run dev
```

El frontend se ejecutará normalmente en http://localhost:5174.


### 4. Acceder a la aplicación
Abre tu navegador y ve a http://localhost:5174. La aplicación debería conectarse automáticamente al backend y estar lista para usar.

## Carga de datos iniciales (Seeds)

El proyecto incluye un sistema de **semillas** para cargar datos de prueba en la base de datos MongoDB de forma automática.

Existe un archivo centralizado que ejecuta **todas las semillas en el orden correcto**, creando familias, proveedores, productos, clientes, proyectos, pedidos, movimientos, usuarios, etc.

### Ubicación del archivo
backend/utils/seeds/lanzarSemillas.js

### Requisitos previos
- Tener MongoDB en funcionamiento (local o Mongo Atlas)
- Tener configurado correctamente el archivo `.env` en `/backend`

### Ejecutar todas las semillas
Desde la carpeta `backend`, ejecutar:

```bash
node utils/seeds/lanzarSemillas.js
```

Esto creará automáticamente todos los datos necesarios en la base de datos.

Advertencia:
Este proceso inserta datos en la base de datos. Se recomienda usarlo únicamente en entornos de desarrollo o pruebas.


---




























## Cómo Ejecutarlo Localmente

Sigue estos pasos para ejecutar Proyecto SGA en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto-SGA

