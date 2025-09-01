<template>
  <div class="container-data-store">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="goHome" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <h1 class="title">DADOS DA LOJA</h1>

    <div class="form-row">
      <!-- Razão Social -->
      <div class="form-group full-width">
        <label class="input-label">Razão Social: <text style="color: red;">*</text></label>
        <input type="text" v-model="form.razaoSocial" placeholder="Digite a razão" class="text-input" />
      </div>
    </div>

    <div class="form-row">
      <!-- Nome Fantasia -->
      <div class="form-group full-width">
        <label class="input-label">Nome Fantasia: <text style="color: red;">*</text></label>
        <input type="text" v-model="form.nomeFantasia" placeholder="Digite o nome" class="text-input" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <!-- CNPJ -->
        <label class="input-label">CNPJ:</label>
        <input type="text" v-model="form.cnpj" placeholder="Digite o CNPJ" class="text-input" />

        <!-- Telefone -->
        <label class="input-label">Telefone: <text style="color: red;">*</text></label>
        <input type="text" v-model="form.telefone" placeholder="Digite o telefone da loja" class="text-input" />

        <!-- WhatsApp -->
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.whatsapp" />
          WhatsApp
        </label>
      </div>

      <!-- Código do dono -->
      <div class="form-group">
        <label class="input-label">Código da empresa: <text style="color: red;">*</text></label>
        <input type="text" v-model="form.codEmpresa" placeholder="Digite o código do dono" class="text-input" />
      </div>
    </div>

    <!-- Botão Próximo -->
    <UiButton class="next" label="Próximo" @click="handleNext" />

    <!-- ✅ Mensagem de alerta -->
    <div v-if="mensagem" class="mensagem-alerta">
      <p>{{ mensagem }}</p>
      <button @click="mensagem = ''" class="botao-fechar">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { cadastroLoja } from '../stores/registroLoja.js'
import { UiButton } from '../components/index.js'

const router = useRouter()
const mensagem = ref('')

const form = ref({
  razaoSocial: '',
  nomeFantasia: '',
  telefone: '',
  whatsapp: false,
  cnpj: '',
  codEmpresa: '',
})

function handleNext() {
  if (
    !form.value.razaoSocial ||
    !form.value.nomeFantasia ||
    !form.value.telefone ||
    !form.value.cnpj ||
    !form.value.codEmpresa
  ) {
    mensagem.value = 'Preencha todos os campos obrigatórios!'
    return
  }

  cadastroLoja.value.dadosLoja = { ...form.value }
  router.push('/adressStore')
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

.checkbox-label {
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
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
