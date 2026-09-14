import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import FreteService from "../service/FreteService";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Header from '../components/header/Header';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const Frete = () => {
    const navigate = useNavigate();
    const [dataHora, setDataHora] = useState("Atualizando a hora, aguarde um momento...");
    const [frete, setFrete] = useState({ pesoPacote: "", distancia: "", adicionalUrgencia: "", tipoEnvio: ""});
    const freteService = new FreteService();
    const tipoEnvio = [
        {label: "Econômico", value: "Economico"},
        {label: "Expresso", value: "Expresso"}
    ]
    
    const irHome = () => {
        navigate("/");
    }

    const salvarFrete = async () => {
        await freteService.inserir(frete);
    };

    useEffect(() => {
        const carregarHoraServidor = async () => {
            try {
                const resposta = await freteService.obterHoraServidor();
                setDataHora(resposta);
            } catch (error){
                console.error("Erro ao buscar a hora no Servidor.", error);
                setDataHora("Erro ao buscar a hora no Servidor.");
            }
        };
        carregarHoraServidor();
    }, []);

    return (
        <>
            <div>
                <Header titulo="Simulação de Frete"/>
                <br />
                
                <h2> Data e hora do acesso: {dataHora} </h2>
                
                <br />

                <div>
                    <h1>Simulação</h1>
                    <div>
                        <label htmlFor="pesoPacote">Peso do Pacote</label><br />
                        <InputText
                            id="pesoPacote" 
                            value={frete.pesoPacote} 
                            onChange={(e) =>setFrete({...frete, pesoPacote: e.target.value})}/><br /><br />

                        <label htmlFor="distancia">Distância</label><br />
                        <InputText
                            id="distancia"
                            value={frete.distancia}
                            onChange={(e) => setFrete({...frete, distancia: e.target.value})}/><br /><br />

                        <label htmlFor="adicionalUrgencia">Adicional Urgência</label><br />
                        <InputText
                            id="adicionalUrgencia"
                            value={frete.adicionalUrgencia}
                            onChange={(e) => setFrete({...frete, adicionalUrgencia: e.target.value})}/><br /><br />

                        <label htmlFor="TipoEnvio">Tipo Envio</label><br />
                        <Dropdown
                            id="tipoEnvio"
                            value={frete.tipoEnvio}
                            options={tipoEnvio}
                            onChange={(e) => setFrete({...frete, tipoEnvio: e.value})}
                            placeholder="Selecione o tipo de envio"
                        /><br /><br />
                    </div>
                </div>

                <Button onClick={irHome}>Acessar</Button>

            </div>
        </>
    );
}
export default Frete;
