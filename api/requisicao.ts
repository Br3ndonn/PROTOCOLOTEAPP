import axios from 'axios';

// Para Expo Go, use o IP da sua máquina na rede local
// IP atual da máquina: 192.168.1.10
const API_URL = 'http://192.168.1.10:8000';

export const requisicaoService = {
  async get(endpoint: string, params?: any) {
    try {
      console.log('Fazendo requisição GET para:', `${API_URL}${endpoint}`);
      const response = await axios.get(`${API_URL}${endpoint}`, { params });
      console.log('Resposta recebida:', response.status, response.data);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Erro na requisição GET:', error);
      
      // Melhor tratamento do erro
      let errorMessage = 'Erro na requisição GET';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Conexão recusada - API não está rodando';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Erro de rede - Verifique a conexão com a API';
      } else if (error.response) {
        // Erro HTTP (4xx, 5xx)
        errorMessage = `Erro HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else {
        errorMessage = error.message || 'Erro desconhecido na requisição GET';
      }
      
      return { data: null, error: errorMessage };
    }
  },

  async post(endpoint: string, body: any) {
    try {
      console.log('Fazendo requisição POST para:', `${API_URL}${endpoint}`);
      const response = await axios.post(`${API_URL}${endpoint}`, body);
      console.log('Resposta recebida:', response.status, response.data);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Erro na requisição POST:', error);
      
      // Melhor tratamento do erro
      let errorMessage = 'Erro na requisição POST';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Conexão recusada - API não está rodando';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Erro de rede - Verifique a conexão com a API';
      } else if (error.response) {
        // Erro HTTP (4xx, 5xx)
        errorMessage = `Erro HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else {
        errorMessage = error.message || 'Erro desconhecido na requisição POST';
      }
      
      return { data: null, error: errorMessage };
    }
  }
};