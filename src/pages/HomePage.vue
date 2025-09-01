<template>
  <div class="pai">
    <div v-if="mensagem" class="mensagem-alerta">
      {{ mensagem }}
    </div>

    <!-- Modal de Confirmação Logout -->
    <div v-if="mostrarConfirmLogout" class="overlay">
      <div class="modal">
        <p>Você realmente deseja sair da sua conta?</p>
        <div class="botoes-modal">
          <button class="sim" @click="logout">Sim</button>
          <button class="nao" @click="mostrarConfirmLogout = false">Não</button>
        </div>
      </div>
    </div>

    <!-- Botão Logout -->
    <button class="botao-logout" @click="confirmarLogout" aria-label="Logout">
      <svg viewBox="0 0 24 24">
        <path
          d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3H9v2h11v14H9v2h11c1.1
          0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
          fill="white"
        />
      </svg>
    </button>

    <button
      v-if="mostrarTrocarEmpresa"
      class="botao-trocar-empresa"
      @click="router.push('/escolherEmpresa')"
      aria-label="Trocar Empresa"
    >
      <svg viewBox="0 0 24 24">
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77
             L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="white"
        />
      </svg>
    </button>

    <div class="bemvindo">Bem Vindo, {{ usuario }}!</div>

    <div class="buttons">
      <UiButton
        v-if="form.adicionarUsuario"
        class="addUsuario"
        label="Adicionar usuário"
        @click="addUsuario"
      />

      <UiButton
        v-if="form.cadastrarEmpresa"
        class="addEmpresa"
        label="Adicionar empresa"
        @click="addEmpresa"
      />

      <UiButton
        v-if="form.adicionarPromocao"
        class="addPromocao"
        label="Adicionar Promoção"
        @click="AlterarPreco"
      />

      <UiButton
        v-if="form.prestesAVencer"
        class="vencimento"
        label="Prestes a vencer"
        @click="PrestesAVencer"
      />

      <UiButton
        v-if="form.adicionarProduto"
        class="addprodutos"
        label="Adicionar produto"
        @click="CadastroProdutos"
      />

      <UiButton
        v-if="form.reporEstoque"
        class="reporestoque"
        label="Repor Estoque"
        @click="ReporEstoque"
      />

      <UiButton
        v-if="form.relatorios"
        class="historico"
        label="Históricos"
        @click="ListarVendas"
      />

      <UiButton
        v-if="form.iniciarExpediente"
        class="expediente"
        label="Iniciar Expediente"
        @click="CaixaLivre"
      />
    </div>

    <button
      v-if="form.gerenciarPermissoes"
      class="botao-engrenagem"
      @click="abrirConfiguracoes"
      aria-label="Configurações"
    >
      <svg viewBox="0 0 24 24">
        <path
          d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.94-2.5c.04-.33.06-.66.06-1s-.02-.67-.06-1l2.03-1.58a.5.5 0 0 0 .11-.63l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.05 7.05 0 0 0-1.73-1L15.5 2.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5l-.38 2.43a7.05 7.05 0 0 0-1.73 1l-2.39-.96a.5.5 0 0 0-.6.22L2.92 8.42a.5.5 0 0 0 .11.63L5.06 10.63a7.44 7.44 0 0 0 0 2L3.03 14.2a.5.5 0 0 0-.11.63l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96a7.05 7.05 0 0 0 1.73 1l.38 2.43a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5l.38-2.43a7.05 7.05 0 0 0 1.73-1l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.11-.63l-2.03-1.58z"
          fill="white"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { UiButton } from '../components/index.js'
import { useRouter } from 'vue-router'
import { cadastroFuncionario } from '../stores/registroFuncionario.js'
import { emailDono } from '../stores/registroDono.js'
import axios from 'axios'

const mensagem = ref('')
const usuario = ref('')
const mostrarTrocarEmpresa = ref(false)
const mostrarConfirmLogout = ref(false)

const form = ref({
  adicionarUsuario: 1,
  adicionarPromocao: 1,
  adicionarProduto: 1,
  cadastrarEmpresa: 1,
  relatorios: 1,
  prestesAVencer: 1,
  reporEstoque: 1,
  iniciarExpediente: 1,
  gerenciarPermissoes: 1,
  desativarConta: 0,
})

const router = useRouter()

// Abre o modal de confirmação
const confirmarLogout = () => {
  mostrarConfirmLogout.value = true
}

// Executa logout
const logout = () => {
  mostrarConfirmLogout.value = false
  router.push('/loginPage')
}

