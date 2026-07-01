# Tarea 4 - Buscador y Evaluador de Actividades

Este proyecto implementa un buscador de actividades asíncrono y un sistema de evaluación de notas utilizando Spring Boot, JPA, Thymeleaf y JavaScript puro (`fetch`).

## Decisiones de Diseño e Implementación

Durante el desarrollo de esta solución, se tomaron las siguientes decisiones fundamentales:

* **Arquitectura basada en el Auxiliar 10:** Gran parte de la estructura del código, incluyendo la configuración de los modelos, los repositorios JPA, y la lógica de los Controladores REST, se basó directamente en lo enseñado en el Auxiliar 10. Esto aseguró una integración correcta y probada entre el backend y el frontend.
* **Simplificación de la interfaz gráfica:** Se decidió reiniciar toda la estructura visual de la página hacia un diseño minimalista y directo. 
* **Enfoque estricto en los requerimientos (por honor al tiempo):** Debido a limitaciones de tiempo, el desarrollo se centró exclusivamente en cumplir con lo solicitado en el enunciado. La vista final contiene únicamente el input de búsqueda (que reacciona al tercer carácter), el despliegue de la información requerida con el texto destacado, el cálculo de la nota promedio y el selector asíncrono para evaluar la actividad con números enteros del 1 al 7. Se omitieron estilos complejos o funcionalidades extra que no formaran parte de la evaluación.
* **Funcion de resaltado:** Se trabajo en una funcion para resaltar que lograse saltarse tildes para que funcionase a la par del buscador. 
## Tecnologías Utilizadas
* **Backend:** Java 25, Spring Boot 3.5.15, Spring Data JPA.
* **Frontend:** HTML, JavaScript (Fetch API), Thymeleaf.
* **Base de Datos:** MySQL (Esquema `tarea2`).