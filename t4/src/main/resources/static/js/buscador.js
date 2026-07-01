const inputSearch = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");
const searchMessage = document.getElementById("searchMessage");

// Función para resaltar el texto buscado
const highlightText = (originalText, term) => {
    if (!originalText || !term) return originalText || "";
    
    // 1. Normalizamos a NFC para unificar caracteres (junta la "o" y la "´" en un solo carácter "ó")
    const text = originalText.normalize("NFC");
    const termNfc = term.normalize("NFC");
    
    // 2. Función que limpia los tildes y pasa a minúsculas exclusivamente para la búsqueda
    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };
    
    const cleanText = removeAccents(text);
    const cleanTerm = removeAccents(termNfc);
    
    // 3. Recorremos el texto usando los índices exactos para no perder las mayúsculas ni tildes originales
    let result = "";
    let startIndex = 0;
    let index = cleanText.indexOf(cleanTerm);
    
    while (index !== -1) {
        // Agregamos lo que está antes de la coincidencia
        result += text.substring(startIndex, index);
        // Envolvemos la coincidencia exacta en <mark>
        result += `<mark>${text.substring(index, index + termNfc.length)}</mark>`;
        
        // Avanzamos el cursor para buscar si hay más coincidencias en el mismo texto
        startIndex = index + termNfc.length;
        index = cleanText.indexOf(cleanTerm, startIndex);
    }
    
    // Agregamos el resto del texto
    result += text.substring(startIndex);
    return result;
};

// Función asíncrona para evaluar la actividad
window.evaluarActividad = (id) => {
    const selectorNota = document.getElementById(`selector-nota-${id}`);
    const valorNota = parseInt(selectorNota.value);

    // Validación extra en frontend
    if (isNaN(valorNota) || valorNota < 1 || valorNota > 7) {
        alert("Por favor, selecciona una nota válida entre 1 y 7.");
        return;
    }

    // Llamada Fetch de forma asíncrona
    fetch(`/api/actividades/${id}/evaluar?valor=${valorNota}`, {
        method: "POST"
    })
    .then(response => {
        if (!response.ok) throw new Error("Ocurrió un problema al enviar la evaluación");
        return response.json();
    })
    .then(data => {
        // Actualizar el contador en la interfaz sin recargar la página
        const spanNota = document.getElementById(`nota-promedio-${id}`);
        spanNota.innerText = data.nuevaNotaPromedio;
        alert("¡Evaluación enviada con éxito!");
    })
    .catch(error => {
        console.error(error);
        alert("Hubo un error al evaluar la actividad.");
    });
};

const renderResults = (actividades, term) => {
    resultsContainer.innerHTML = ""; 
    searchMessage.innerHTML = "";

    if (actividades.length === 0) {
        searchMessage.innerHTML = "No se encontraron resultados para la búsqueda.";
        return;
    }

    actividades.forEach(act => {
        const card = document.createElement("div");
        card.className = "actividad-card";

        const highlightedNombre = highlightText(act.nombreActividad, term);
        const highlightedDesc = highlightText(act.descripcion, term);
        const highlightedComuna = highlightText(act.comuna, term);

        // Agregamos el Span para la nota y los inputs de evaluación
        card.innerHTML = `
            <h3>${highlightedNombre} (${act.tipo})</h3>
            <p><strong>Descripción:</strong> ${highlightedDesc}</p>
            <p><strong>Miembro:</strong> ${act.nombreMiembro}</p>
            <p><strong>Día:</strong> ${act.dia}</p>
            <p><strong>Comuna:</strong> ${highlightedComuna}</p>
            <p><strong>Nota Promedio:</strong> <span id="nota-promedio-${act.id}" style="font-weight:bold; font-size:1.2em;">${act.nota}</span></p>
            
            <div style="margin-top:10px; background:#f9f9f9; padding:10px; border-radius:5px;">
                <label for="selector-nota-${act.id}">Evaluar actividad:</label>
                <select id="selector-nota-${act.id}">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                </select>
                <button type="button" onclick="evaluarActividad(${act.id})">Evaluar</button>
            </div>
        `;
        
        resultsContainer.appendChild(card);
    });
};

const handleSearch = (event) => {
    const term = event.target.value.trim();

    if (term.length >= 3) {
        fetch(`/api/actividades/search/${term}`)
            .then(response => {
                if (!response.ok) throw new Error("Error en la red");
                return response.json();
            })
            .then(data => renderResults(data.data, term))
            .catch(error => {
                console.error("Error fetching data:", error);
                searchMessage.innerHTML = "Ocurrió un error al buscar.";
            });
    } else {
        resultsContainer.innerHTML = "";
        searchMessage.innerHTML = "";
    }
};

inputSearch.addEventListener("input", handleSearch);