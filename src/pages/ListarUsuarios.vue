<template>
  <div class="tela">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="goHome()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <!-- Título -->
    <h1 class="title">USUÁRIOS DO SISTEMA</h1>

    <!-- Lista de usuarios -->
    <div class="scrollview">
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

      <div class="item" v-for="usuario in usuariosFiltrados" :key="usuario.codigo_barras">
        <div class="row">
          <div class="info">
            <div class="dado">
              <strong>Nome:</strong> <br />
              {{ usuario.nome_completo }}
            </div>
            <div class="dado">
              <strong>Telefone:</strong> <br />
              {{ usuario.telefone }}
            </div>
            <div class="dado">
              <strong>Tipo:</strong> <br />
              {{ usuario.tipo }}
            </div>
            <div class="dado">
              <strong>Status:</strong> <br />
              <span :class="['status', usuario.ativo === 1 ? 'verde' : 'vermelho']">
                {{ Ativo(usuario) }}
              </span>
            </div>

            <!-- <div class="dado" v-if="form.gerenciarPermissoes === 1"> -->
            <div class="dado">
              <button class="vencer" @click="GerenciarPermissoes(usuario)">
                Editar permissões
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Se lista estiver vazia -->
      <div v-if="usuarios.length === 0" class="sem-usuarios">Nenhum usuario cadastrado.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { emailDono } from '../stores/registroDono.js'
import { cadastroFuncionario } from '../stores/registroFuncionario.js'

const filtro = ref('')
const usuarios = ref([])

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter((usuario) =>
    usuario.nome_completo.toLowerCase().includes(filtro.value.toLowerCase()),
  )
})

const router = useRouter()
const goHome = () => router.push('/home')

const Ativo = (usuario) => {
  return usuario.ativo === 1 ? 'Ativo' : 'Desativado'
}

const GerenciarPermissoes = (usuario) => {
  emailDono.value.dadosDono.email = usuario.email
  router.push('/GerenciarPermissoes')
}

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:3333/user/LU/${cadastroFuncionario.value.dadosLogin.codEmpresa}`,
    )
    usuarios.value = response.data.message
  } catch (error) {
    console.error('Erro ao buscar os usuários:', error)
  }
})
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
  width: 70%;
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

.sem-usuarios {
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
