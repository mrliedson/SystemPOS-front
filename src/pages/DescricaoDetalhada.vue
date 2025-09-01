<template>
  <div class="tela">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="router.back()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="tudo">
      <div class="pesquisar">
        <!-- Imagem e nome do produto -->
        <div class="Box-laranja">
          <h1 class="title">{{ produto.nome }}</h1>
          <div class="img">
            <img :src="produto.imagem" alt="Imagem do produto" />
          </div>
        </div>
      </div>

      <div class="logoEfiltros">
        <!-- Informações do produto selecionado -->
        <q-list bordered separator class="lista-produto-selecionado">
          <q-item>
            <q-item-section>
              <q-item-label><strong>Nome:</strong> {{ produto.nome }}</q-item-label>
              <q-item-label><strong>Marca:</strong> {{ produto.marca }}</q-item-label>
              <q-item-label><strong>Tipo:</strong> {{ produto.tipo_produto }}</q-item-label>
              <q-item-label><strong>Modelo:</strong> {{ produto.modelo }}</q-item-label>
              <q-item-label
                ><strong>Código de barras:</strong> {{ produto.codigo_barras }}</q-item-label
              >
              <q-item-label><strong>Quantidade:</strong> {{ produto.quantidade }}</q-item-label>
              <q-item-label
                ><strong>Código do produto:</strong> {{ produto.codigo_produto }}</q-item-label
              >
              <q-item-label><strong>Categoria:</strong> {{ produto.categoria }}</q-item-label>
              <q-item-label>
                <strong>Data de validade:</strong>
                {{ new Date(produto.data_validade).toLocaleDateString('pt-BR') }}
              </q-item-label>
              <q-item-label><strong>Preço:</strong> R$ {{ produto.preco }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { reporEstoque } from '../stores/registroProduto.js'
import { cadastroFuncionario } from 'src/stores/registroFuncionario.js'

const router = useRouter()
const produto = ref({})

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:3333/produto/DD/${reporEstoque.value.dadosDescricao.codigo_barras}`,
      {
        params: {
          codEmpresa: cadastroFuncionario.value.dadosLogin.codEmpresa,
        },
      },
    )

    produto.value = response.data.message[0]
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  }
})
</script>

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
.title {
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin: 20px 0 10px 0;
}
.logo {
  width: 80%;
  height: 80%;
  object-fit: cover;
}
/* Ajuste para a Box-laranja ocupar quase toda a área disponível */
.Box-laranja {
  background-color: #ff7f26;
  border-radius: 24px;
  width: 90%; /* 90% da largura da viewport */
  height: 90vh; /* 70% da altura da viewport */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  gap: 2em; /* espaço entre as linhas de botões */
  margin: 0 auto;
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
  width: 90%; /* Ocupa quase toda a largura da Box-laranja */
  height: 70vh; /* Altura proporcional à tela */
  display: flex;
  justify-content: center;
  align-items: center;
}

.img img {
  height: 100%;
  width: 100%;
  max-height: 100%;
  object-fit: contain; /* Mantém proporção da imagem */
  border-radius: 16px; /* Opcional: borda arredondada para ficar bonitinha */
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
  margin-right: 5%;

  width: 50%; /* Igual ao da Box-laranja, se tiver */
  margin: 0 auto;

  height: 90vh; /* <-- Garantido mesmo valor da Box-laranja */
}

#valorAtual,
#novoValor {
  align-self: flex-start; /* Alinha à direita se estiver num container com flex-direction: column */
}

.botao-proximo {
  margin-top: 20px;
  width: 60%;
  max-width: 300px;
  height: 60px;
  padding: 12px 24px;
  font-size: 18px;
  border-radius: 24px;
  background-color: #ff7f26;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-end; /* Alinha à direita se estiver num container com flex-direction: column */
}

.botao-proximo:hover {
  background-color: #cf7215;
}
.lista-produto-selecionado {
  width: 100%;
  height: 90vh; /* Altura igual à da Box-laranja */
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 50px;
  line-height: 5;
  font-family: 'Poppins', sans-serif;
  overflow-y: auto; /* Adiciona scroll se ultrapassar */
  margin-top: 2%;
  margin-right: 5%;
}
</style>
