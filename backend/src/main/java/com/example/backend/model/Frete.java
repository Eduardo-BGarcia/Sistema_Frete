package com.example.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table
public class Frete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull (message = "{name.required}")
    private Double pesoPacote;

    @NotNull(message = "{name.required}")
    private Double distancia;

    private Double adicionalUrgencia;

    @NotBlank(message = "{name.required}")
    private String tipoEnvio;

    private Double valorCalculado;
    private LocalDateTime dataHoraSimulacao;
}
