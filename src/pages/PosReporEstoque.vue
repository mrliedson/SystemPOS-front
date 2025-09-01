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
          <h1 class="title">{{ dadosEstoque.nome }}</h1>
          <div class="img"><img :src="dadosEstoque.imagem" alt="Imagem do produto" /></div>
        </div>
      </div>

      <div class="logoEfiltros">
        <img class="logo" src="../assets/logo.png" alt="Logo SystemPOS" />

        <h1 class="title" id="valorAtual">Quantidade atual:</h1>
        <input class="text-input" type="text" :value="dadosEstoque.quantidadeNova" disabled />

        <button @click="repor()" class="botao-proximo">Pronto</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { reporEstoque } from '../stores/registroProduto.js'
import axios from 'axios'

const router = useRouter()
const dadosEstoque = reporEstoque.value.dadosEstoque

const repor = async () => {
  try {
    await axios.put(`http://localhost:3333/produto/RE/${dadosEstoque.id}`, {
      quantidade: dadosEstoque.quantidadeNova,
    })
    router.push('/home')
  } catch (error) {
    console.error('Erro ao repor estoque:', error)
    alert('Erro ao atualizar o estoque.')
  }
}
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
  width: 100%;
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
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  gap: 2em;
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
  width: 90%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img img {
  height: 100%;
  width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 16px;
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
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: 5%;
}

#valorAtual,
#novoValor {
  align-self: flex-start;
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
  align-self: flex-end;
}

.botao-proximo:hover {
  background-color: #cf7215;
}

/* Estilo para o input desabilitado */
.text-input:disabled {
  background-color: #f0f0f0; /* Cor de fundo mais visível */
  color: #333; /* Cor da fonte mais escura para maior contraste */
  font-weight: bold; /* Aumenta a legibilidade */
  border: 2px solid #ccc; /* Borda mais visível */
  padding: 10px;
  border-radius: 24px; /* Borda arredondada igual ao outro input */
  cursor: not-allowed; /* Cursor desabilitado */
  opacity: 0.7; /* Diminui a opacidade para indicar que o campo está desabilitado */
}
</style>
