import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom"
import FreteService from "../service/FreteService";
import CardResumo from '../components/cardResumo/CardResumo';
import Header from '../components/header/Header';

const Home = () => {
    const navigate = useNavigate();
    const freteService = new FreteService();

    const [dataHora, setDataHora] = useState("Atualizando a hora, aguarde um momento...");
    const [indices, setIndices] = useState({quantidadeSimulacoes: 0, valorMedioFrete: 0.0, dataUltimaSimulacao: "00/00/0000"});

    const irSimulacao = () => {
        navigate("/frete");
    }

    useEffect(() => {
        const carregarHoraServidor = async () => {
            try {
                const resposta = await freteService.obterHoraServidor();
                setDataHora(resposta);
            } catch (error) {
                console.error(" Erro ao buscar a hora do Servidor.", error);
                setDataHora("Erro ao buscar a hora do Servidor.");
            }
        };

        const carregarIndices = async () => {
            try {
                const respostaIndices = await freteService.obterIndices();
                setIndices(respostaIndices);
            } catch (error) {
                console.error("Erro ao buscar índices", error);
            }
        }
        carregarHoraServidor();
        carregarIndices();
    }, []);

    return (
        <> 
        <div>
            <Header titulo="Seja Bem Vindo ao Sistema de Simulações de Fretes"/>
            
            <h2> Data e hora do acesso: {dataHora} </h2>
            
            <br />
            <div style={{display: 'flex', gap: '1rem'}}>
                <CardResumo 
                    titulo="Quantidade Simulações" 
                    valor={indices.quantidadeSimulacoes}
                />
                <CardResumo 
                    titulo="Valor médio dos fretes" 
                    valor={`R$ ${Number(indices.valorMedioFrete || 0).toFixed(2)}`}
                />
                <CardResumo 
                    titulo="Data última simulação" 
                    valor={indices.dataUltimaSimulacao ? new Date(indices.dataUltimaSimulacao).toLocaleString() : 'Nenhuma'} 
                />
            </div>
        
            <br />
                <Button onClick={irSimulacao}>Acessar</Button>

        </div>
        </>
    );
}
export default Home;
