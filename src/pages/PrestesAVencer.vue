<template>
  <div class="tela">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="goHome()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <!-- Título -->
    <h1 class="title">PRESTES A VENCER</h1>

    <!-- Filtro customizado -->
    <div class="filtro" @click="mostrarDropdown = !mostrarDropdown">
      <label>Vencimento em até:</label>
      <div class="custom-select">
        <div class="selected">{{ diasLimite }} dias</div>
        <div v-if="mostrarDropdown" class="options">
          <div
            v-for="opcao in [15, 30, 40, 60]"
            :key="opcao"
            class="option"
            @click.stop="selecionarOpcao(opcao)"
          >
            {{ opcao }} dias
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de produtos -->
    <div class="scrollview">
      <div class="item" v-for="produto in produtos" :key="produto.codigo_barras">
        <div class="row">
          <img
            :src="produto.imagem"
            @click="goDescricao(produto)"
            alt="Imagem do produto"
            class="img"
          />

          <div class="info">
            <div class="dado">
              <strong>Código de barras:</strong> <br />
              {{ produto.codigo_barras }}
            </div>
            <div class="dado">
              <strong>Data de validade:</strong> <br />
              {{ formatarData(produto.data_validade) }}
            </div>
            <div class="dado">
              <strong>Quantidade:</strong> <br />
              {{ produto.quantidade }}
            </div>

            <div class="status" :class="getStatus(produto).cor">
              <span>{{ getStatus(produto).texto }}</span
              ><br />
              <button v-if="getStatus(produto).proximo" @click="AlterarPreco()" class="vencer">
                Adicionar promoção
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Se lista estiver vazia -->
      <div v-if="produtos.length === 0" class="sem-produtos">Nenhum produto prestes a vencer.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { cadastroFuncionario } from 'src/stores/registroFuncionario.js'
import { reporEstoque } from '../stores/registroProduto.js'

const router = useRouter()
const goHome = () => router.push('/home')

const produtos = ref([])
const diasLimite = ref(30)
const mensagem = ref('')
const mostrarDropdown = ref(false)

function selecionarOpcao(valor) {
  diasLimite.value = valor
  mostrarDropdown.value = false
}

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:3333/produto/${cadastroFuncionario.value.dadosLogin.codEmpresa}`,
    )
    produtos.value = response.data.message
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  }
})

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR')
}

function getStatus(produto) {
  const hoje = new Date()
  const validade = new Date(produto.data_validade)
  const diasRestantes = (validade - hoje) / (1000 * 60 * 60 * 24)

  if (diasRestantes < 0) {
    return {
      texto: 'Produto está vencido',
      cor: 'vermelho',
      proximo: false,
    }
  } else if (diasRestantes <= diasLimite.value) {
    return {
      texto: 'Perto do vencimento',
      cor: 'amarelo',
      proximo: true,
    }
  } else {
    return {
      texto: 'Longe do vencimento',
      cor: 'verde',
      proximo: false,
    }
  }
}

async function AlterarPreco() {
  router.push('/alterarPreco')
}

async function goDescricao(produto) {
  try {
    reporEstoque.value.dadosDescricao.codigo_barras = produto.codigo_barras
    router.push('/descricaoDetalhada')
  } catch (error) {
    console.error('Erro de servidor:', error)
    const erro = error.response?.data?.erro || 'Erro inesperado'
    mensagem.value = `${erro}`
  }
}
</script>

<style scoped>
.tela {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 20px;
  position: relative;
}
.dado {
  margin: 0 auto;
  text-align: center;
}

.scrollview {
  width: 90%;
  height: 80%;
  overflow-y: auto;
  border-radius: 8px;
  padding: 20px;
  background: #ff7f26;
}

.item {
  background: #fff;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
}

.row {
  display: flex;
  align-items: center;
}

.img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
}

.info {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 20px;
  font-weight: 500;
}

.status {
  margin-top: 10px;
  text-align: center;
  margin: 0 auto;
}

.status.verde {
  color: green;
}

.status.vermelho {
  color: red;
}

.status.amarelo {
  color: #eb9605;
}

.vencer {
  margin-top: 5px;
  background-color: #eb9605;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 5px;
  padding: 4px 8px;
  font-size: 13px;
  cursor: pointer;
}

.vencer:hover {
  background-color: #cf7215;
}

.title {
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin-top: 10px;
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

.scrollview::-webkit-scrollbar {
  width: 8px;
}
.scrollview::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 10px;
  margin: 8px;
}
.scrollview::-webkit-scrollbar-thumb {
  background-color: #353535;
  border-radius: 10px;
}
.scrollview::-webkit-scrollbar-thumb:hover {
  background-color: #424242;
}

.sem-produtos {
  color: white;
  font-size: 18px;
  text-align: center;
  margin-top: 30px;
}

.filtro {
  position: absolute;
  top: 30px;
  right: 30px;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

.custom-select {
  position: relative;
  background-color: #ff7f26;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
}

.custom-select .selected {
  color: white;
  font-weight: bold;
}

.options {
  position: absolute;
  top: 110%;
  left: 0;
  background-color: #cf7215;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 20;
}

.option {
  padding: 6px 10px;
  color: white;
}

.option:hover {
  background-color: #a75d13; /* hover laranja escuro */
}
</style>
