<template>
  <div class="container-registro-prop">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="router.back()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <h1 class="title">DADOS DO PROPRIETÁRIO</h1>

    <div class="form-row">
      <!-- Nome -->
      <div class="form-group">
        <label class="input-label">Nome Completo: <text style="color: red">*</text></label>
        <input type="text" v-model="form.nome" placeholder="Digite seu nome" class="text-input" />
      </div>

      <!-- Telefone -->
      <div class="form-group">
        <label class="input-label">Telefone: <text style="color: red">*</text></label>
        <input
          type="text"
          v-model="form.telefone"
          placeholder="Digite seu telefone"
          class="text-input"
        />
      </div>
    </div>

    <div class="form-row">
      <!-- CPF -->
      <div class="form-group">
        <label class="input-label">CPF: <text style="color: red">*</text></label>
        <input type="text" v-model="form.cpf" placeholder="Digite seu CPF" class="text-input" />
      </div>

      <!-- WhatsApp -->
      <div class="form-group">
        <label class="input-label">WhatsApp:</label>
        <input type="checkbox" v-model="form.whatsapp" class="checkbox-input" />
      </div>
    </div>

    <div class="form-row">
      <!-- Data de Nascimento -->
      <div class="form-group">
        <label class="input-label">Data de Nascimento: <text style="color: red">*</text></label>
        <input
          type="date"
          v-model="form.dataNascimento"
          placeholder="Digite sua data de nascimento"
          class="text-input"
        />
      </div>

      <!-- Gênero -->
      <div class="form-group">
        <label class="input-label">Gênero: <text style="color: red">*</text></label>
        <UiSelect v-model="form.genero" :options="customOptions" />
      </div>
    </div>

    <div class="form-row">
      <!-- Endereço -->
      <div class="form-group">
        <label class="input-label">Endereço: <text style="color: red">*</text></label>
        <input
          type="text"
          v-model="form.endereco"
          placeholder="Digite seu endereço completo"
          class="text-input"
        />
      </div>

      <!-- Código do dono -->
      <div class="form-group">
        <label class="input-label">Código do dono: <text style="color: red">*</text></label>
        <input
          type="text"
          v-model="form.codDono"
          placeholder="Digite o código do dono"
          class="text-input"
        />
      </div>
    </div>

    <!-- Botão -->
    <UiButton class="next" label="Próximo" @click="handleNext" />

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
import { cadastroFuncionario } from '../stores/registroFuncionario.js'
import { cadastroDono, emailDono } from '../stores/registroDono.js'

const router = useRouter()
const customOptions = ref(['Masculino', 'Feminino'])
const mensagem = ref('')

const form = ref({
  nome: '',
  telefone: '',
  whatsapp: false,
  genero: '',
  cpf: '',
  dataNascimento: '',
  endereco: '',
  codDono: '',
})

async function handleNext() {
  if (
    !form.value.nome ||
    !form.value.telefone ||
    !form.value.cpf ||
    !form.value.dataNascimento ||
    !form.value.endereco ||
    !form.value.codDono
  ) {
    mensagem.value = 'Preencha todos os campos obrigatórios!'
    return
  }
  if (!form.value.telefone.length > 20) {
    mensagem.value = 'Coloque um telefone valido!'
    return
  }
  if (!form.value.cpf.length > 11) {
    mensagem.value = 'Coloque um cpf valido!'
    return
  }
  // Validação de data de nascimento
  const hoje = new Date()
  const dataNas = new Date(form.value.dataNascimento)
  hoje.setHours(0, 0, 0, 0)
  dataNas.setHours(0, 0, 0, 0)

  if (dataNas > hoje) {
    mensagem.value = 'A data de nacimento não pode ser posterior à data atual.'
    return
  }

  cadastroFuncionario.value.dadosFuncionario.nome = form.value.nome
  cadastroFuncionario.value.dadosFuncionario.telefone = form.value.telefone
  cadastroFuncionario.value.dadosFuncionario.whatsapp = form.value.whatsapp
  cadastroFuncionario.value.dadosFuncionario.genero = form.value.genero

  cadastroDono.value.dadosDono.cpf = form.value.cpf
  cadastroDono.value.dadosDono.dataNascimento = form.value.dataNascimento
  cadastroDono.value.dadosDono.endereco = form.value.endereco
  emailDono.value.dadosDono.codDono = form.value.codDono

  router.push('/dataStore')
}
</script>

<style scoped>
.container-registro-prop {
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

.checkbox-input {
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
  border: none;
  cursor: pointer;
  color: white;
  text-align: center;
  transition: background-color 0.3s ease-in-out;
}

.next:hover {
  background-color: #b14a01;
}

.next:active {
  background-color: #ff7f26;
}

.voltar {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #ff7f26;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 35px;
  width: 80px;
  font-size: 32px;
}

.voltar:hover {
  background-color: #b14a01;
}

.voltar:active {
  background-color: #ff7f26;
}

@media (max-width: 800px) {
  .form-row {
    flex-direction: column;
  }

  .form-group {
    min-width: 100% !important;
  }
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
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
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
