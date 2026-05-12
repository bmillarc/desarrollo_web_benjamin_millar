#!/usr/bin/env python3


from app import app, db
from config import Config
import pymysql
import sys

def sync_database_schema():
    #se crea conexion y se ve si faltan columnas para crear
    try:
        connection = pymysql.connect(
            host='localhost',
            port=3306,
            user='cc5002',
            password='programacionweb',
            database='tarea2',
            charset='utf8mb4',
        )

        cursor = connection.cursor()

        checks = [
            ("miembro", "tipo", "ALTER TABLE miembro ADD COLUMN tipo VARCHAR(50) NOT NULL DEFAULT '' AFTER comuna_id"),
            ("miembro", "dato_adicional", "ALTER TABLE miembro ADD COLUMN dato_adicional VARCHAR(80) NOT NULL DEFAULT '' AFTER tipo"),
            ("miembro", "telegram_user", "ALTER TABLE miembro ADD COLUMN telegram_user VARCHAR(50) NULL AFTER dato_adicional"),
            ("actividad", "enlace", "ALTER TABLE actividad ADD COLUMN enlace VARCHAR(500) NULL AFTER descripcion"),
        ]

        for table_name, column_name, statement in checks:
            cursor.execute(
                """
                SELECT COUNT(*)
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s
                """,
                ('tarea2', table_name, column_name),
            )
            exists = cursor.fetchone()[0] > 0
            if not exists:
                cursor.execute(statement)
                connection.commit()

        cursor.execute("ALTER TABLE actividad MODIFY COLUMN dia VARCHAR(120) NOT NULL")
        cursor.execute("ALTER TABLE actividad MODIFY COLUMN tipo VARCHAR(30) NOT NULL")
        connection.commit()

        cursor.close()
        connection.close()

        with app.app_context():
            db.create_all()
            print("✓ Database schema synchronized successfully")
    except Exception as e:
        print(f"✗ Error synchronizing database schema: {e}")
        sys.exit(1)

if __name__ == '__main__':
    
    sync_database_schema()
    
    # Run the application
    print("\n" + "=" * 60)
    print("Iniciando aplicación Flask")
    print("=" * 60)
    print("Servidor disponible en: http://localhost:5000")
    print("Para detener: Presiona Ctrl+C")
    print("=" * 60 + "\n")
    
    app.run(debug=True, host='localhost', port=5000)
