<template>
  <div class="container-data-store">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="goHome" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <h1 class="title">CADASTRO DE CLIENTE</h1>

    <div class="form-row">
      <div class="form-group full-width">
        <label class="input-label">Nome: <text style="color: red;">*</text></label>
        <input 
          type="text" 
          v-model="form.nome" 
          :placeholder="nomePlaceholder"
          class="text-input" 
          :class="{ 'campo-incorreto': !form.nome && validado}" 
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="input-label">CPF:</label>
        <input 
          type="text" 
          v-model="form.cpf" 
          placeholder="Digite o CPF do cliente"
          class="text-input"
        />
      </div>

      <div class="form-group">
        <label class="input-label">Telefone:</label>
        <input 
          type="text" 
          v-model="form.telefone" 
          placeholder="Digite o telefone"
          class="text-input" 
          :class="{ 'campo-incorreto': !form.telefone && validado}"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group full-width">
        <label class="input-label">Email: <text style="color: red;">*</text></label>
        <input 
          type="text" 
          v-model="form.email" 
          :placeholder="emailPlaceholder"
          class="text-input"
          :class="{ 'campo-incorreto': !form.email && validado}" 
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group full-width">
        <label class="input-label">Endereço: <text style="color: red;">*</text></label>
        <input 
          type="text" 
          v-model="form.endereco" 
          :placeholder="enderecoPlaceholder"
          class="text-input"
          :class="{ 'campo-incorreto': !form.endereco && validado}" 
        />
      </div>
    </div>

    <!-- Botão de enviar -->
    <div class="botao-container">
      <UiButton class="next" label="Cadastrar" @click="handleNext" />
    </div>

    <!-- Mensagem de alerta -->
    <div v-if="mensagem" class="mensagem-alerta">
      <p>{{ mensagem }}</p>
      <button @click="mensagem = ''" class="botao-fechar">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'
import { cadastroFuncionario } from 'src/stores/registroFuncionario.js'
import { UiButton } from '../components/index.js'

const router = useRouter()
const mensagem = ref('')

const form = ref({
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  endereco: '',
})

const nomePlaceholder = ref('Digite o nome do cliente')
const telefonePlaceholder = ref('Digite o telefone do cliente')
const emailPlaceholder = ref('Digite o email do cliente')
const enderecoPlaceholder = ref('Digite o endereço do cliente')
const validado = ref(false)

function handleNext() {
  validado.value = true
  let valid = true

  if (!form.value.nome) {
    nomePlaceholder.value = 'Nome é obrigatório'
    valid = false
  }
  if (!form.value.telefone) {
    telefonePlaceholder.value = 'Telefone é obrigatório'
    valid = false
  }
  if (!form.value.email) {
    emailPlaceholder.value = 'Email é obrigatório'
    valid = false
  }
  if (!form.value.endereco) {
    enderecoPlaceholder.value = 'Endereço é obrigatório'
    valid = false
  }

  if (!valid) return

  // Pegar empresa_id da store
  const empresa_id = cadastroFuncionario.value.dadosLogin.codEmpresa
  console.log(empresa_id)

  if (!empresa_id) {
    mensagem.value = 'Não foi possível identificar a empresa do usuário.'
    return
  }

  const payload = {
    empresa_id,
    nome: form.value.nome,
    cpf: form.value.cpf,
    telefone: form.value.telefone,
    email: form.value.email,
    endereco: form.value.endereco,
  }

  axios.post('http://localhost:3333/clientes', payload)
    .then(() => {
      mensagem.value = 'Cliente cadastrado com sucesso!'
      router.push('/CaixaLivre') // ou outra rota
    })
    .catch((error) => {
      console.error(error)
      mensagem.value = 'Erro ao cadastrar cliente, tente novamente.'
    })
}

const goHome = () => {
  router.push('/home')
}
</script>


<style scoped>
.container-data-store {
  max-width: 900px;
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  color: white;
}

.title {
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}

.form-row {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.form-group {
  flex: 1 1 400px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
}

.full-width {
  flex-basis: 100%;
  min-width: 0;
}

.input-label {
  font-size: 18px;
  margin-bottom: 8px;
}

.text-input {
  height: 55px;
  font-size: 16px;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 24px;
  cursor: text;
  transition: border-color 0.3s ease-in-out;
  box-sizing: border-box;
  width: 100%;
}

.text-input:focus {
  border-color: #ff7f26;
  outline: none;
}

.botao-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.next {
  width: 250px;
  height: 60px;
  background-color: #ff7f26;
  border-radius: 24px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease-in-out;
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

.mensagem-alerta {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #e64219;
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
}

.botao-fechar {
  background: white;
  color: #e64219;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.botao-fechar:hover {
  background: #eee;
}

.campo-incorreto {
  border: 2px solid red !important;
}

.campo-incorreto::placeholder {
  color: red;
}
</style>
