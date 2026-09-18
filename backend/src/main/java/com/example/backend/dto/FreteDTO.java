package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data 
public class FreteDTO {
    private Long id;
    private Double pesoPacote;
    private Double distancia;
    private Double adicionalUrgencia;
    private String tipoEnvio;
    private Double valorCalculado;
}
