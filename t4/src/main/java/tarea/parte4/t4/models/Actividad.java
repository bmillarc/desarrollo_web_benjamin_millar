package tarea.parte4.t4.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "actividad")
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String descripcion;
    private String dia;
    private String tipo;

    @ManyToOne
    @JoinColumn(name = "miembro_id")
    private Miembro miembro;

    @OneToMany(mappedBy = "actividad", fetch = FetchType.LAZY)
    private List<Nota> notas;

    
    public Long getId() { 
        return id; 
    }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public String getDia() { return dia; }
    public String getTipo() { return tipo; }
    public Miembro getMiembro() { return miembro; }
    public List<Nota> getNotas() { return notas; }
}