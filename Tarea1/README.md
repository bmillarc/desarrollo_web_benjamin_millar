# Tarea 1 - Sistema Basico de Comunidad y Actividades

## Descripcion
Implementacion de un sistema web basico para registrar miembros de la comunidad y las actividades que realizan fuera de sus obligaciones academicas y laborales.

La solucion incluye:
- Registro de miembros: estudiantes de pregrado, postgrado, funcionarios y academicos.
- Registro de actividades: tipo, dias, horario, descripcion, enlace propio y archivos multimedia.
- Listado de miembros con filtro por tipo, orden por nombre/contacto y paginacion.
- Pagina de estadisticas con indicadores estaticos de ejemplo.

## Estructura de carpetas
- html/: paginas del sistema.
- css/: estilos globales.
- js/: logica de validacion, almacenamiento y renderizado.

## Reglas implementadas
- Validacion de nombre y tipo de miembro.
- Validacion de correo electronico obligatorio.
- Validacion de contacto de miembro: usuario de Telegram o telefono (al menos uno obligatorio).
- Validacion de actividad con dia(s), hora de inicio/termino y descripcion.
- Validacion de archivos: minimo 1, maximo 5, solo imagen o video.
- Validacion de enlace: solo URL con http/https.

## Persistencia
No se almacena informacion ingresada por el usuario.
Este proyecto es un prototipo de interfaz, navegacion y validaciones.

## Como ejecutar
1. Abrir el archivo html/index.html en el navegador.
2. Probar formulario de miembros y validar mensajes.
3. Probar formulario de actividades y validar mensajes.
4. Revisar el listado de miembros de ejemplo.

## Notas
- Esta es una version basica.
- No incluye backend, autenticacion ni carga real de binarios al servidor.
- No utiliza servidor web ni base de datos.
- Listados sin filtros, ordenamiento y paginacion por decision de alcance para MVP.
