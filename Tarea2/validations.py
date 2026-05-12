import re
import mimetypes

MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024 * 1024  # 1GB por archivo
ALLOWED_MIME_TYPES = {
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/x-msvideo',
    'video/quicktime',
    'video/webm',
}

class ValidationError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

def sanitize_string(value):
    if not value:
        return ""
    return " ".join(value.strip().split())

def validate_name(name):
    #4-80 caracteres
    if not name:
        return False
    name = name.strip()
    if len(name) < 4 or len(name) > 80:
        return False
    # Allow letters, numbers, spaces, hyphens, and accents
    return bool(re.match(r'^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s\-0-9]{4,80}$', name))

def validate_email(email):
    #validar forma email
    if not email:
        return False
    email = email.strip()
    if len(email) < 6 or len(email) > 100:
        return False
    pattern = r'^[\w\.-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone):
    #es opcional junto con telegram pero se revisa numero valido
    if not phone or phone.strip() == "":
        return True  # Phone is optional
    phone = phone.strip()
    pattern = r'^\+?\d[\d\s\-()]{7,14}$'
    return bool(re.match(pattern, phone))

def validate_telegram(telegram_user):
    # Usuario debe ingresar con "@" incluido: @usuario (5-32 caracteres después del @)
    if not telegram_user or telegram_user.strip() == "":
        return True  # Telegram es opcional (si se proporciona teléfono)
    user = telegram_user.strip()
    # Debe comenzar con "@"
    if not user.startswith('@'):
        return False
    # Validar formato: @usuario (5-32 caracteres después del @)
    pattern = r'^@[a-zA-Z0-9_]{5,32}$'
    return bool(re.match(pattern, user))

def validate_extra_field(value):
    #2-80 caracteres
    if not value:
        return False
    value = value.strip()
    if len(value) < 2 or len(value) > 80:
        return False
    return bool(re.match(r'^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s\-0-9]{2,80}$', value))

def validate_activity_title(title):
    #3-80 caracteres
    if not title:
        return False
    title = title.strip()
    if len(title) < 3 or len(title) > 80:
        return False
    return bool(re.match(r'^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s\-0-9]{3,80}$', title))

def validate_activity_description(description):
    #8-300 caracteres
    if not description:
        return False
    description = description.strip()
    if len(description) < 8 or len(description) > 300:
        return False
    return bool(re.match(r'^[\w\s\.,¿?¡!áéíóúñÁÉÍÓÚÑ\-]{8,300}$', description))

def validate_url(url):
    #q empiece con http o https y tenga formato valido
    if not url:
        return False
    url = url.strip()
    try:
        pattern = r'^https?://[a-zA-Z0-9\-._~:/?#\[\]@!$&\'()*+,;=]{5,500}$'
        if not re.match(pattern, url):
            return False
        # Additional check - must have a valid domain
        return url.startswith('http://') or url.startswith('https://')
    except:
        return False

def validate_time_format(time_str):
    
    if not time_str:
        return False
    pattern = r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
    return bool(re.match(pattern, time_str))

def validate_days(days):
    #validar dias aunque se obligue a seleccionar estos
    valid_days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
    if not days or len(days) == 0:
        return False
    return all(day.lower() in valid_days for day in days)

def validate_file_extension(filename):
    #chekear extension
    allowed_extensions = {'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov', 'webm'}
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in allowed_extensions

def validate_file_mime(file_storage):
    # validar MIME declarado por el cliente y fallback por extensión
    mime_type = (file_storage.mimetype or '').lower()
    if mime_type in ALLOWED_MIME_TYPES:
        return True

    guessed_mime, _ = mimetypes.guess_type(file_storage.filename or '')
    return (guessed_mime or '').lower() in ALLOWED_MIME_TYPES

def get_file_size(file_storage):
    # obtener tamaño real sin consumir el stream
    if getattr(file_storage, 'content_length', None):
        return file_storage.content_length

    try:
        current_pos = file_storage.stream.tell()
        file_storage.stream.seek(0, 2)
        size = file_storage.stream.tell()
        file_storage.stream.seek(current_pos)
        return size
    except Exception:
        return None

