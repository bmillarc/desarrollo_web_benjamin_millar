#!/usr/bin/env python3
"""
Script para inicializar la base de datos de Tarea2
Este script ejecuta los archivos SQL para crear la estructura de la BD
y cargar los datos de regiones y comunas.
"""

import os
import sys
import pymysql
from config import Config

def get_sql_file_path(filename):
    """Get the absolute path to a SQL file"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, 'db', filename)

def read_sql_file(filename):
    """Read SQL file and return content"""
    filepath = get_sql_file_path(filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"SQL file not found: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def execute_sql_statements(connection, sql_content):
    """Execute multiple SQL statements from a string"""
    cursor = connection.cursor()
    
    # Split by semicolon and filter empty statements
    statements = [s.strip() for s in sql_content.split(';') if s.strip()]
    
    for statement in statements:
        if statement:
            try:
                print(f"Executing: {statement[:80]}...")
                cursor.execute(statement)
                connection.commit()
            except Exception as e:
                print(f"Error executing statement: {e}")
                connection.rollback()
                raise
    
    cursor.close()

    def column_exists(connection, schema_name, table_name, column_name):
        """Check whether a column exists in the current database."""
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = %s
              AND TABLE_NAME = %s
              AND COLUMN_NAME = %s
            """,
            (schema_name, table_name, column_name),
        )
        total = cursor.fetchone()["total"]
        cursor.close()
        return total > 0

    def ensure_schema_columns(connection, schema_name):
        """Add columns expected by the Flask ORM if they are missing."""
        cursor = connection.cursor()

        statements = []
        if not column_exists(connection, schema_name, "miembro", "tipo"):
            statements.append("ALTER TABLE miembro ADD COLUMN tipo VARCHAR(50) NOT NULL DEFAULT '' AFTER comuna_id")
        if not column_exists(connection, schema_name, "miembro", "dato_adicional"):
            statements.append("ALTER TABLE miembro ADD COLUMN dato_adicional VARCHAR(80) NOT NULL DEFAULT '' AFTER tipo")
        if not column_exists(connection, schema_name, "miembro", "telegram_user"):
            statements.append("ALTER TABLE miembro ADD COLUMN telegram_user VARCHAR(50) NULL AFTER dato_adicional")
        if not column_exists(connection, schema_name, "actividad", "enlace"):
            statements.append("ALTER TABLE actividad ADD COLUMN enlace VARCHAR(500) NULL AFTER descripcion")

        statements.extend([
            "ALTER TABLE actividad MODIFY COLUMN dia VARCHAR(120) NOT NULL",
            "ALTER TABLE actividad MODIFY COLUMN tipo VARCHAR(30) NOT NULL",
        ])

        for statement in statements:
            print(f"Executing migration: {statement}")
            cursor.execute(statement)
            connection.commit()

        cursor.close()

def initialize_database():
    """Initialize database with schema and data"""
    print("=" * 60)
    print("Inicializando base de datos Tarea2")
    print("=" * 60)
    
    # Parse database URI
    uri = Config.SQLALCHEMY_DATABASE_URI
    # Format: mysql+pymysql://user:password@host:port/dbname
    parts = uri.replace('mysql+pymysql://', '').split('@')
    user_pass = parts[0].split(':')
    host_port = parts[1].split(':')
    
    db_user = user_pass[0]
    db_password = user_pass[1]
    db_host = host_port[0]
    db_port = int(host_port[1].split('/')[0])
    db_name = host_port[1].split('/')[1]
    
    print(f"\nConectando a MySQL:")
    print(f"  Host: {db_host}")
    print(f"  Puerto: {db_port}")
    print(f"  Usuario: {db_user}")
    print(f"  Base de datos: {db_name}")
    print()
    
    try:
        # Connect to MySQL server (without database first)
        connection = pymysql.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        # Create schema and tables
        print("1. Creando esquema y tablas...")
        sql_content = read_sql_file('tarea2.sql')
        execute_sql_statements(connection, sql_content)
        print("   ✓ Esquema y tablas creadas exitosamente")
        
        # Close and reconnect to the new database
        connection.close()
        
        connection = pymysql.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        # Load regions and communes
        print("\n2. Cargando regiones y comunas...")
        sql_content = read_sql_file('region-comuna.sql')
        execute_sql_statements(connection, sql_content)
        print("   ✓ Regiones y comunas cargadas exitosamente")

        print("\n3. Verificando columnas requeridas por la app...")
        ensure_schema_columns(connection, db_name)
        print("   ✓ Esquema alineado con la aplicación")
        
        connection.close()
        
        print("\n" + "=" * 60)
        print("✓ Base de datos inicializada exitosamente")
        print("=" * 60)
        print("\nPuedes iniciar la aplicación con: python app.py")
        
    except pymysql.Error as e:
        print(f"\n✗ Error en MySQL: {e}")
        sys.exit(1)
    except FileNotFoundError as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Error inesperado: {e}")
        sys.exit(1)

if __name__ == '__main__':
    initialize_database()
