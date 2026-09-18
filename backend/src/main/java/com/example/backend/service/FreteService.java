package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.FreteDTO;
import com.example.backend.dto.IndicesFretesSimulacoesDTO;
import com.example.backend.model.Frete;
import com.example.backend.repository.FreteRepository;

import main.java.com.example.backend.dto.FiltroDTO;

@Service
public class FreteService {
    @Autowired
    private FreteRepository freteRepository;

    public List<Frete> listar() {
        return freteRepository.findAll();
    }

    public List<Frete> listarPorFiltro(
        LocalDateTime dataInicio, 
        LocalDateTime dataFim, 
        Double pesoMin, 
        Double pesoMax, 
        Double distanciaMin, 
        Double distanciaMax
    ) {
        return freteRepository.listarPorFiltro(dataInicio, dataFim, pesoMin, pesoMax, distanciaMin, distanciaMax);
    }
    

    public FreteDTO salvar(FreteDTO freteDTO) {
        if (freteDTO == null) {
            return null;
        }

        Frete frete = new Frete();
        frete.setId(freteDTO.getId());
        frete.setPesoPacote(freteDTO.getPesoPacote());
        frete.setDistancia(freteDTO.getDistancia());
        frete.setAdicionalUrgencia(freteDTO.getAdicionalUrgencia());
        frete.setTipoEnvio(freteDTO.getTipoEnvio());
        frete.setValorCalculado(freteDTO.getValorCalculado());
        frete.setDataHoraSimulacao(LocalDateTime.now());
        Frete freteSalvo = freteRepository.save(frete);

        FreteDTO freteSalvoDTO = new FreteDTO();
        freteSalvoDTO.setId(freteSalvo.getId());
        freteSalvoDTO.setPesoPacote(freteSalvo.getPesoPacote());
        freteSalvoDTO.setDistancia(freteSalvo.getDistancia());
        freteSalvoDTO.setAdicionalUrgencia(freteSalvo.getAdicionalUrgencia());
        freteSalvoDTO.setTipoEnvio(freteSalvo.getTipoEnvio());
        freteSalvoDTO.setValorCalculado(freteSalvo.getValorCalculado());

        return freteSalvoDTO;
    }

    public void excluir(Long id){
        if(id != null){
            freteRepository.deleteById(id);
        }
    }

    public void excluirTudo(){
        freteRepository.deleteAll();
    }

    public IndicesFretesSimulacoesDTO obterIndices() {
        List<Frete> fretes = freteRepository.findAll();
        long total = fretes.size();
        double media = fretes.stream().mapToDouble(Frete::getValorCalculado).average().orElse(0.0);

        LocalDateTime ultimaData = fretes.stream().map(Frete::getDataHoraSimulacao).max(LocalDateTime::compareTo).orElse(null);

        return new IndicesFretesSimulacoesDTO(total, media, ultimaData);
    }

    public Double calcularFrete(FreteDTO dto){
        if (dto == null){
            return null;
        }

        try {
            if (dto.getTipoEnvio() != null && dto.getTipoEnvio().equals("Expresso")){
            Double valorFrete = 0.0;
            Double peso = dto.getPesoPacote();
            Double distancia = dto.getDistancia();
            Double adicionalUrgencia = dto.getAdicionalUrgencia();
            
            valorFrete = ((peso * 3.5) + (distancia * 1.20)) * (1 + (adicionalUrgencia / 100));
            
            return valorFrete;

            } else {
                Double valorFrete = 0.0;
                Double peso = dto.getPesoPacote();
                Double distancia = dto.getDistancia();
                
                valorFrete = (peso * 3.5) + (distancia * 1.20);

                return valorFrete;
            }
        } catch (IllegalArgumentException e){
            System.out.println("Erro: Não foi possível calcular o frete! " + e.getMessage()); 
            return null;
        }
        
    }
}
