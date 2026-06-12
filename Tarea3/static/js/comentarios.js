
document.addEventListener('DOMContentLoaded', function() {
  const listasComentarios = document.querySelectorAll('[id^="comentarios-lista-"]');
  listasComentarios.forEach(container => {
    
    const actividadId = container.id.split('-')[2];
    cargarComentarios(actividadId);
  });
});

// 2. Función asíncrona para obtener el listado (GET)
function cargarComentarios(actividadId) {
  const container = document.getElementById(`comentarios-lista-${actividadId}`);
  
  fetch(`/api/actividad/${actividadId}/comentarios`)
    .then(response => response.json())
    .then(data => {
      container.innerHTML = ''; 
      if (data.length === 0) {
        container.innerHTML = '<p style="color: var(--muted); font-size: 0.85rem;">No hay comentarios registrados.</p>';
        return;
      }
      
      data.forEach(c => {
        container.innerHTML += `
          <div style="background: var(--surface-soft); padding: 0.6rem 0.8rem; border-radius: 8px; margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.2rem;">
              <strong style="font-size: 0.95rem;">${escapeHTML(c.nombre)}</strong>
              <span style="font-size: 0.75rem; color: var(--muted);">${c.fecha}</span>
            </div>
            <p style="margin: 0; font-size: 0.9rem; word-break: break-word;">${escapeHTML(c.texto)}</p>
          </div>
        `;
      });
    })
    .catch(error => {
      container.innerHTML = '<p style="color: var(--danger); font-size: 0.85rem;">Error al cargar comentarios.</p>';
    });
}

// 3. Función asíncrona para enviar un comentario (POST)
function submitComentario(event, actividadId) {
  event.preventDefault(); // Evita que la página se recargue

  const nombreInput = document.getElementById(`nombre-${actividadId}`);
  const textoInput = document.getElementById(`texto-${actividadId}`);
  const erroresContainer = document.getElementById(`comentario-errores-${actividadId}`);
  
  const nombre = nombreInput.value.trim();
  const texto = textoInput.value.trim();
  
  // Validaciones lado del cliente
  const errores = [];
  if (nombre.length < 3 || nombre.length > 80) errores.push("El nombre debe tener entre 3 y 80 caracteres.");
  if (texto.length < 5) errores.push("El comentario debe tener al menos 5 caracteres.");

  if (errores.length > 0) {
    mostrarErrores(erroresContainer, errores);
    return;
  }

  // Solicitud AJAX al servidor con la API Fetch
  fetch(`/api/actividad/${actividadId}/comentarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: nombre, texto: texto })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      erroresContainer.style.display = 'none'; // Ocultar errores previos
      nombreInput.value = ''; // Limpiar campo
      textoInput.value = ''; // Limpiar campo
      cargarComentarios(actividadId); // Recargar la lista con el nuevo comentario
    } else {
      // Mantener visible el formulario y mostrar fallos del servidor
      mostrarErrores(erroresContainer, data.errors);
    }
  })
  .catch(error => {
    mostrarErrores(erroresContainer, ["Error de red al intentar enviar el comentario."]);
  });
}

// Función auxiliar para desplegar los errores
function mostrarErrores(container, errores) {
  container.innerHTML = errores.map(e => `<div>• ${e}</div>`).join('');
  container.style.display = 'block';
}

// Función auxiliar para escapar código malicioso antes de incrustar HTML
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag)
  );
}