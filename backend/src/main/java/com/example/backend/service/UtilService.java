package com.example.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;


@Service
public class UtilService {
    
    public String obterHoraServidor(){ 
        LocalDateTime agora = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyy HH:mm:ss");

        return formatter.format(agora);
    }
}
