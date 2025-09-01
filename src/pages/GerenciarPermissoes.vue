<template>
  <div class="container-registro-usuario">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="router.back()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <h1 class="title">Quais permissões {{ usuario }} deve ter?</h1>

    <!-- Container dos checkboxes em 2 colunas -->
    <div class="checkboxes-grid">
      <div v-for="(label, key) in permissions" :key="key" class="checkbox-container">
        <label :for="key" class="input-label checkbox-label">
          <input type="checkbox" :id="key" v-model="form[key]" :true-value="1" :false-value="0" />
          {{ label }}
        </label>
      </div>
    </div>

    <!-- Botão -->
    <UiButton class="next" label="Atribuir" @click="handleSubmit" />
  </div>
</template>

<script setup>
import { UiButton } from '../components/index.js'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { emailDono } from '../stores/registroDono.js'

const router = useRouter()

// Estrutura de permissões
const permissions = {
  adicionarUsuario: 'Adicionar usuário',
  adicionarPromocao: 'Adicionar promoção',
  adicionarProduto: 'Adicionar produto',
  cadastrarEmpresa: 'Cadastrar Empresa',
  relatorios: 'Relatórios',
  prestesAVencer: 'Prestes a vencer',
  reporEstoque: 'Repor estoque',
  iniciarExpediente: 'Iniciar expediente',
  gerenciarPermissoes: 'Gerenciar permissões',
  desativarConta: 'Desativar conta',
}

const form = ref({
  // Inicializa todas as permissões com 0
  adicionarUsuario: 0,
  adicionarPromocao: 0,
  adicionarProduto: 0,
  cadastrarEmpresa: 0,
  relatorios: 0,
  prestesAVencer: 0,
  reporEstoque: 0,
  iniciarExpediente: 0,
  gerenciarPermissoes: 0,
  desativarConta: 0,
})

// const mensagem = ref('')
const usuario = ref('')
const mensagem = ref('')

// Função para pegar o nome do usuário
async function pegaNome() {
  try {
    const response = await axios.get(
      `http://localhost:3333/user/${emailDono.value.dadosDono.email}`,
    )
    let nomeCompleto = response.data.message[0].nome_completo
    usuario.value = nomeCompleto.split(' ')[0]
  } catch (error) {
    console.error('Erro ao buscar nome:', error)
  }
}

// Função para pegar os padrões (permissões)
async function pegaPadroes() {
  try {
    const response = await axios.get(
      `http://localhost:3333/padroes/email/${emailDono.value.dadosDono.email}`,
    )
    const dados = response.data.message

    Object.keys(permissions).forEach((key) => {
      if (key === 'desativarConta') {
        // Aqui você define o checkbox "desativarConta" com base no campo 'ativo' do BD
        form.value.desativarConta = dados.ativo === 0 ? 1 : 0
      } else {
        form.value[key] = dados[key]
      }
    })
  } catch (error) {
    console.error('Erro ao buscar padrões:', error)
  }
}

// Função de envio dos dados
async function handleSubmit() {
  try {
    const response = await axios.get(
      `http://localhost:3333/padroes/email/${emailDono.value.dadosDono.email}`,
    )
    const dados = response.data.message

    if (form.value.desativarConta) {
      await axios.delete(`http://localhost:3333/padroes/${dados.id}`)
    } else {
      const dadosParaEnviar = { ...form.value }
      delete dadosParaEnviar.desativarConta
      dadosParaEnviar.ativo = form.value.desativarConta ? 0 : 1
      await axios.put(`http://localhost:3333/padroes/${dados.id}`, dadosParaEnviar)
    }

    mensagem.value = 'Cadastro concluído com sucesso!'
    router.push('/atribuicaoSucesso')
  } catch (error) {
    console.error('Erro ao enviar o cadastro:', error)
    mensagem.value = 'Erro ao enviar o cadastro. Tente novamente.'
  }
}

onMounted(() => {
  pegaPadroes()
  pegaNome()
})
</script>

<style scoped>
.container-registro-usuario {
  margin: 0 auto;
  max-width: 60%;
  width: 90%;
  padding: 20px;
  box-sizing: border-box;
}

.title {
  text-align: center;
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin-bottom: 30px;
}

.text-input-container {
  margin-bottom: 20px;
}

.input-label {
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 8px;
  display: block;
}

.text-input,
.UiSelect {
  width: 100%;
  height: 50px;
  font-size: 16px;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 24px;
  cursor: text;
  transition: border-color 0.3s ease-in-out;
  box-sizing: border-box;
}

.text-input:focus {
  border-color: #ff7f26;
  outline: none;
}

.checkbox-container {
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  color: #ffffff;
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: 50px;
  height: 50px;
  accent-color: #ff7f26;
  cursor: pointer;
}

.next {
  display: block;
  width: 60%;
  max-width: 300px;
  height: 60px;
  margin: 30px auto 0 auto;
  background-color: #ff7f26;
  border-radius: 24px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  text-align: center;
}

.next:hover {
  background-color: #b14a01;
}

.next:active {
  background-color: #ff7f26;
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

.checkboxes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;
  width: max-content;
  margin: 0 auto;
}
</style>
