import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom"
import FreteService from "../service/FreteService";
import { Button } from 'primereact/button';
import Header from '../components/header/Header';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import CardResumo from '../components/cardResumo/CardResumo';
import { Toast } from "primereact/toast";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Frete = () => {
    const navigate = useNavigate();
    const [dataHora, setDataHora] = useState("Atualizando a hora, aguarde um momento...");
    const [frete, setFrete] = useState({ pesoPacote: "", distancia: "", adicionalUrgencia: "", tipoEnvio: "", valorCalculado: 0});
    const [calculo, setCalculo] = useState(0);
    const [listaTabela, setListaTabela] = useState([]);
    const freteService = new FreteService();
    const tipoEnvio = [
        {label: "Econômico", value: "Economico"},
        {label: "Expresso", value: "Expresso"}
    ]
    const toast = useRef(null);
    
    const irHome = () => {
        navigate("/");
    }

    const calcularFrete = async () => {
        try {
            const respostaCalculo = await freteService.calcularFrete(frete);
            setCalculo(respostaCalculo);
            setFrete({...frete, valorCalculado: respostaCalculo});
            toast.current.show({
                severity: "success",
                summary: "Calculado",
                detail: "Simulação realizada com sucesso!"
            });

        } catch (error) {
            console.error("Erro ao calcular o frete", error);
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao realizar o cálculo do frete."
            });
        }
    };

    const salvarFrete = async () => {
        try {
            const respostaSalva = await freteService.insert(frete);
            if (respostaSalva.id !== null){
                toast.current.show({
                severity: "success",
                summary: "Registro Salvo",
                detail: "Registro salvo com sucesso!"
            });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao salvar o frete."
                });
            }
        } catch (error) {
            console.error("Erro ao salvar frete", error);
        }
    }

    const listar = async () => {
        try {
            const respostaLista = await freteService.list();
            setListaTabela = respostaLista;
        } catch (error) {
            toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao listar os fretes."
                });
        }
    }
    const carregarHoraServidor = async () => {
            try {
                const resposta = await freteService.obterHoraServidor();
                setDataHora(resposta);
            } catch (error){
                console.error("Erro ao buscar a hora no Servidor.", error);
                setDataHora("Erro ao buscar a hora no Servidor.");
            }
        };

    useEffect(() => {
        
        carregarHoraServidor();
        listar();
    }, []);

    return (
        <>
            <div>
                <Toast ref={toast} />
                <Header titulo="Simulação de Frete"/>
                <br />

                <div style={{margin: '30px'}}>
                    
                    <Button onClick={irHome}>Retornar</Button>
                
                    <h2> Data e hora do acesso: {dataHora} </h2>
                
                    <br />
                    <h1>Simulação</h1>
                    <div style={{margin: '10px'}}>
                        <label htmlFor="pesoPacote">Peso do Pacote</label><br />
                        <InputNumber
                            id="pesoPacote" 
                            value={frete.pesoPacote} 
                            onChange={(e) =>setFrete({...frete, pesoPacote: e.value})}
                            placeholder='Ex: 15,30'/><br /><br />

                        <label htmlFor="distancia">Distância</label><br />
                        <InputNumber
                            id="distancia"
                            value={frete.distancia}
                            onChange={(e) => setFrete({...frete, distancia: e.value})}
                            placeholder='Ex: 120'/><br /><br />


                        <label htmlFor="TipoEnvio">Tipo Envio</label><br />
                        <Dropdown
                            id="tipoEnvio"
                            value={frete.tipoEnvio}
                            options={tipoEnvio}
                            onChange={(e) => setFrete({...frete, tipoEnvio: e.value})}
                            placeholder="Selecione o tipo de envio"
                        /><br /><br />
                        
                        <div>
                            <label htmlFor="adicionalUrgencia">Adicional Urgência</label><br />
                            <InputNumber
                            id="adicionalUrgencia"
                            value={frete.adicionalUrgencia}
                            onChange={(e) => setFrete({...frete, adicionalUrgencia: e.value})}
                            placeholder='EX: 10, 20, 30...'
                            disabled={frete.tipoEnvio != "Expresso"}/><br /><br />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem'}}>
                            <Button onClick={calcularFrete}>Calcular</Button>
                            <Button onClick={salvarFrete}>Salvar</Button>
                            <Button>Excluir Um</Button>
                            <Button>Limpar Tabela</Button>
                        </div>
                    </div>
                        <CardResumo
                            titulo={"Resultado Simulação"}
                            valor={`R$ ${Number(calculo || 0).toFixed(2)}`}
                        ></CardResumo>

                        <br></br>
                    </div>

                    <div style={{margin: '30px'}}>
                        <div>
                            <h2>Tabela de Histórico</h2>

                            <DataTable 
                                value={listaTabela} emptyMessage="Nenhum registro encontrado">
                                <Column field="id" header="ID" />
                                <Column field="tipoEnvio" header="Tipo de Envio" />
                                <Column field="pesoPacote" header="Peso (kg)" />
                                <Column field="distancia" header="Distância (km)" />
                                <Column field="adicionalUrgencia" header="Urgência (%)" />
                                <Column field="valorCalculado" header="Valor (R$)" />
                            </DataTable>
                        </div>
                    </div>

            </div>
        </>
    );
}
export default Frete;
