<template>
  <div class="container-adress">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="router.back()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <h1 class="title">ENDEREÇO DA LOJA</h1>

    <div class="form-row">
      <div class="form-group">
        <label class="input-label">CEP: <text style="color: red">*</text></label>
        <input
        type="text"
        v-model="form.cep"
        :placeholder="CEPPlaceholder"
        class="text-input"
        :class="{ 'campo-incorreto': !form.cep && validado}"/>
      </div>

      <div class="form-group">
        <label class="input-label">Logradouro:</label>
        <input
          type="text"
          v-model="form.logradouro"
          placeholder="Digite o logradouro"
          class="text-input"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="input-label">Estado: <text style="color: red">*</text></label>
        <input
        type="text"
        v-model="form.estado"
        :placeholder="estadoPlaceholder"
        class="text-input"
        :class="{ 'campo-incorreto': !form.estado && validado}"/>
      </div>

      <div class="form-group">
        <label class="input-label">Número: <text style="color: red">*</text></label>
        <input
        type="text"
        v-model="form.numero"
        :placeholder="numeroPlaceholder"
        class="text-input"
        :class="{ 'campo-incorreto': !form.numero && validado}"/>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="input-label">Cidade: <text style="color: red">*</text></label>
        <input
        type="text"
        v-model="form.cidade"
        :placeholder="cidadePlaceholder"
        class="text-input"
        :class="{ 'campo-incorreto': !form.cidade && validado}"/>
      </div>

      <div class="form-group">
        <label class="input-label">Complemento: </label>
        <input
          type="text"
          v-model="form.complemento"
          placeholder="Digite o complemento"
          class="text-input"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group full-width">
        <label class="input-label">Bairro: <text style="color: red">*</text></label>
        <input
        type="text"
        v-model="form.bairro"
        :placeholder="bairroPlaceholder"
        class="text-input"
        :class="{ 'campo-incorreto': !form.bairro && validado}"/>
      </div>
    </div>

    <UiButton class="next" label="Criar" @click="handleSubmit" />

    <!-- ✅ Alerta fixo -->
    <div v-if="mensagem" class="mensagem-alerta">
      <p>{{ mensagem }}</p>
      <button @click="mensagem = ''" class="botao-fechar">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import { UiButton } from '../components/index.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'
import { cadastroLoja } from '../stores/registroLoja.js'
import { emailDono } from '../stores/registroDono.js'

const router = useRouter()
const mensagem = ref('')

const form = ref({
  cep: '',
  estado: '',
  cidade: '',
  bairro: '',
  logradouro: '',
  numero: '',
  complemento: '',
})
const CEPPlaceholder = ref('Digite seu CEP')
const estadoPlaceholder = ref('Digite o estado')
const numeroPlaceholder = ref('Digite o número')
const cidadePlaceholder = ref('Digite a cidade')
const bairroPlaceholder = ref('Digite o bairro')
const validado = ref(false)

async function handleSubmit() {
  validado.value = true // ativa validação
  let valid = true

  // Verificar campos vazios
  if (!form.value.cep) {
    CEPPlaceholder.value = 'CEP é obrigatório'
    valid = false
  }
  if (!form.value.estado) {
    estadoPlaceholder.value = 'Estado é obrigatório'
    valid = false
  }
  if (!form.value.numero) {
    numeroPlaceholder.value = 'Número é obrigatório'
    valid = false
  }
  if (!form.value.cidade) {
    cidadePlaceholder.value = 'Cidade é obrigatório'
    valid = false
  }
  if (!form.value.bairro) {
    bairroPlaceholder.value = 'Bairro é obrigatório'
    valid = false
  }
  if (!valid) {
    return
  }

  cadastroLoja.value.enderecoLoja = { ...form.value }

  try {
    await axios.post('http://localhost:3333/empresa', {
      endereco_cep: form.value.cep,
      endereco_estado: form.value.estado,
      endereco_cidade: form.value.cidade,
      endereco_bairro: form.value.bairro,
      endereco_logradouro: form.value.logradouro,
      endereco_numero: form.value.numero,
      endereco_complemento: form.value.complemento,
      razao_social: cadastroLoja.value.dadosLoja.razaoSocial,
      nome_fantasia: cadastroLoja.value.dadosLoja.nomeFantasia,
      codEmpresa: cadastroLoja.value.dadosLoja.codEmpresa,
      telefone: cadastroLoja.value.dadosLoja.telefone,
      whatsapp: cadastroLoja.value.dadosLoja.whatsapp,
      cnpj: cadastroLoja.value.dadosLoja.cnpj,
      dono_id: emailDono.value.dadosDono.codDono,
    })

    mensagem.value = 'Cadastro da empresa concluído com sucesso!'
    setTimeout(() => {
      mensagem.value = ''
      router.push('/home')
    }, 1500)
  } catch (error) {
    console.error('Erro no envio:', error)
    mensagem.value = 'Erro ao enviar o cadastro. Tente novamente.'
  }
}
</script>

<style scoped>
.container-adress {
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

.next {
  display: block;
  width: 250px;
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

/* ✅ Estilo do alerta fixo */
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

.campo-incorreto {
  border: 2px solid red !important;
}
.campo-incorreto::placeholder {
  color: red;
}
</style>
