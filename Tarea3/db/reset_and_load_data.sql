-- Reset y carga de datos de prueba para Tarea2
-- Este script borra y recarga miembros, actividades y fotos

USE tarea2;

-- ========================================
-- 1. RESET DE TABLAS (borrar datos existentes)
-- ========================================

-- Deshabilitar restricciones de clave foránea temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate (más rápido que DELETE)
TRUNCATE TABLE foto;
TRUNCATE TABLE actividad;
TRUNCATE TABLE miembro;
TRUNCATE TABLE comentario;

-- Re-habilitar restricciones de clave foránea
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- 2. INSERTAR MIEMBROS DE EJEMPLO
-- ========================================

INSERT INTO miembro (nombre, email, telefono, telegram_user, tipo, dato_adicional, fecha_registro, comuna_id) VALUES
('Juan Carlos Silva Peña', 'juan.silva@example.com', '+569 98765432', '@juansilva', 'Estudiante de pregrado', 'Ingeniería en Computación', '2025-03-14 10:30:00', 130208),
('María García López', 'maria.garcia@example.com', '+569 87654321', '@mariagarcia', 'Estudiante de postgrado', 'Magíster en Data Science', '2025-06-22 14:15:00', 50503),
('Carlos Rodríguez Pérez', 'carlos.rodriguez@example.com', '+569 76543210', '@carlosrodriguez', 'Funcionario', 'Dirección de Informática', '2025-10-06 10:00:00', 130210),
('Paula Vera Contreras', 'paula.vera@example.com', '+569 65432109', '@paulavera', 'Académico', 'Facultad de Ingeniería', '2025-11-05 09:15:00', 80205),
('Sergio Mena Díaz', 'sergio.mena@example.com', '+569 54321098', '@sergiomena', 'Estudiante de pregrado', 'Ingeniería Civil', '2026-01-20 16:30:00', 130209),
('Daniela Pino Soto', 'daniela.pino@example.com', '+569 43210987', '@danielapino', 'Estudiante de postgrado', 'MBA Empresarial', '2026-02-15 14:20:00', 10304),
('Nicolás Araya Flores', 'nicolas.araya@example.com', '+569 32109876', '@nicolasaraya', 'Funcionario', 'Tecnología y Sistemas', '2026-03-05 13:10:00', 20303),
('María Baeza Ramírez', 'maria.baeza@example.com', '+569 21098765', '@mariabaeza', 'Académico', 'Departamento de Matemáticas', '2026-04-10 08:30:00', 130207),
('Álvaro Díaz Morales', 'alvaro.diaz@example.com', '+569 10987654', '@alvarodiaz', 'Estudiante de pregrado', 'Licenciatura en Física', '2026-05-18 15:50:00', 50506),
('Beatriz Campos Ruiz', 'beatriz.campos@example.com', '+569 09876543', '@beatrizcampos', 'Estudiante de postgrado', 'Doctorado en Biología', '2026-06-01 12:00:00', 130214);

-- ========================================
-- 3. INSERTAR ACTIVIDADES DE EJEMPLO
-- ========================================

INSERT INTO actividad (miembro_id, dia, hora_inicio, duracion, tipo, nombre, descripcion, enlace) VALUES
(1, 'Lunes, Miércoles, Viernes', '14:00', '02:00', 'Tecnológica', 'Taller de Programación Python', 'Aprenderemos conceptos fundamentales de Python con enfoque práctico. Cubriremos estructuras de datos, funciones y módulos.', 'https://github.com/ejemplo/python-taller'),
(1, 'Martes, Jueves', '16:00', '01:30', 'Social', 'Reunión de Networking Tech', 'Encuentro con profesionales de tecnología para intercambiar experiencias y conocer oportunidades laborales.', 'https://meetup.example.com/tech-networking'),
(2, 'Miércoles', '15:00', '03:00', 'Tecnológica', 'Seminario Data Science Avanzado', 'Técnicas avanzadas de machine learning con aplicaciones reales en diferentes industrias.', 'https://course.example.com/data-science-advanced'),
(3, 'Lunes, Miércoles', '09:00', '02:30', 'Recreativa', 'Fútbol de Tarde', 'Práctica de fútbol recreativo para empleados. Todos los niveles bienvenidos.', 'https://sportweb.example.com/futbol'),
(4, 'Viernes', '12:00', '02:00', 'Social', 'Charla Académica: AI en Educación', 'Conversatorio sobre aplicaciones de inteligencia artificial en procesos educativos modernos.', 'https://eventos.example.com/ai-education'),
(5, 'Martes, Jueves, Sábado', '18:00', '01:30', 'Artística', 'Taller de Fotografía Digital', 'Aprenderemos técnicas de fotografía digital, composición y edición con software profesional.', 'https://fotografia.example.com/taller-digital'),
(6, 'Lunes, Viernes', '17:00', '02:00', 'Deportiva', 'Clase de Yoga y Meditación', 'Sesiones guiadas de yoga y técnicas de meditación para bienestar y relajación.', 'https://yoga.example.com/clases'),
(7, 'Miércoles', '10:00', '02:30', 'Tecnológica', 'Workshop de Desarrollo Web Fullstack', 'Desarrollo completo de aplicación web con frontend y backend. Prácticas con tecnologías modernas.', 'https://fullstack.example.com/workshop'),
(8, 'Jueves', '14:00', '01:45', 'Recreativa', 'Cine Club - Películas de Ciencia Ficción', 'Visionado y debate de películas clásicas y modernas de ciencia ficción.', 'https://cineclube.example.com/scifi'),
(9, 'Lunes, Miércoles, Viernes', '11:00', '01:30', 'Deportiva', 'Entrenamiento de Atletismo', 'Preparación física para carreras de 5K y 10K con entrenador certificado.', 'https://atletismo.example.com/training'),
(10, 'Martes, Jueves', '13:00', '02:00', 'Artística', 'Taller de Pintura Acrílica', 'Introducción a técnicas de pintura acrílica con énfasis en creatividad y expresión personal.', 'https://artes.example.com/pintura-acrilica'),
(2, 'Sábado, Domingo', '19:00', '02:30', 'Social', 'Encuentro de Emprendedores', 'Red de contactos para emprendedores y empresarios. Compartir experiencias y proyectos.', 'https://network.example.com/entrepreneurs');

-- ========================================
-- 4. VERIFICACIÓN
-- ========================================

SELECT 'miembro' AS tabla, COUNT(*) AS total FROM miembro
UNION ALL
SELECT 'actividad' AS tabla, COUNT(*) AS total FROM actividad
UNION ALL
SELECT 'foto' AS tabla, COUNT(*) AS total FROM foto
UNION ALL
SELECT 'comentario' AS tabla, COUNT(*) AS total FROM comentario;

-- ========================================
-- FIN DEL SCRIPT
-- ========================================