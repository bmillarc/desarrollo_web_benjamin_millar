from sqlalchemy import func
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from db.models import db, Miembro, Actividad, Foto, Comuna, Region, Comentario
from validations import (
    validate_member_data, validate_activity_data,
    sanitize_string, validate_time_format, validate_comment_data
)
from db.config import Config
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import uuid
from math import ceil

app = Flask(__name__)
app.config.from_object(Config)


db.init_app(app)


os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in app.config['ALLOWED_EXTENSIONS']

def get_communes():
    
    regions = Region.query.all()
    communes_by_region = {}
    for region in regions:
        communes_by_region[region.nombre] = [
            {'id': c.id, 'nombre': c.nombre} for c in region.comunas
        ]
    return communes_by_region

def get_members_by_region():
    """Get all members for activity form"""
    return Miembro.query.all()

@app.route('/')
def index():
    
    total_members = db.session.query(Miembro).count()
    total_activities = db.session.query(Actividad).count()
    total_photos = db.session.query(Foto).count()
    
    return render_template('index.html',
                         total_members=total_members,
                         total_activities=total_activities,
                         total_photos=total_photos)

@app.route('/register-member', methods=['GET', 'POST'])
def register_member():
    
    if request.method == 'POST':
        try:
            
            full_name = request.form.get('fullName', '').strip()
            member_type = request.form.get('memberType', '').strip()
            email = request.form.get('email', '').strip()
            phone = request.form.get('phone', '').strip()
            telegram = request.form.get('telegramUser', '').strip()
            extra_data = request.form.get('extraData', '').strip()
            comuna_id = request.form.get('comunaId', '').strip()
            
            
            data = {
                'fullName': full_name,
                'memberType': member_type,
                'email': email,
                'phone': phone,
                'telegramUser': telegram,
                'extraData': extra_data,
                'comunaId': comuna_id
            }
            
            
            errors = validate_member_data(data)
            
            if errors:
                communes = get_communes()
                return render_template('register-member.html',
                                     errors=errors,
                                     form_data=data,
                                     communes=communes)
            
            
            miembro = Miembro(
                nombre=sanitize_string(full_name),
                email=sanitize_string(email),
                telefono=sanitize_string(phone),
                telegram_user=sanitize_string(telegram),
                tipo=sanitize_string(member_type),
                dato_adicional=sanitize_string(extra_data),
                comuna_id=int(comuna_id),
                fecha_registro=datetime.now()
            )
            
            db.session.add(miembro)
            db.session.commit()
            
            return render_template('success.html',
                                 message='¡Miembro registrado exitosamente!',
                                 redirect_url=url_for('index'))
        
        except Exception as e:
            db.session.rollback()
            communes = get_communes()
            return render_template('register-member.html',
                                 errors=[f'Error al registrar: {str(e)}'],
                                 communes=communes), 500
    
    
    communes = get_communes()
    return render_template('register-member.html', communes=communes)

@app.route('/register-activity', methods=['GET', 'POST'])
def register_activity():
    
    if request.method == 'POST':
        try:
            
            member_id = request.form.get('memberId', '').strip()
            activity_title = request.form.get('activityTitle', '').strip()
            activity_type = request.form.get('activityType', '').strip()
            days = request.form.getlist('days')
            start_time = request.form.get('startTime', '').strip()
            end_time = request.form.get('endTime', '').strip()
            description = request.form.get('description', '').strip()
            content_link = request.form.get('contentLink', '').strip()
            files = request.files.getlist('mediaFiles')
            
            
            data = {
                'memberId': member_id,
                'activityTitle': activity_title,
                'activityType': activity_type,
                'days': days,
                'startTime': start_time,
                'endTime': end_time,
                'description': description,
                'contentLink': content_link
            }
            
            
            errors = validate_activity_data(data, files)
            
            if errors:
                members = get_members_by_region()
                return render_template('register-activity.html',
                                     errors=errors,
                                     form_data=data,
                                     members=members)
            
            
            start_parts = start_time.split(':')
            end_parts = end_time.split(':')
            start_minutes = int(start_parts[0]) * 60 + int(start_parts[1])
            end_minutes = int(end_parts[0]) * 60 + int(end_parts[1])
            duration_minutes = end_minutes - start_minutes
            duration_hours = duration_minutes // 60
            duration_remaining = duration_minutes % 60
            duration_str = f"{duration_hours:02d}:{duration_remaining:02d}"
            
            
            actividad = Actividad(
                miembro_id=int(member_id),
                dia=', '.join(days),  
                hora_inicio=start_time,
                duracion=duration_str,
                tipo=sanitize_string(activity_type),
                nombre=sanitize_string(activity_title),
                descripcion=sanitize_string(description),
                enlace=sanitize_string(content_link)
            )
            
            db.session.add(actividad)
            db.session.flush()  
            
            
            for file in files:
                if file and allowed_file(file.filename):
                    
                    unique_name = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)
                    file.save(file_path)
                    
                   
                    foto = Foto(
                        ruta_archivo=file_path,
                        nombre_archivo=secure_filename(file.filename),
                        actividad_id=actividad.id
                    )
                    db.session.add(foto)
            
            db.session.commit()
            
            return render_template('success.html',
                                 message='¡Actividad registrada exitosamente!',
                                 redirect_url=url_for('index'))
        
        except Exception as e:
            db.session.rollback()
            members = get_members_by_region()
            return render_template('register-activity.html',
                                 errors=[f'Error al registrar: {str(e)}'],
                                 members=members), 500
    
    
    members = get_members_by_region()
    return render_template('register-activity.html', members=members)

