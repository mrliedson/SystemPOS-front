<template>
  <div class="container-registro-usuario">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="router.back()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <h1 class="title">DADOS DO USUÁRIO</h1>

    <!-- Nome -->
    <div class="text-input-container">
      <label for="nome" class="input-label">Nome completo: <text style="color: red">*</text></label>
      <input
        type="text"
        v-model="form.nome"
        id="nome"
        name="nome"
        :placeholder="nomePlaceholder"
        class="text-input"
        :class="{ 'campo-incorreto': !form.nome  && validado}"
      />
    </div>

    <!-- Telefone -->
    <div class="text-input-container">
      <label for="telefone" class="input-label">Telefone: <text style="color: red">*</text></label>
      <input
        type="text"
        v-model="form.telefone"
        id="telefone"
        name="telefone"
        :placeholder="telefonePlaceholder"
        class="text-input"
        :class="{ 'campo-incorreto': !form.telefone && validado}"
        v-maska="{ mask: ['(##) ####-####', '(##) #####-####'] }"
        inputmode="tel"
      />
    </div>

    <!-- WhatsApp -->
    <div class="checkbox-container">
      <label for="whatsapp" class="input-label checkbox-label">
        <input type="checkbox" id="whatsapp" v-model="form.whatsapp" />
        WhatsApp
      </label>
    </div>

    <!-- Gênero -->
    <div class="text-input-container">
      <label for="genero" class="input-label">Gênero: <text style="color: red">*</text></label>
      <UiSelect
        v-model="form.genero"
        :options="customOptions"
        :class="{ 'campo-incorreto': !form.genero  && validado}"
      />
    </div>

    <!-- Botão -->
    <UiButton class="next" label="Criar Cadastro" @click="handleSubmit()" />

    <!-- ✅ Mensagem de alerta -->
    <div v-if="mensagem" class="mensagem-alerta">
      <p>{{ mensagem }}</p>
      <button @click="mensagem = ''" class="botao-fechar">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import { UiButton, UiSelect } from '../components/index.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'
import { cadastroFuncionario } from '../stores/registroFuncionario.js'

const router = useRouter()
const customOptions = ref(['Masculino', 'Feminino'])

const form = ref({
  nome: '',
  telefone: '',
  whatsapp: false,
  genero: '',
})

const mensagem = ref('')

const nomePlaceholder = ref('Digite seu nome')
const telefonePlaceholder = ref('Digite seu telefone')
const validado = ref(false)

// Função para enviar cadastro
async function handleSubmit() {
  validado.value = true // ativa validação
  let valid = true

  if (!form.value.nome) {
    nomePlaceholder.value = 'Nome é obrigatório'
    valid = false
  }
  if (!form.value.telefone) {
    telefonePlaceholder.value = 'Telefone é obrigatório'
    valid = false
  }
  if (!form.value.genero) {
    mensagem.value = 'Selecione o gênero!'
    valid = false
  }

  if (!valid) return

  // Preenche dados na store
  cadastroFuncionario.value.dadosFuncionario.nome = form.value.nome
  cadastroFuncionario.value.dadosFuncionario.telefone = form.value.telefone
  cadastroFuncionario.value.dadosFuncionario.whatsapp = form.value.whatsapp
  cadastroFuncionario.value.dadosFuncionario.genero = form.value.genero

  try {
    await axios.post('http://localhost:3333/user', {
      nome: cadastroFuncionario.value.dadosFuncionario.nome,
      telefone: cadastroFuncionario.value.dadosFuncionario.telefone,
      whatsapp: cadastroFuncionario.value.dadosFuncionario.whatsapp,
      genero: cadastroFuncionario.value.dadosFuncionario.genero,
      codEmpresa: cadastroFuncionario.value.dadosLogin.codEmpresa,
      email: cadastroFuncionario.value.dadosLogin.email,
      nomeUsuario: cadastroFuncionario.value.dadosLogin.nomeUsuario,
      senha: cadastroFuncionario.value.dadosLogin.senha,
      tipo: cadastroFuncionario.value.dadosLogin.tipo,
    })
    mensagem.value = 'Cadastro concluído com sucesso!'
    router.push('/home')
  } catch (error) {
    console.error('Erro no cadastro:', error)
    mensagem.value = 'Erro ao enviar o cadastro. Tente novamente.'
  }
}
</script>

<style scoped>
.container-registro-usuario {
  margin: 0 auto;
  max-width: 600px;
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

/* Campos de erro */
.campo-incorreto {
  border-color: red;
}

.text-input::placeholder,
.UiSelect::placeholder {
  color: #d9534f;
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
  width: 24px;
  height: 24px;
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

/* ✅ Mensagem de alerta */
.mensagem-alerta {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #e64219;
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
}
</style>
