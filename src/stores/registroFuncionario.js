// src/stores/registerData.js
import { ref } from 'vue'

export const cadastroFuncionario = ref({
  dadosLogin: {
    email: '',
    nomeUsuario: '',
    senha: '',
    tipo: '',
    emailToken: '',
    codEmpresa: '',
  },
  dadosFuncionario: {
    nome: '',
    telefone: '',
    whatsapp: false,
    genero: '',
    codEmpresa: '',
    emailV: '',
  },
})
