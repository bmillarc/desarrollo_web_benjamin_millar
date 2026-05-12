from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Region(db.Model):
    __tablename__ = 'region'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    
    comunas = db.relationship('Comuna', backref='region', lazy=True)

class Comuna(db.Model):
    __tablename__ = 'comuna'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

class Miembro(db.Model):
    __tablename__ = 'miembro'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False, default=datetime.now)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # Estudiante de pregrado, postgrado, etc
    dato_adicional = db.Column(db.String(80), nullable=False)  # Carrera, programa, etc
    telegram_user = db.Column(db.String(50), nullable=True)
    
    comuna = db.relationship('Comuna', backref='miembros')
    actividades = db.relationship('Actividad', backref='miembro', lazy=True, cascade='all, delete-orphan')

class Actividad(db.Model):
    __tablename__ = 'actividad'
    
    id = db.Column(db.Integer, primary_key=True)
    miembro_id = db.Column(db.Integer, db.ForeignKey('miembro.id'), nullable=False)
    dia = db.Column(db.String(120), nullable=False)  # puede almacenar varios días separados por coma
    hora_inicio = db.Column(db.String(5), nullable=False)
    duracion = db.Column(db.String(5), nullable=False)  # Se calcula como diferencia de horas
    tipo = db.Column(db.String(30), nullable=False)  # Social, Tecnológica, etc.
    nombre = db.Column(db.String(80), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    enlace = db.Column(db.String(500), nullable=True)
    
    fotos = db.relationship('Foto', backref='actividad', lazy=True, cascade='all, delete-orphan')

class Foto(db.Model):
    __tablename__ = 'foto'
    
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)
