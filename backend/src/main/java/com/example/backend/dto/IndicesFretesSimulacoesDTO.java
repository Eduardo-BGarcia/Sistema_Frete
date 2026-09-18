package com.example.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class IndicesFretesSimulacoesDTO {
    private Long quantidadeSimulacoes;
    private Double valorMedioFrete;
    private LocalDateTime dataUltimaSimulacao;
}