def validate_member_data(data):
    #Validacion COmpleta
    errors = []
    
    
    if not data.get('fullName'):
        errors.append("Nombre completo es requerido")
    elif not validate_name(data['fullName']):
        errors.append("Nombre completo debe tener entre 4 y 80 caracteres")
    
    
    valid_types = ["Estudiante de pregrado", "Estudiante de postgrado", "Funcionario", "Académico"]
    if not data.get('memberType'):
        errors.append("Tipo de miembro es requerido")
    elif data['memberType'] not in valid_types:
        errors.append("Tipo de miembro inválido")
    
    
    if not data.get('email'):
        errors.append("Correo electrónico es requerido")
    elif not validate_email(data['email']):
        errors.append("Correo electrónico inválido")
    
    
    phone = data.get('phone', '').strip()
    telegram = data.get('telegramUser', '').strip()
    
    if phone and not validate_phone(phone):
        errors.append("Formato de teléfono inválido")
    
    if telegram and not validate_telegram(telegram):
        errors.append("Usuario Telegram debe comenzar con @ y tener entre 5 y 32 caracteres (ejemplo: @miusuario)")
    
    if not phone and not telegram:
        errors.append("Debes proporcionar al menos un dato de contacto (teléfono o Telegram)")
    
    
    if not data.get('extraData'):
        errors.append("Dato adicional es requerido")
    elif not validate_extra_field(data['extraData']):
        errors.append("Dato adicional debe tener entre 2 y 80 caracteres")
    
    
    if not data.get('comunaId'):
        errors.append("Comuna es requerida")
    
    return errors

def validate_activity_data(data, files):
    #validacion completa de actividad
    errors = []
    
    
    if not data.get('memberId'):
        errors.append("Miembro asociado es requerido")
    
    
    if not data.get('activityTitle'):
        errors.append("Título de la actividad es requerido")
    elif not validate_activity_title(data['activityTitle']):
        errors.append("Título debe tener entre 3 y 80 caracteres")
    
    
    valid_types = ["Artística", "Deportiva", "Tecnológica", "Social", "Recreativa", "Otra"]
    if not data.get('activityType'):
        errors.append("Tipo de actividad es requerido")
    elif data['activityType'] not in valid_types:
        errors.append("Tipo de actividad inválido")
    
    
    days = data.get('days', [])
    if isinstance(days, str):
        days = [days]
    if not days or len(days) == 0:
        errors.append("Debes seleccionar al menos un día")
    
    
    if not data.get('startTime'):
        errors.append("Hora de inicio es requerida")
    elif not validate_time_format(data['startTime']):
        errors.append("Formato de hora de inicio inválido")
    
    
    if not data.get('endTime'):
        errors.append("Hora de término es requerida")
    elif not validate_time_format(data['endTime']):
        errors.append("Formato de hora de término inválido")
    
    
    if data.get('startTime') and data.get('endTime'):
        if data['endTime'] <= data['startTime']:
            errors.append("Hora de término debe ser mayor que hora de inicio")
    
   
    if not data.get('description'):
        errors.append("Descripción es requerida")
    elif not validate_activity_description(data['description']):
        errors.append("Descripción debe tener entre 8 y 300 caracteres")
    
    
    if not data.get('contentLink'):
        errors.append("Enlace a contenido es requerido")
    elif not validate_url(data['contentLink']):
        errors.append("Enlace debe ser una URL válida (http o https)")
    
    
    if not files or len(files) == 0:
        errors.append("Debes adjuntar al menos 1 archivo")
    elif len(files) > 5:
        errors.append("Máximo 5 archivos permitidos")
    else:
        for file in files:
            if not file.filename:
                errors.append("Uno de los archivos no tiene nombre")
            elif not validate_file_extension(file.filename):
                errors.append(f"Tipo de archivo no permitido: {file.filename}")
            elif not validate_file_mime(file):
                errors.append(f"MIME type no permitido: {file.filename} ({file.mimetype})")
            else:
                file_size = get_file_size(file)
                if file_size is not None and file_size > MAX_FILE_SIZE_BYTES:
                    errors.append(f"Archivo excede 1GB: {file.filename}")
    
    return errors
