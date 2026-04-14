# Tarea 1

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
- js/: logica de validacion y renderizado.

## Reglas implementadas
- Validacion de nombre y tipo de miembro.
- Validacion de correo electronico obligatorio.
- Validacion de contacto de miembro: usuario de Telegram o telefono (al menos uno obligatorio).
- Validacion de actividad con dia(s), hora de inicio/termino y descripcion.
- Validacion de archivos: minimo 1, maximo 5, solo imagen o video.
- Validacion de enlace: solo URL con http/https.

## Algunas Decisiones Tomadas

- 4 Interfaces + portada para interactuar con el sitio
- Un solo css global.
- Pagina de estadisticas con graficos hechos html+css.

