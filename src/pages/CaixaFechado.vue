<template>
  <div class="container">
    <!-- Botão de Logout -->
    <button class="botao-voltar" @click="router.back()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <h1 class="title">Caixa fechado</h1>
    <h4 class="frase">Logo mais estaremos de volta!</h4>

    <div class="botoes">
    <UiButton
      label="Abrir caixa"
      class="btn"
      @click="CaixaLivre"
    />
  </div>
  </div>


</template>

<script setup>
import { useRouter } from 'vue-router'
import { UiButton } from '../components/index.js'

const router = useRouter()

const CaixaLivre = () => {
  router.push('/CaixaLivre'); // Redireciona para a rota desejada
}

</script>

<style scoped>
html, body {
  overflow: hidden;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #000;
}
.logout {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: red;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  width: 80px;
}

.logout:hover {
  background-color: darkred;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Deixa o conteúdo mais pro topo */
  align-items: center;
  height: 100%;
  padding-top: 80px; /* Distância entre o topo da tela e o título */
}

.title {
  padding-top: 10%;
  color: white;
  font-size: 200px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5%;
}
.frase {
  color: white;
  font-size: 50px;
  font-weight: bold;
  text-align:end;
  margin-left:20%;
}

.uilogo-main {
  width: 500px; /* Aumentei mais a largura da logo */
  height: auto;
  margin-top: 50px; /* Faz a logo descer mais ainda abaixo do título */
}

.botoes {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
