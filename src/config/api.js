import axios from 'axios';

// Cria a instância do axios com a baseURL
const token = localStorage.getItem('token');
const api = axios.create({
  baseURL: 'https://ag-bay.vercel.app', // Endpoint base da API
  headers: { Authorization: `Bearer ${token}` } 
});

// Adiciona um interceptor para incluir o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Busca o token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho
  }
  return config;
}, (error) => {
  return Promise.reject(error); // Trata possíveis erros
});

export default api;
