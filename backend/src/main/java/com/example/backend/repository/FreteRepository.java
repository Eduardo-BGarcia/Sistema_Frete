package com.example.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import com.example.backend.model.Frete;

@Repository 
public interface FreteRepository extends JpaRepository<Frete, Long> {

    @Query ("SELECT COUNT(f) FROM Frete f")
    Long contarTotalSimulacoes();

    @Query("SELECT AVG(f.valorCalculado) FROM Frete f")
    Double calcularValorMedio();

    @Query("SELECT MAX(f.dataHoraSimulacao) FROM Frete f")
    LocalDateTime buscarDataUltimaSimulacao();

    @Query("""
        SELECT f FROM Frete f 
        WHERE (:dataInicio IS NULL OR f.dataHoraSimulacao >= :dataInicio)
        AND (:dataFim IS NULL OR f.dataHoraSimulacao <= :dataFim)
        AND (:pesoMin IS NULL OR f.pesoPacote >= :pesoMin)
        AND (:pesoMax IS NULL OR f.pesoPacote <= :pesoMax)
        AND (:distanciaMin IS NULL OR f.distancia >= :distanciaMin)
        AND (:distanciaMax IS NULL OR f.distancia <= :distanciaMax)
    """)
    List<Frete> listarPorFiltro(
        @Param("dataInicio") LocalDateTime dataInicio,
        @Param("dataFim") LocalDateTime dataFim,
        @Param("pesoMin") Double pesoMin,
        @Param("pesoMax") Double pesoMax,
        @Param("distanciaMin") Double distanciaMin,
        @Param("distanciaMax") Double distanciaMax
    );
}
