package tarea.parte4.t4.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tarea.parte4.t4.models.Actividad;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    
    @Query("SELECT a FROM Actividad a WHERE " +
           "LOWER(a.nombre) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(a.miembro.comuna.nombre) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Actividad> searchByTerm(@Param("term") String term);
}