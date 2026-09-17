import BaseService from "./BaseService";

class FreteService extends BaseService{
    constructor(){
        super("/frete");
    }

    async obterHoraServidor(){
        const response = await this.api.get(this.endPoint);
        return response.data;
    }

    async obterIndices(){
        const response = await this.api.get(`${this.endPoint}/indices`);
        return response.data;
    }

    async calcularFrete(freteDTO){
        const response = await this.api.post(`${this.endPoint}/calcular`, freteDTO);
        return response.data;
    }

    

    
}

export default FreteService;