@app.route('/list-members')
def list_members():
    
    page = request.args.get('page', 1, type=int)
    
    
    total_members = db.session.query(Miembro).count()
    total_pages = ceil(total_members / app.config['ITEMS_PER_PAGE'])
    
    
    if page < 1:
        page = 1
    elif page > total_pages and total_pages > 0:
        page = total_pages
    
    
    offset = (page - 1) * app.config['ITEMS_PER_PAGE']
    members = Miembro.query.offset(offset).limit(app.config['ITEMS_PER_PAGE']).all()
    
    return render_template('list-members.html',
                         members=members,
                         current_page=page,
                         total_pages=total_pages,
                         total_members=total_members)

@app.route('/member/<int:member_id>')
def member_detail(member_id):
    """Show member details with activities"""
    miembro = Miembro.query.get_or_404(member_id)
    actividades = Actividad.query.filter_by(miembro_id=member_id).all()
    
    return render_template('member-detail.html',
                         miembro=miembro,
                         actividades=actividades)

@app.route('/api/stats')
def api_stats():
    # 1. Gráfico de líneas: Miembros registrados por día
    # Agrupamos por la fecha de registro ignorando la hora
    members_by_day_query = db.session.query(
        func.date(Miembro.fecha_registro).label('fecha'),
        func.count(Miembro.id).label('cantidad')
    ).group_by(func.date(Miembro.fecha_registro)).order_by('fecha').all()
    
    # Formateamos como diccionario: {'2026-06-01': 5, ...}
    members_by_day = {str(row.fecha): row.cantidad for row in members_by_day_query}

    # 2. Gráfico de torta: Total de actividades por tipo
    activities_by_type_query = db.session.query(
        Actividad.tipo,
        func.count(Actividad.id).label('cantidad')
    ).group_by(Actividad.tipo).all()
    
    activities_by_type = {row.tipo: row.cantidad for row in activities_by_type_query}

    # 3. Gráfico de barras: Total de actividades registradas por comuna
    # Unimos Comuna -> Miembro -> Actividad para relacionar la actividad con la comuna del miembro
    activities_by_commune_query = db.session.query(
        Comuna.nombre,
        func.count(Actividad.id).label('cantidad')
    ).join(Miembro, Comuna.id == Miembro.comuna_id)\
     .join(Actividad, Miembro.id == Actividad.miembro_id)\
     .group_by(Comuna.nombre).all()

    activities_by_commune = {row.nombre: row.cantidad for row in activities_by_commune_query}

    # Devolvemos todos los datos juntos en formato JSON
    return jsonify({
        'members_by_day': members_by_day,
        'activities_by_type': activities_by_type,
        'activities_by_commune': activities_by_commune
    })

@app.route('/statistics')
def statistics():
    """Statistics page"""
    total_members = db.session.query(Miembro).count()
    total_activities = db.session.query(Actividad).count()
    total_photos = db.session.query(Foto).count()
    
    
    activity_types = db.session.query(Actividad.tipo).distinct().all()
    activities_by_type = {}
    for activity_type in activity_types:
        count = db.session.query(Actividad).filter_by(tipo=activity_type[0]).count()
        activities_by_type[activity_type[0]] = count
    
    
    member_types = db.session.query(Miembro.tipo).distinct().all()
    members_by_type = {}
    for member_type in member_types:
        count = db.session.query(Miembro).filter_by(tipo=member_type[0]).count()
        members_by_type[member_type[0]] = count
    
    return render_template('statistics.html',
                         total_members=total_members,
                         total_activities=total_activities,
                         total_photos=total_photos,
                         activities_by_type=activities_by_type,
                         members_by_type=members_by_type)

@app.route('/api/actividad/<int:actividad_id>/comentarios', methods=['GET'])
def get_comentarios(actividad_id):
    # Obtener los comentarios ordenados por fecha descendente
    comentarios = Comentario.query.filter_by(actividad_id=actividad_id).order_by(Comentario.fecha.desc()).all()
    
    resultado = []
    for c in comentarios:
        resultado.append({
            'nombre': c.nombre,
            'texto': c.texto,
            'fecha': c.fecha.strftime('%d/%m/%Y %H:%M')
        })
    return jsonify(resultado)

@app.route('/api/actividad/<int:actividad_id>/comentarios', methods=['POST'])
def add_comentario(actividad_id):
    data = request.get_json() # Recibir datos en formato JSON (enviados por fetch)
    errors = validate_comment_data(data)
    
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
        
    try:
        nuevo_comentario = Comentario(
            nombre=sanitize_string(data.get('nombre')),
            texto=sanitize_string(data.get('texto')),
            actividad_id=actividad_id,
            fecha=datetime.now()
        )
        db.session.add(nuevo_comentario)
        db.session.commit()
        
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'errors': ['Error interno al guardar el comentario.']}), 500

@app.errorhandler(404)
def not_found(error):
    return render_template('error.html', error='Página no encontrada'), 404

@app.errorhandler(500)
def server_error(error):
    db.session.rollback()
    return render_template('error.html', error='Error interno del servidor'), 500

@app.context_processor
def inject_config():
    
    return {
        'UPLOAD_FOLDER': app.config['UPLOAD_FOLDER'],
        'now': datetime.now()
    }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='localhost', port=5000)
