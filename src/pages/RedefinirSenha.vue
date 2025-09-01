<template>
  <div class="container">
    <button class="botao-voltar" @click="router.back()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="uilogo">
      <img src="../assets/cadeadoB.png" alt="User Logo" />
    </div>

    <h1>Redefinir senha!</h1>

    <div class="form">
      <label for="email" class="input-label">Digite o email cadastrado:</label>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Digite seu email"
        class="input-field"
        autocomplete="email"
      />
      <div class="btn-container">
        <UiButton label="Enviar Token" class="btn" @click="redefinirSenha" />
      </div>
      <!-- ✅ Mensagem de alerta -->
      <div v-if="mensagem" class="mensagem-alerta">
        <p>{{ mensagem }}</p>
        <button @click="mensagem = ''" class="botao-fechar">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UiButton } from '../components/index.js'
import { cadastroFuncionario } from '../stores/registroFuncionario.js'
import axios from 'axios'

const router = useRouter()
const mensagem = ref('')
const email = ref('')

const redefinirSenha = async () => {
  if (!email.value) {
    mensagem.value = 'Por favor, preencha o email'
    return
  }
  try {
    const response = await axios.get(`http://localhost:3333/user/${email.value}`)
    const usuario = response.data.message?.[0]

    if (usuario && usuario.email === email.value) {
      await axios.post(`http://localhost:3333/enviar-token`, {
        email: email.value,
      })
      cadastroFuncionario.value.dadosLogin.emailToken = email.value
      router.push('/verifiqueEmail')
    } else {
      mensagem.value = 'Digite um e-mail válido ou já cadastrado!'
    }
  } catch (error) {
    console.error('Erro ao buscar e-mail:', error)
    mensagem.value = 'E-mail não encontrado na base de dados.'
  }
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-image: url('../assets/fundoTCClogin.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 600px;
  margin: auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
}

.uilogo img {
  width: 150px;
  margin-bottom: 20px;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-label {
  font-size: 18px;
  margin-bottom: 6px;
}

.input-field {
  width: 100%;
  height: 50px;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 24px;
  border: 2px solid transparent;
  transition: border-color 0.3s ease-in-out;
  outline: none;
  cursor: text;
}

.input-field:focus {
  border-color: #e7d04d;
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
.btn-container {
  display: flex;
  justify-content: center;
}
</style>
