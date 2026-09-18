package main.java.com.example.backend.dto;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class FiltroDTO {
    private Date dataInicial;
    private Date dataIFinal;
    private Double pesoMin;
    private Double pesoMax;
    private Double distanciaMin;
    private Double distanciaMax;
}
