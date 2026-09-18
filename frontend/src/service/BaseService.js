import api from '../config/axios';

class BaseService {

    constructor(endPoint) {
        this.api = api;
        this.endPoint = endPoint;
    }

    async insert(data) {
        const response = await this.api.post(this.endPoint, data);
        return response.data;
    }

    async excluir(id) {
        const response = await this.api.delete(`${this.endPoint}/excluir/${id}`);
        return response.data;
    }

    async excluirTudo() {
        const response = await this.api.delete(`${this.endPoint}/excluirTudo`);
        return response.data;
    }

    async list() {
        const response = await this.api.get(`${this.endPoint}/listar`);
        return response.data;
    }

    async listByFilter(dataInicio, dataFim, pesoMin, pesoMax, distanciaMin, distanciaMax) {
        const response = await this.api.get(`${this.endPoint}/listarPorFiltro`, {
            params: {
                dataInicio,
                dataFim,
                pesoMin,
                pesoMax,
                distanciaMin,
                distanciaMax
            }
        });
        return response.data;
    }

}
export default BaseService;

