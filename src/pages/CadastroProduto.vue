<template>
  <div class="container-registro-produto">
    <!-- Botão de voltar personalizado -->
    <button class="botao-voltar" @click="voltar" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <h1 class="title">CADASTRO DE PRODUTOS</h1>

    <div class="form-grid">
      <div class="form-group">
        <label for="nome" class="input-label"
          >Nome do produto: <text style="color: red">*</text></label
        >
        <input
          type="text"
          v-model="form.nome"
          id="nome"
          placeholder="Digite o nome do produto"
          class="text-input"
        />
      </div>

      <div class="form-group">
        <label for="marca" class="input-label"
          >Marca do produto: <text style="color: red">*</text></label
        >
        <input
          type="text"
          v-model="form.marca"
          id="marca"
          placeholder="Digite a marca do produto"
          class="text-input"
        />
      </div>

      <div class="form-group">
        <label for="tipo" class="input-label"
          >Tipo do produto: <text style="color: red">*</text></label
        >
        <input
          type="text"
          v-model="form.tipo"
          id="tipo"
          placeholder="Digite o tipo do produto"
          class="text-input"
        />
      </div>

      <div class="form-group">
        <label for="modelo" class="input-label"
          >Modelo do produto: <text style="color: red">*</text></label
        >
        <input
          type="text"
          v-model="form.modelo"
          id="modelo"
          placeholder="Digite o modelo do produto"
          class="text-input"
        />
      </div>

      <div class="form-group">
        <label for="categoria" class="input-label"
          >Categoria do produto: <text style="color: red">*</text></label
        >
        <input
          type="text"
          v-model="form.categoria"
          id="categoria"
          placeholder="Digite a categoria do produto"
          class="text-input"
        />
      </div>

      <!-- Linhas menores -->
      <div class="linha-menor-inputs">
        <div class="form-group pequeno">
          <label for="codBarras" class="input-label"
            >Código de barras: <text style="color: red">*</text></label
          >
          <input
            type="text"
            v-model="form.codBarras"
            id="codBarras"
            placeholder="Digite o código"
            class="text-input"
          />
        </div>

        <div class="form-group pequeno">
          <label for="quantidade" class="input-label">Quantidade:</label>
          <input
            type="text"
            v-model="form.quantidade"
            id="quantidade"
            placeholder="Digite a quantidade"
            class="text-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="codProduto" class="input-label"
          >Código do produto: <text style="color: red">*</text></label
        >
        <input
          type="text"
          v-model="form.codProduto"
          id="codProduto"
          placeholder="Digite o código do produto"
          class="text-input"
        />
      </div>

      <!-- Linhas menores -->
      <div class="linha-menor-inputs">
        <div class="form-group pequeno">
          <label for="estMin" class="input-label"
            >Estoque mínimo: <text style="color: red">*</text></label
          >
          <input
            type="text"
            v-model="form.estMin"
            id="estMin"
            placeholder="Digite o estoque mínimo"
            class="text-input"
          />
        </div>

        <div class="form-group pequeno">
          <label for="estMax" class="input-label"
            >Estoque máximo: <text style="color: red">*</text></label
          >
          <input
            type="text"
            v-model="form.estMax"
            id="estMax"
            placeholder="Digite o estoque máximo"
            class="text-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="img" class="input-label">Imagem: <text style="color: red">*</text></label>
        <input
          type="file"
          id="img"
          @change="handleFileChange"
          class="text-input file-input-estilizado"
          accept="image/jpeg, image/png"
        />
      </div>

      <!-- Linhas menores -->
      <div class="linha-menor-inputs">
        <div class="form-group pequeno">
          <label for="dataValidade" class="input-label"
            >Data de validade: <text style="color: red">*</text></label
          >
          <input type="date" v-model="form.dataValidade" id="dataValidade" class="text-input" />
        </div>

        <div class="form-group pequeno">
          <label for="preco" class="input-label"
            >Preço(R$): <text style="color: red">*</text></label
          >
          <input
            type="text"
            v-model="form.preco"
            id="preco"
            placeholder="Digite o preço do produto"
            class="text-input"
          />
        </div>
      </div>
    </div>

    <div class="botao-container">
      <UiButton class="next" label="Próximo" @click="handleNext" />
    </div>

    <div v-if="mensagem" class="mensagem-alerta">
      <p>{{ mensagem }}</p>
      <button @click="mensagem = ''" class="botao-fechar">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { cadastroFuncionario } from 'src/stores/registroFuncionario.js'
import { UiButton } from '../components/index.js'

const router = useRouter()
const mensagem = ref('')
const produtos = ref([])

const form = ref({
  nome: '',
  tipo: '',
  marca: '',
  modelo: '',
  codBarras: '',
  codEmpresa: cadastroFuncionario.value.dadosLogin.codEmpresa,
  categoria: '',
  codProduto: '',
  dataValidade: '',
  fornecedor: '',
  preco: '',
  quantidade: '',
  estMin: '',
  estMax: '',
  img: null,
})

const voltar = () => {
  router.push('/home')
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.img = file
  }
}

