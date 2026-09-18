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
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Calendar } from 'primereact/calendar';

const Frete = () => {
    const navigate = useNavigate();
    const [dataHora, setDataHora] = useState("Atualizando a hora, aguarde um momento...");
    const [frete, setFrete] = useState({ pesoPacote: "", distancia: "", adicionalUrgencia: "", tipoEnvio: "", valorCalculado: 0});
    const [filtro, setFiltro] = useState({ dataInicial: null, dataFinal: null, pesoMin: null, pesoMax: null, distanciaMin: null, distanciaMax: null});
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
            listar();
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao salvar o frete."
                });
            }
        } catch (error) {
            console.error("Erro ao salvar frete", error);
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao salvar o frete."
            });
        }
    }

    const listar = async () => {
        try {
            const respostaLista = await freteService.list();
            setListaTabela(respostaLista);
        } catch (error) {
            toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao listar os fretes."
                });
        }
    }

    const formatarDataInicio = (data) => {
        if (!data) return null;
        const d = new Date(data);
        const ano = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}T00:00:00`;
    };

    const formatarDataFim = (data) => {
        if (!data) return null;
        const d = new Date(data);
        const ano = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}T23:59:59`;
    };

    

    const listarPorFiltro = async () => {
        try {
            const dataInicioFormatada = filtro.dataInicial ? formatarDataInicio(filtro.dataInicial) : null;
            const dataFimFormatada = filtro.dataFinal ? formatarDataFim(filtro.dataFinal) : null;

            const respostaLista = await freteService.listByFilter(
                dataInicioFormatada,
                dataFimFormatada,
                filtro.pesoMin,
                filtro.pesoMax,
                filtro.distanciaMin,
                filtro.distanciaMax
            );
            setListaTabela(respostaLista);
            toast.current.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Registros listados com sucesso"
            })
        } catch (error) {
            toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao listar os registros."
                });
        }
    }

    const excluirPorId = async (id) => {
        try {
            await freteService.excluir(id);
            toast.current.show({
                severity: "success",
                summary: "Excluído",
                detail: "Realizado exclusão do registro!"
            });
            listar();
        } catch (error) {
            console.error("Erro ao realizar a exclusão do registro", error);
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao realizar a exclusão!"
            });
        }
    }

    const confirmaExclusaoIndividual = (id) => {
        confirmDialog({
            message: `Deseja excluir o registro ? "${id}"?`,
            header: "Confirmação de Exclusão",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sim",
            rejectLabel: "Não",
            acceptClassName: 'p-button-danger',
            accept: () => excluirPorId(id),
            reject: () => {}
        });
    };

    const confirmarExcluirTudo = () => {
    confirmDialog({
        message: 'Tem certeza que deseja apagar TODOS os registros da tabela? Esta ação não pode ser desfeita.',
        header: 'Atenção: Limpar Histórico',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, limpar tudo',
        rejectLabel: 'Cancelar',
        acceptClassName: 'p-button-danger',
        accept: () => excluirTudo()
    });
};


    const excluirTudo = async () => {
        try {
            await freteService.excluirTudo();
            toast.current.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Realizado a exclusão de todos os registros!"
            })
            listar();
        } catch (error) {
            console.error("Erro ao excluir todos os registros da tabela!", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Erro ao excluir os registros da tabela!"
            })
        }
    }

    const acoesTabela = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                tooltip="Excluir frete"
                tooltipOptions={{ position: "top"}}
                onClick={() => confirmaExclusaoIndividual(rowData.id)}
            />
        );
    };

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
                <ConfirmDialog />
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
                            <Button onClick={confirmarExcluirTudo}>Limpar Tabela</Button>
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

                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem', margin: '10px'}}>
                                <Calendar
                                id="dataInicial"
                                value={filtro.dataInicial}
                                onChange={(e) => setFiltro({...filtro, dataInicial: e.value})}
                                showIcon
                                dateFormat="dd/mm/yy"
                                placeholder='Data inicial'
                                />

                                <Calendar
                                    id="dataFinal"
                                    value={filtro.dataFinal}
                                    onChange={(e) => setFiltro({...filtro, dataFinal: e.value})}
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                    placeholder='Data Final'
                                />

                                <InputNumber
                                    id='pesoMin'
                                    placeholder='Peso Min'
                                    onChange={(e) => setFiltro({...filtro, pesoMin: e.value})}
                                />

                                <InputNumber
                                    id='pesoMax'
                                    placeholder='Peso Final'
                                    onChange={(e) => setFiltro({...filtro, pesoMax: e.value})}
                                />

                                <InputNumber
                                    id='distanciaMin'
                                    placeholder='Distancia Min'
                                    onChange={(e) => setFiltro({...filtro, distanciaMin: e.value})}
                                />

                                <InputNumber
                                    id='distanciaMax'
                                    placeholder='Distancia Max'
                                    onChange={(e) => setFiltro({...filtro, distanciaMax: e.value})}
                                />

                                <Button
                                    icon="pi pi-filter"
                                    className="p-button-rounded p-button-success"
                                    tooltip="Listar"
                                    onClick={listarPorFiltro}
                                />
                            </div>


                            

                            <DataTable 
                                value={listaTabela}
                                emptyMessage="Nenhum registro encontrado"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 20]}>
                                <Column field="id" header="ID" />
                                <Column field="tipoEnvio" header="Tipo de Envio" />
                                <Column field="pesoPacote" header="Peso (kg)" />
                                <Column field="distancia" header="Distância (km)" />
                                <Column field="adicionalUrgencia" header="Urgência (%)" />
                                <Column field="valorCalculado" header="Valor (R$)" />
                                <Column header="Ações" 
                                    body={acoesTabela} 
                                    exportable={false} 
                                    style={{ width: '10%', textAlign: 'center'}}/>
                            </DataTable>
                        </div>
                    </div>

            </div>
        </>
    );
}
export default Frete;
