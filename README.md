## ArtBlock - Backend
El presente repositorio alberga el núcleo lógico y servidor de ArtBlock. Es una sólida API REST, responsable de la gestión de usuarios, salvaguardado de obras por medio de autenticación y conexión con servicios de almacenamiento en la nube.

## Tecnologías y Herramientas
Entorno de Ejecución: Node.js
Framework Web: Express.js
Lenguaje: TypeScript (Tipado fuerte para mayor calidad técnica)
ORM: Prisma (Gestión eficiente de modelos y migraciones)
Base de Datos: PostgreSQL
Seguridad: JSON Web Tokens (JWT) para sesiones y BCrypt para el hasheo de credenciales

## Integración con API Externa (Cloudinary)
Para cumplir con los estándares de rendimiento y escalabilidad, el sistema se integra con la API de Cloudinary.

Flujo: Las imágenes se reciben en el backend como un flujo de datos (stream) y se envían directamente a los servidores de Cloudinary.
Resultado: Solo se almacena la URL segura y el ID de referencia en la base de datos PostgreSQL, optimizando el almacenamiento local.

## Equipo
Escobar Nuricumbo Heber Alexander-243691
Cuc López Axel Rodrigo-243702
Santillan Montesinos Eduardo-243747

## Docente: Viviana López Rojo