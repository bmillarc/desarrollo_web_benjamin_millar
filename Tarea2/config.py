import os

class Config:
    
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    
    UPLOAD_FOLDER = 'static/uploads'
    MAX_CONTENT_LENGTH = 1 * 1024 * 1024 * 1024  # 1GB max request size
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov', 'webm'}
    
    
    ITEMS_PER_PAGE = 5
    
    
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
