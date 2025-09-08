<template>
  <div class="tela">
    <!-- Botão de voltar para algum lugar -->
    <button class="botao-voltar" @click="goHome()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <!-- Título da tela -->
    <h1 class="title">ALTERAR PREÇO</h1>

    <div class="tudo">
      <div class="pesquisar">
        <!-- Barra de pesquisa -->
        <div class="input-com-icone">
          <svg class="icone-pesquisa" viewBox="0 0 24 24">
            <path
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
              stroke="gray"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            v-model="filtro"
            type="text"
            placeholder="Buscar por nome ou código de barras..."
            class="barra-pesquisa"
          />
        </div>

        <!-- Lista de produtos -->
        <div class="scrollview">
          <div class="item" v-for="produto in produtosFiltrados" :key="produto.codigo_barras">
            <div class="row">
              <!-- Imagem do produto -->
              <img
                :src="produto.imagem"
                alt="Imagem do produto"
                @click="goDescricao(produto)"
                class="img"
                cursor="pointer"
              />

              <div class="info">
                <div class="dado">
                  <strong>Nome:</strong> <br />
                  {{ produto.nome }}
                </div>
                <div class="dado">
                  <strong>Marca:</strong> <br />
                  {{ produto.marca }}
                </div>
                <div class="dado">
                  <strong>Preco:</strong> <br />
                  {{ produto.preco }}
                </div>
                <div class="dado">
                  <strong>Status:</strong> <br />
                  <span :class="['status', produto.ativo === 1 ? 'verde' : 'vermelho']">
                    {{ Ativo(produto) }}
                  </span>
                </div>

                <div class="dado">
                  <button class="vencer" @click="AlterarPreco(produto)">Alterar preço</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Se lista estiver vazia -->
          <div v-if="produtosFiltrados.length === 0" class="sem-produtos">
            Nenhum produto cadastrado.
          </div>
        </div>
      </div>

      <div class="logoEfiltros">
        <img class="logo" src="../assets/logo.png" alt="Logo SystemPOS" />
        <button class="filtros" @click="prestesAVencer()">Próximos ao vencimento</button>
        <button class="filtros" @click="filtro = 'recentes'">Adicionados recentemente</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { reporEstoque } from '../stores/registroProduto.js'
import { cadastroFuncionario } from 'src/stores/registroFuncionario.js'

const filtro = ref('')
const produtos = ref([])
const mensagem = ref('')

const router = useRouter()
const goHome = () => router.push('/home')
const prestesAVencer = () => router.push('/prestesAVencer')

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:3333/produto/AP/${cadastroFuncionario.value.dadosLogin.codEmpresa}`,
    )
    produtos.value = response.data.message
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  }
})

const produtosFiltrados = computed(() => {
  const texto = filtro.value.toLowerCase()

  let lista = produtos.value

  // 🔹 Se filtro for "recentes", ordenar por data de cadastro (mais novo primeiro)
  if (texto === 'recentes') {
    lista = [...lista].sort((a, b) => new Date(b.data_adicao) - new Date(a.data_adicao))
  }
  // 🔹 Caso contrário, filtrar por nome ou código de barras
  else {
    lista = lista.filter((produto) => {
      return (
        produto.nome?.toLowerCase().includes(texto) ||
        produto.codigo_barras?.toString().includes(texto)
      )
    })
  }

  return lista
})

function Ativo(produto) {
  return produto.ativo === 1 ? 'Ativo' : 'Inativo'
}

async function AlterarPreco(produto) {
  try {
    reporEstoque.value.dadosPromocao.nome = produto.nome
    reporEstoque.value.dadosPromocao.marca = produto.marca
    reporEstoque.value.dadosPromocao.imagem = produto.imagem
    reporEstoque.value.dadosPromocao.preco = produto.preco
    reporEstoque.value.dadosPromocao.codigo_barras = produto.codigo_barras
    reporEstoque.value.dadosPromocao.id = produto.id
    router.push('/alterarPrecoParticular')
  } catch (error) {
    console.error('Erro de servidor:', error)
    const erro = error.response?.data?.erro || 'Erro inesperado'
    mensagem.value = `${erro}`
  }
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
</script >

<style scoped>
.tela {
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 20px;
  position: relative;
}
.tudo {
  display: flex;
  justify-content: space-between;
  width: 100%; /* Garante que o contêiner ocupe toda a largura disponível */
  height: 90%;
}
.dado {
  margin: 0 auto;
  text-align: center;
}

.logo {
  width: 80%;
  height: 80%;
  object-fit: cover;
}
.scrollview {
  width: 100%;
  height: 100%;
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
  font-weight: bold;
}

.status.vermelho {
  color: red;
  font-weight: bold;
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

.pesquisar {
  width: 50%;
  margin-left: 5%;
  margin-top: 1%;
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

.filtros {
  border-radius: 30px;
  background-color: white;
  width: 60%;
  padding: 3% 6%;
  font-size: 1.5rem;
  border: white solid 2px;
  cursor: pointer;
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

.logoEfiltros {
  display: flex;
  flex-direction: column; /* Alinha os itens em coluna */
  gap: 10px; /* Espaçamento entre os itens */
  justify-content: center; /* Alinha os itens no centro do contêiner verticalmente */
  align-items: center; /* Centraliza os itens horizontalmente */
  height: 100%; /* Garante que o contêiner ocupe toda a altura disponível */
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

.input-com-icone {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.icone-pesquisa {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  pointer-events: none;
  stroke: #888;
}

.barra-pesquisa {
  width: 100%;
  padding: 12px 15px 12px 45px;
  font-size: 18px;
  border-radius: 24px;
  border: 2px solid #ccc;
  border: 2px solid transparent;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.barra-pesquisa:focus {
  border-color: #ff7f26;
  outline: none;
}
</style>
