# Tarea 2 - Sistema de Actividades de la Comunidad con Flask

## Descripción

Aplicación web desarrollada con Python Flask y SQLAlchemy para registrar miembros de la comunidad y las actividades que realizan. Incluye validación de datos en cliente y servidor, gestión de archivos multimedia y paginación.

## Características

- **Registro de miembros**: Formulario con validaciones JavaScript y Flask
- **Registro de actividades**: Múltiples actividades por miembro con archivos multimedia
- **Listado de miembros**: Tabla con paginación y búsqueda de detalles
- **Detalles del miembro**: Vista con todas las actividades asociadas
- **Estadísticas**: Dashboard con métricas del sistema
- **Base de datos**: MySQL con relaciones entre tablas

## Requisitos

- Python 3.8+
- MySQL Server 5.7+
- pip (Python Package Manager)

## Instalación

### 1. Clonar o descargar el proyecto

```bash
cd /home/bmillar/Desktop/appswebs/desarrollo_web_benjamin_millar/Tarea2
```

### 2. Crear un entorno virtual (opcional pero recomendado)

```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Inicializar la base de datos

Antes de ejecutar el script de inicialización, asegúrate de que:
- MySQL server esté corriendo
- Las credenciales sean correctas (por defecto: cc5002:programacionweb)

```bash
python init_db.py
```

Este script:
- Crea la base de datos `tarea2`
- Crea todas las tablas (region, comuna, miembro, actividad, foto)
- Carga los datos de regiones y comunas desde `region-comuna.sql`

### 5. Ejecutar la aplicación

```bash
python run.py
```

La aplicación estará disponible en: **http://localhost:5000**



## Credenciales de Base de Datos

- **Host**: localhost
- **Puerto**: 3306
- **Base de datos**: tarea2
- **Usuario**: cc5002
- **Contraseña**: programacionweb

## Rutas Disponibles



| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/register-member` | Formulario de registro de miembros |
| `/register-activity` | Formulario de registro de actividades |
| `/list-members` | Listado paginado de miembros |
| `/member/<id>` | Detalle de un miembro |
| `/statistics` | Estadísticas del sistema |

## Decisiones de diseño

- La pagina statistics se añadio con formato jinja, se perdieron las barritas sin embargo es similar a la de la tarea1
- Se probo la tarea en Debian 13 y se uso MariaDB, deberia de igual forma funcionar con MySQL.
- Se crearon templates para que se muestren en varias pags como los de errores y succes junto con el base. 
- En el template para registrar actividades me dice que hay un error sin embargo todo funciona correctamente
- Para ver los errores de html hice ctrl+u en cada una de las paginas para ver el html resultante y no me lanzo errores.