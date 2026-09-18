package com.example.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.format.annotation.DateTimeFormat;
import com.example.backend.dto.FreteDTO;
import com.example.backend.dto.IndicesFretesSimulacoesDTO;
import com.example.backend.model.Frete;
import com.example.backend.service.FreteService;
import com.example.backend.service.UtilService;

import main.java.com.example.backend.dto.FiltroDTO;

import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin
@RestController
@RequestMapping("/frete")
public class FreteController {
    @Autowired
    private FreteService freteService;

    @Autowired
    private UtilService utilService;

    @PostMapping
    public FreteDTO salvar(@RequestBody FreteDTO freteDTO){
        return freteService.salvar(freteDTO);
    }

    @DeleteMapping("/excluir/{id}")
    public void excluir(@PathVariable("id") Long id){
        freteService.excluir(id);
    }

    @DeleteMapping("/excluirTudo")
    public void excluirTudo(){
        freteService.excluirTudo();
    }

    @GetMapping("/listar")
    public List<Frete> listar() {
        return freteService.listar();
    }

    @GetMapping("/listarPorFiltro")
    public List<Frete> filtrar(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
        @RequestParam(required = false) Double pesoMin,
        @RequestParam(required = false) Double pesoMax,
        @RequestParam(required = false) Double distanciaMin,
        @RequestParam(required = false) Double distanciaMax
    ) {
        return freteService.listarPorFiltro(dataInicio, dataFim, pesoMin, pesoMax, distanciaMin, distanciaMax);
    }

    @GetMapping
    public String obterHoraServidor(){
        return utilService.obterHoraServidor();

    }

    @GetMapping("/indices")
    public IndicesFretesSimulacoesDTO obterIndices() {
        return freteService.obterIndices();
    }
    
    @PostMapping("/calcular")
    public Double calcularFrete(@RequestBody FreteDTO dto){
        return freteService.calcularFrete(dto);
    }
    
}
