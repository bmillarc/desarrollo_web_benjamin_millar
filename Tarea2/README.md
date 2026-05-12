# Tarea 2 - Sistema de Actividades de la Comunidad con Flask

## Descripción

Aplicación web desarrollada con Python Flask y SQLAlchemy para registrar miembros de la comunidad y las actividades que realizan. Incluye validación de datos en cliente y servidor, gestión de archivos multimedia y paginación.

## Características

- **Registro de miembros**: Formulario con validaciones JavaScript y Flask
- **Registro de actividades**: Múltiples actividades por miembro con archivos multimedia
- **Listado de miembros**: Tabla con paginación y búsqueda de detalles
- **Detalles del miembro**: Vista con todas las actividades asociadas
- **Estadísticas**: Dashboard con métricas del sistema
- **Seguridad**: Validación de entrada en servidor, protección contra inyecciones SQL
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

## Estructura del Proyecto

```
Tarea2/
├── app.py                    # Aplicación Flask principal
├── config.py                 # Configuración de la aplicación
├── models.py                 # Modelos SQLAlchemy
├── validations.py            # Validaciones de datos
├── init_db.py               # Script de inicialización de BD
├── run.py                   # Script para ejecutar la aplicación
├── requirements.txt         # Dependencias Python
├── db/
│   ├── tarea2.sql          # Esquema de la base de datos
│   └── region-comuna.sql   # Datos de regiones y comunas
├── static/
│   ├── css/
│   │   └── style.css       # Estilos CSS
│   ├── js/
│   │   └── validation.js   # Validaciones JavaScript
│   └── uploads/            # Archivos multimedia subidos
├── templates/
│   ├── base.html           # Template base
│   ├── index.html          # Página principal
│   ├── register-member.html    # Formulario registro miembros
│   ├── register-activity.html  # Formulario registro actividades
│   ├── list-members.html       # Listado de miembros
│   ├── member-detail.html      # Detalle del miembro
│   ├── statistics.html         # Estadísticas
│   ├── success.html            # Página de éxito
│   └── error.html              # Página de error
└── README.md               # Este archivo
```

## Credenciales de Base de Datos

- **Host**: localhost
- **Puerto**: 3306
- **Base de datos**: tarea2
- **Usuario**: cc5002
- **Contraseña**: programacionweb

## Rutas Disponibles

### Públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/register-member` | Formulario de registro de miembros |
| `/register-activity` | Formulario de registro de actividades |
| `/list-members` | Listado paginado de miembros |
| `/member/<id>` | Detalle de un miembro |
| `/statistics` | Estadísticas del sistema |

## Validaciones

### Validaciones en Cliente (JavaScript)

Se realizan en tiempo real:
- Nombre: 4-80 caracteres
- Email: Formato válido
- Teléfono/Telegram: Formatos válidos (al menos uno requerido)
- Dato adicional: 2-80 caracteres
- Actividad: Campos requeridos y formatos válidos
- Archivos: 1-5 archivos de imagen o video

### Validaciones en Servidor (Python/Flask)

Se ejecutan antes de guardar en BD:
- Validación completa de datos
- Sanitización de entrada (prevención de XSS)
- Validación de extensiones de archivo
- Protección contra inyecciones SQL (SQLAlchemy)

## Gestión de Archivos

Los archivos multimedia se almacenan en:
- Directorio: `static/uploads/`
- Nombres de archivo: UUID generado aleatoriamente
- Formatos permitidos: JPG, PNG, GIF, MP4, AVI, MOV, WEBM
- Tamaño máximo: 50MB

## Seguridad

- **Sanitización de entrada**: Todos los inputs se escapan con `markupsafe.escape`
- **Inyecciones SQL**: Protegidas por SQLAlchemy ORM
- **Validación de archivos**: Verificación de extensión y tipo MIME
- **CSRF**: Considera implementar tokens CSRF para producción
- **SQL Injection**: No vulnerable (SQLAlchemy parameterizado)
- **XSS**: Escaping de valores en templates

## Configuración para Producción

Para producción, modifica `config.py`:

```python
class Config:
    SECRET_KEY = 'usar-una-clave-segura-aleatoria'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://usuario:contraseña@host:puerto/db'
    DEBUG = False
```

Y usa un servidor WSGI como Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Solución de Problemas

### Error: "No module named 'flask'"

```bash
pip install -r requirements.txt
```

### Error: "Can't connect to MySQL server"

- Verifica que MySQL esté corriendo
- Comprueba las credenciales en `config.py`
- Asegúrate que el host sea correcto

### Error: "relation 'tarea2' does not exist"

```bash
python init_db.py
```

### Los archivos no se suben

- Verifica que la carpeta `static/uploads` exista y tenga permisos de escritura
- Comprueba el tamaño del archivo (máx. 50MB)
- Verifica el formato (solo imagen o video)

## Notas Importantes

1. **Primera ejecución**: Ejecuta `python init_db.py` antes de la primera ejecución
2. **Paginación**: Por defecto 10 elementos por página (configurable en `config.py`)
3. **Zona horaria**: Los registros se almacenan con timestamp UTC
4. **Validaciones**: Modificables en `validations.py` según necesidades

## Autor

Desarrollado como parte de la Tarea 2 de Desarrollo Web

## Licencia

Este proyecto es de uso educativo.
