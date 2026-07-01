package tarea.parte4.t4.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tarea.parte4.t4.models.Actividad;
import tarea.parte4.t4.models.Nota;
import tarea.parte4.t4.repositories.ActividadRepository;
import tarea.parte4.t4.repositories.NotaRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class SearchController {

    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public SearchController(ActividadRepository actividadRepository, NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping("/api/actividades/search/{term}")
    public Map<String, List<Map<String, String>>> searchActividades(@PathVariable("term") String term) {
        List<Actividad> actividades = actividadRepository.searchByTerm(term);
        List<Map<String, String>> result = new ArrayList<>();

        for (Actividad a : actividades) {
            Map<String, String> dto = new HashMap<>();
            dto.put("id", String.valueOf(a.getId())); // Necesario para identificar qué evaluar
            dto.put("nombreMiembro", a.getMiembro().getNombre());
            dto.put("dia", a.getDia());
            dto.put("tipo", a.getTipo());
            dto.put("comuna", a.getMiembro().getComuna().getNombre());
            dto.put("nombreActividad", a.getNombre());
            dto.put("descripcion", a.getDescripcion() != null ? a.getDescripcion() : "");

            // Calcular nota promedio
            List<Nota> notas = a.getNotas();
            if (notas == null || notas.isEmpty()) {
                dto.put("nota", "-");
            } else {
                double avg = notas.stream().mapToInt(Nota::getNota).average().orElse(0.0);
                dto.put("nota", String.format("%.1f", avg));
            }
            result.add(dto);
        }
        return Map.of("data", result);
    }

    @PostMapping("/api/actividades/{id}/evaluar")
    public ResponseEntity<?> evaluarActividad(@PathVariable Long id, @RequestParam("valor") Integer valor) {
        // Validar que sea un número entero entre 1 y 7
        if (valor < 1 || valor > 7) {
            return ResponseEntity.badRequest().body(Map.of("error", "La nota debe estar entre 1 y 7"));
        }

        Actividad actividad = actividadRepository.findById(id).orElse(null);
        if (actividad == null) {
            return ResponseEntity.notFound().build();
        }

        // Guardar la nueva nota en la BD
        Nota nuevaNota = new Nota();
        nuevaNota.setNota(valor);
        nuevaNota.setActividad(actividad);
        notaRepository.save(nuevaNota);

        // Recalcular el promedio actual
        List<Nota> todasLasNotas = actividad.getNotas();
        todasLasNotas.add(nuevaNota);
        double avg = todasLasNotas.stream().mapToInt(Nota::getNota).average().orElse(0.0);

        return ResponseEntity.ok(Map.of("nuevaNotaPromedio", String.format("%.1f", avg)));
    }
}