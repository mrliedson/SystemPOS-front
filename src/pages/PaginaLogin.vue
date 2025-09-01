<template>
  <div class="paginalogin-container">
    <div class="flex flex-center column q-pa-md full-height">
      <div class="q-mb-xl">
        <img
          src="../assets/user.png"
          alt="Foto do usuario"
          class="q-mt-lg"
          style="width: 180px; height: auto;"
        />
      </div>
      <div
        class="q-pa-lg column q-gutter-md"
        style="max-width: 500px; width: 100%; border-radius: 12px;"
      >
        <!-- Email -->
        <div>
          <label class="input-label">Email ou nome de usuário:</label>
          <input
            type="text"
            v-model="form.email"
            placeholder="Digite seu email"
            class="input-field"
            autocomplete="username"
          />
        </div>
        <!-- Senha -->
        <div class="senha">
          <label class="input-label">Senha:</label>
          <input
            type="password"
            v-model="form.senha"
            placeholder="Digite sua senha"
            class="input-field"
            autocomplete="current-password"
          />
        </div>
        <router-link to="/redefinirSenha" class="forgot-password">Esqueci senha</router-link>
        <div class="btn-container">
          <UiButton
            :label="isLoading ? 'Entrando...' : 'Entrar'"
            :disabled="isLoading"
            class="btn"
            @click="login"
          />
        </div>
      </div>
      <!-- Mensagem de erro/alerta -->
      <div v-if="mensagem" class="mensagem-alerta">
        <p>{{ mensagem }}</p>
        <button @click="mensagem = ''" class="botao-fechar">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { UiButton } from '../components/index.js'
import { cadastroFuncionario } from '../stores/registroFuncionario.js'
import { emailDono } from '../stores/registroDono.js'

const router = useRouter()

const form = ref({
  email: '',
  senha: '',
})

const isLoading = ref(false)
const mensagem = ref('')

const login = async () => {
  if (isLoading.value) return

  const loginInput = form.value.email.trim() // Pode ser email ou usuario.userLogin
  const senha = form.value.senha.trim()

  if (!loginInput || !senha) {
    mensagem.value = 'Preencha todos os campos!'
    return
  }

  if (senha.length < 8) {
    mensagem.value = 'A senha deve ter pelo menos 8 caracteres!'
    return
  }

  // Verifica se é email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmail = emailRegex.test(loginInput)

  isLoading.value = true

  try {
    let response
    if (isEmail) {
      response = await axios.get(`http://localhost:3333/user/${loginInput}`)
    } else {
      response = await axios.get(`http://localhost:3333/user/nameUser/${loginInput}`)
    }

    const usuario = response.data.message?.[0]

    if (!usuario || !usuario.senha_hash) {
      mensagem.value = 'Usuário não cadastrado ou erro ao buscar os dados!'
      return
    }

    if (senha !== usuario.senha_hash) {
      mensagem.value = 'Senha incorreta. Tente novamente!'
      return
    }

    if (usuario.tipo === 'dono') {
      emailDono.value.dadosDono.codDono = usuario.dono_id

      const res = await axios.get(`http://localhost:3333/dono/${usuario.dono_id}`)
      const empresas = res.data.message

      if (empresas.length > 1) {
        cadastroFuncionario.value.dadosFuncionario.emailV = usuario.email
        router.push('/escolherEmpresa')
        return
      } else if (empresas.length === 1) {
        await axios.put(`http://localhost:3333/dono`, {
          codEmpresa: empresas[0].e_id,
          codDono: usuario.dono_id,
        })
        cadastroFuncionario.value.dadosLogin.codEmpresa = empresas[0].e_id
        cadastroFuncionario.value.dadosFuncionario.emailV = usuario.email

        router.push('/home')
        return
      } else {
        mensagem.value = 'Nenhuma empresa cadastrada para este dono.'
        return
      }
    }

    cadastroFuncionario.value.dadosLogin.codEmpresa = usuario.empresa_id
    cadastroFuncionario.value.dadosFuncionario.emailV = usuario.email

    router.push('/home')
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    mensagem.value = 'Erro ao conectar com o servidor!'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.paginalogin-container {
  margin: 0;
  padding: 0;
  min-height: 100vh; /* Garante que o body tenha pelo menos a altura da tela */
  background-image: url('../assets/fundoTCClogin.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}

.input-field {
  width: 100%;
  height: 50px;
  font-size: 16px;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 24px;
  cursor: text; /* cursor de texto para input */
  transition: border-color 0.3s ease-in-out;
}

.input-field:focus {
  border-color: #e7d04d;
  outline: none;
}

.forgot-password {
  text-align: left;
  font-size: 0.9rem;
  color: #e7d04d;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-container {
  display: flex;
  justify-content: center;
}

.btn {
  background-color: #ff7f26;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #b14a01;
}

.btn:active {
  background-color: #ff7f26;
}

/* Mensagem de alerta */
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

@media (max-width: 480px) {
  .uilogo img {
    width: 80px;
  }

  .form {
    padding: 15px;
    gap: 10px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
