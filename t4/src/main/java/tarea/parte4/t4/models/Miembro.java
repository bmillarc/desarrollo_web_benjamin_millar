package tarea.parte4.t4.models;

import jakarta.persistence.*;

@Entity
@Table(name = "miembro")
public class Miembro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

    // Getters y Setters...
    public String getNombre() { return nombre; }
    public Comuna getComuna() { return comuna; }
}