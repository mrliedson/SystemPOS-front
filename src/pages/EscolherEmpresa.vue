<template>
  <button class="botao-voltar" @click="router.back()" aria-label="Voltar">
    <svg viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  </button>

  <h1 class="title">COM QUAL EMPRESA DESEJA ENTRAR?</h1>

  <div class="Box-laranja">
    <div class="linha-btn1">
      <!-- Se empresas existir e tiver itens -->
      <template v-if="empresas.length > 0">
        <div v-for="empresa in empresas" :key="empresa.id" class="cartao-empresa">
          <p class="empresa-nome">{{ empresa.nome_fantasia || empresa.razao_social }}</p>
          <p class="empresa-cnpj">CNPJ: {{ empresa.cnpj }}</p>
          <button class="botao-laranja" @click="entrarNaEmpresa(empresa)">Entrar</button>
        </div>
      </template>

      <!-- Se não tiver nenhuma empresa -->
      <template v-else>
        <p style="color: white; font-size: 24px; text-align: center; width: 100%">
          Nenhuma empresa cadastrada
        </p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { emailDono } from '../stores/registroDono.js'
import { cadastroFuncionario } from '../stores/registroFuncionario.js'

const router = useRouter()
const empresas = ref([])
const mensagem = ref('')

async function fetchEmpresas() {
  try {
    const res = await axios.get(`http://localhost:3333/dono/${emailDono.value.dadosDono.codDono}`)
    empresas.value = res.data.message || []
  } catch (err) {
    console.error(err)
  }
}

async function entrarNaEmpresa(empresa) {
  try {
    console.log('Entrando na empresa:', empresa.nome_fantasia || empresa.razao_social)
    const response = await axios.put(`http://localhost:3333/dono`, {
      codEmpresa: empresa.e_id,
      codDono: emailDono.value.dadosDono.codDono,
    })
    if (response.status === 200) {
      router.push('/home')
      cadastroFuncionario.value.dadosLogin.codEmpresa = empresa.e_id
      mensagem.value = 'Empresa acessada com sucesso!'
    } else {
      mensagem.value = 'Erro de servidor'
    }
  } catch (error) {
    console.error('Erro de servidor:', error)
    const erro = error.response?.data?.erro || 'Erro inesperado'
    mensagem.value = `${erro}`
  }
}

onMounted(() => {
  fetchEmpresas()
})
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  background-color: #121212;
  overflow: auto; /* permite scroll na página se necessário */
}

.title {
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin: 20px 0 10px 0;
}

.Box-laranja {
  border-radius: 24px;
  width: 90%;
  max-height: 80vh; /* limita altura para não ultrapassar a tela */
  overflow-y: auto; /* scroll interno quando ultrapassar altura */
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 2em;
  margin: 0 auto;
  padding: 1em 0;
}

.linha-btn1 {
  display: flex;
  flex-wrap: wrap; /* quebra para linha de baixo se precisar */
  justify-content: center;
  align-items: stretch;
  gap: 2em;
  width: 100%;
}

.cartao-empresa {
  background-color: #0a0a0a;
  flex: 1 1 28%; /* flexível e ocupa até 28% da linha */
  max-width: 30%;
  min-width: 240px; /* não fica muito pequeno em telas menores */
  min-height: 22em;
  max-height: 30em;
  border-radius: 0.8em;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* botão sempre no fim */
  align-items: center;
  text-align: center;
  padding: 10px;
  transition: background-color 0.3s ease;
  box-sizing: border-box;
}

.cartao-empresa:hover {
  background-color: #202020;
}

.empresa-nome {
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  color: #ffffff;
}

.empresa-cnpj {
  font-size: 20px;
  margin: 5px 0 15px;
  color: #bbb;
}

.botao-laranja {
  width: 80%;
  height: 2.5em;
  background-color: #ff7f26;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10%;
}

.botao-laranja:hover {
  background-color: #e65100;
}

.botao-voltar {
  width: 80px;
  height: 80px;
  background-color: #333;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 20px;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.botao-voltar:hover {
  background-color: #444;
}

.botao-voltar svg {
  width: 36px;
  height: 36px;
  stroke: white;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
</style>
