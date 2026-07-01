package tarea.parte4.t4.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tarea.parte4.t4.models.Nota;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {
}