async function handleNext() {
  if (
    !form.value.nome ||
    !form.value.tipo ||
    !form.value.marca ||
    !form.value.modelo ||
    !form.value.codBarras ||
    !form.value.codProduto ||
    !form.value.categoria ||
    !form.value.dataValidade ||
    !form.value.preco ||
    !form.value.quantidade ||
    !form.value.estMin ||
    !form.value.estMax ||
    !form.value.img
  ) {
    mensagem.value = 'Preencha todos os campos!'
    return
  }

  const hoje = new Date()
  const dataVal = new Date(form.value.dataValidade)
  hoje.setHours(0, 0, 0, 0)
  dataVal.setHours(0, 0, 0, 0)

  if (dataVal < hoje) {
    mensagem.value = 'A data de validade não pode ser anterior à data atual.'
    return
  }

  if (isNaN(form.value.preco) || parseFloat(form.value.preco) <= 0) {
    mensagem.value = 'O preço deve ser um número maior que zero.'
    return
  }

  if (isNaN(form.value.quantidade) || parseInt(form.value.quantidade) < 0) {
    mensagem.value = 'A quantidade deve ser um número positivo.'
    return
  }

  if (
    isNaN(form.value.estMin) ||
    isNaN(form.value.estMax) ||
    parseInt(form.value.estMin) < 0 ||
    parseInt(form.value.estMax) <= 0
  ) {
    mensagem.value = 'Estoque mínimo e máximo devem ser números maiores que zero.'
    return
  }

  if (parseInt(form.value.estMin) > parseInt(form.value.estMax)) {
    mensagem.value = 'O estoque mínimo não pode ser maior que o estoque máximo.'
    return
  }

  const codBarrasRegex = /^\d{8,14}$/
  if (!codBarrasRegex.test(form.value.codBarras)) {
    mensagem.value = 'Código de barras inválido. Deve conter entre 8 e 14 dígitos numéricos.'
    return
  }

  if (form.value.img) {
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(form.value.img.type)) {
      mensagem.value = 'A imagem deve estar no formato JPEG ou PNG.'
      return
    }
  }

  if (form.value.nome.length < 3 || form.value.marca.length < 2) {
    mensagem.value = 'Nome do produto e marca devem ter pelo menos 2 ou 3 caracteres.'
    return
  }

  if (!form.value.codEmpresa) {
    mensagem.value = 'Usuário não possui código da empresa'
    return
  }

  try {
    // Buscar produtos existentes para validação
    const response = await axios.get(`http://localhost:3333/produto/CP/${form.value.codEmpresa}`)
    produtos.value = response.data.message || []

    const codProdutoExistente = produtos.value.find(
      (p) => String(p.codProduto) === String(form.value.codProduto),
    )
    const codBarrasExistente = produtos.value.find(
      (p) => String(p.codBarras).trim() === String(form.value.codBarras).trim(),
    )
    if (codProdutoExistente || codBarrasExistente) {
      router.push('/ProdutoNaoSucesso')
      return
    }
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    mensagem.value = 'Erro ao buscar produtos existentes.'
    return
  }

  // Preparar FormData para envio
  const formData = new FormData()
  formData.append('nome', form.value.nome)
  formData.append('tipo', form.value.tipo)
  formData.append('marca', form.value.marca)
  formData.append('modelo', form.value.modelo)
  formData.append('codBarras', form.value.codBarras)
  formData.append('codEmpresa', form.value.codEmpresa)
  formData.append('codProduto', form.value.codProduto)
  formData.append('categoria', form.value.categoria)
  formData.append('dataValidade', form.value.dataValidade)
  formData.append('fornecedor', form.value.fornecedor)
  formData.append('preco', form.value.preco)
  formData.append('quantidade', form.value.quantidade)
  formData.append('estMin', form.value.estMin)
  formData.append('estMax', form.value.estMax)
  formData.append('img', form.value.img)

  // Enviar dados para backend
  try {
    await axios.post('http://localhost:3333/produto', formData)
    router.push('/ProdutoSucesso')
  } catch (error) {
    console.error('Erro ao registrar produto:', error)
    mensagem.value = 'Erro inesperado, tente novamente.'
  }
}
</script>

<style scoped>
html,
body {
  overflow: hidden; /* Impede o scroll na tela */
  height: 100vh; /* Garante que o conteúdo ocupe toda a altura da tela */
}

.container-registro-produto {
  margin: 0 auto;
  width: 75%;
  margin-top: 50px;
}

.title {
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin-top: 10px;
}

.input-label {
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 5px;
  display: block;
}

.text-input {
  width: 100%;
  height: 50px;
  font-size: 16px;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 24px;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 40px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.botao-container {
  display: flex;
  justify-content: center;
}

.next {
  width: 250px;
  height: 72px;
  background-color: #ff7f26;
  margin-top: 10%;
  margin-left: 15%;
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

.linha-menor-inputs {
  display: flex;
  gap: 20px;
}

.form-group.pequeno {
  flex: 1;
}

.file-input-estilizado {
  color: white;
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: 24px;
  padding: 10px;
  height: 50px;
  font-size: 16px;
  cursor: pointer;
}

/* Estilização botão do input file */
.file-input-estilizado::file-selector-button {
  background-color: #ff7f26;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
}

.file-input-estilizado::file-selector-button:hover {
  background-color: #b14a01;
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
</style>