const CadastroProdutos = () => router.push('/cadastroProduto')
const PrestesAVencer = () => router.push('/prestesAVencer')
const addUsuario = () => router.push('/register')
const addEmpresa = () => router.push('/dataStoreB')
const CaixaLivre = () => router.push('/CaixaLivre')
//const HistoricoPage = () => router.push('/historicoPage')
const abrirConfiguracoes = () => router.push('/listarUsuarios')
const ReporEstoque = () => router.push('/reporEstoque')
const AlterarPreco = () => router.push('/alterarPreco')
const ListarVendas = () => router.push('/listarVendas')

async function pegaNome() {
  try {
    const response = await axios.get(
      `http://localhost:3333/user/${cadastroFuncionario.value.dadosFuncionario.emailV}`,
    )
    let nomeCompleto = response.data.message[0].nome_completo
    usuario.value = nomeCompleto.split(' ')[0]
  } catch (error) {
    console.error('Erro ao buscar nome:', error)
  }
}

async function pegaPadroes() {
  try {
    const response = await axios.get(
      `http://localhost:3333/padroes/email/${cadastroFuncionario.value.dadosFuncionario.emailV}`,
    )
    const dados = response.data.message

    form.value = {
      adicionarUsuario: dados.adicionarUsuario,
      adicionarPromocao: dados.adicionarPromocao,
      adicionarProduto: dados.adicionarProduto,
      cadastrarEmpresa: dados.cadastrarEmpresa,
      relatorios: dados.relatorios,
      prestesAVencer: dados.prestesAVencer,
      reporEstoque: dados.reporEstoque,
      iniciarExpediente: dados.iniciarExpediente,
      gerenciarPermissoes: dados.gerenciarPermissoes,
      desativarConta: dados.ativo ? 0 : 1,
    }

    if (form.value.desativarConta) {
      mensagem.value = 'Sua conta está desativada! Logout em 3 segundos.'
      setTimeout(() => {
        router.push('/loginPage')
      }, 3000)
    }
  } catch (error) {
    console.error('Erro ao buscar padrões:', error)
  }
}

async function verificarTrocaEmpresa() {
  try {
    const respEmpresas = await axios.get(
      `http://localhost:3333/dono/${emailDono.value.dadosDono.codDono}`,
    )
    if (respEmpresas.data.message.length > 1) {
      mostrarTrocarEmpresa.value = true
    }
  } catch (err) {
    console.error('Erro ao verificar troca de empresa:', err)
  }
}

onMounted(() => {
  pegaPadroes()
  pegaNome()
  verificarTrocaEmpresa()
})
</script>

<style scoped>
.pai {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.bemvindo {
  color: white;
  font-weight: bold;
  font-size: 60px;
  text-align: center;
  position: absolute;
  top: 50px;
}

.mensagem-alerta {
  background-color: red;
  color: white;
  padding: 15px 25px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 8px;
  position: absolute;
  top: 80px;
  text-align: center;
  z-index: 2000;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  justify-items: center;
  margin-top: 100px;
}

.buttons > *:last-child:nth-child(odd) {
  grid-column: span 2;
}

.addUsuario,
.addPromocao,
.vencimento,
.addprodutos,
.reporestoque,
.historico,
.expediente,
.addEmpresa {
  background-color: white;
  color: black;
  font-weight: bold;
  width: 400px;
  height: 80px;
  text-align: center;
  font-size: 24px;
}

/* Botão Logout */
.botao-logout {
  width: 70px;
  height: 70px;
  background-color: #d9534f;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
  transition: background-color 0.2s ease;
  z-index: 1000;
}

.botao-logout:hover {
  background-color: #c9302c;
}

.botao-logout svg {
  width: 30px;
  height: 30px;
}

.botao-engrenagem {
  width: 60px;
  height: 60px;
  background-color: #444;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 1000;
}

.botao-engrenagem:hover {
  background-color: #666;
}

.botao-engrenagem svg {
  width: 30px;
  height: 30px;
  fill: white;
}

.botao-trocar-empresa {
  width: 60px;
  height: 60px;
  background-color: #444;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 1000;
}

.botao-trocar-empresa:hover {
  background-color: #666;
}

.botao-trocar-empresa svg {
  width: 28px;
  height: 28px;
}

/* Modal de Confirmação Logout */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
}

.modal {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  width: 400px;
}

.modal p {
  font-size: 20px;
  margin-bottom: 20px;
}

.botoes-modal button {
  margin: 0 10px;
  padding: 10px 25px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.botoes-modal .sim {
  background-color: #d9534f;
  color: white;
}

.botoes-modal .sim:hover {
  background-color: #c9302c;
}

.botoes-modal .nao {
  background-color: #6c757d;
  color: white;
}

.botoes-modal .nao:hover {
  background-color: #5a6268;
}
</style>
