<template>
  <div class="container">
    <button class="botao-voltar" @click="back()" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="content">
      <div class="scrollview">
        <div
          v-for="item in carrinho"
          :key="item.codigo_barras"
          class="produto"
          @click="abrirModal(item)"
        >
          {{ item.nome }} | Qtd: {{ item.quantidade }} | R$ {{ item.preco }}
        </div>
      </div>

      <div class="imagem-produto">
        <p v-if="produtoSelecionado">
          <img
            :src="produtoSelecionado.imagem"
            alt="Produto"
            style="max-width: 100%; max-height: 100%"
          />
        </p>
        <p v-else>Imagem do produto</p>
      </div>

      <div class="form">
        <div class="login">
          <label class="input-label">Quantidade:</label>
          <input
            type="number"
            v-model="quantidade"
            placeholder="Digite a quantidade"
            class="text-input"
          />
        </div>

        <div class="login">
          <label class="input-label">Código de barras:</label>
          <input
            type="text"
            v-model="codigoBarras"
            @keyup.enter="buscarProduto"
            placeholder="Leia o código"
            class="text-input"
          />
        </div>

        <div class="login">
          <label class="input-label">Total da Compra:</label>
          <input type="text" :value="totalCompra.toFixed(2)" class="text-input" readonly />
        </div>

        <UiButton class="next" label="Finalizar Compra" @click="finalizarCompra" />
      </div>
    </div>

    <div v-if="mensagem" class="mensagem-alerta">
      <p>{{ mensagem }}</p>
      <button @click="mensagem = ''" class="botao-fechar">Fechar</button>
    </div>

    <!-- Modal de senha -->
    <div v-if="modalAberto" class="modal-overlay">
      <div class="modal">
        <h2>Liberar acesso</h2>
        <label>Senha:</label>
        <input :key="modalAberto" type="password" v-model="senha" class="text-input" />
        <div class="modal-buttons">
          <button @click="validarSenha">Ok</button>
          <button @click="fecharModal">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de edição -->
    <div v-if="editarAberto" class="modal-overlay">
      <div class="modal">
        <h2>Editar produto</h2>
        <label>Quantidade:</label>
        <input type="number" v-model.number="quantidadeEdicao" min="1" />
        <div class="modal-buttons">
          <button @click="salvarEdicao">Salvar</button>
          <button @click="removerItem">Remover</button>
          <button @click="fecharEdicao">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UiButton } from 'src/components'
import axios from 'axios'
import { cadastroFuncionario } from 'src/stores/registroFuncionario.js'
import { cadastroVenda } from 'src/stores/registroVenda.js'

const router = useRouter()
const mensagem = ref('')

const produtoSelecionado = ref(null)
const carrinho = ref([])
const codigoBarras = ref('')

const modalAberto = ref(false)
const editarAberto = ref(false)
const quantidade = ref(1)
const senha = ref('')
const itemSelecionado = ref(null)
const voltarAposSenha = ref(false)
const quantidadeEdicao = ref(1)

const usuarios = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:3333/user/SU/${cadastroFuncionario.value.dadosLogin.codEmpresa}`,
    )
    usuarios.value = response.data.message
  } catch (error) {
    console.error('Erro ao buscar os usuários:', error)
  }
})

// Buscar produto e adicionar ao carrinho
async function buscarProduto() {
  if (!codigoBarras.value) return
  try {
    const response = await axios.get(`http://localhost:3333/produto/DD/${codigoBarras.value}`, {
      params: { codEmpresa: cadastroFuncionario.value.dadosLogin.codEmpresa },
    })
    const produto = response.data.message[0]
    if (!produto) return

    const existente = carrinho.value.find((p) => p.codigo_barras === produto.codigo_barras)
    const quantidadeNoCarrinho = existente ? existente.quantidade : 0
    const quantidadeSolicitada = parseInt(quantidade.value)

    if (!quantidadeSolicitada || quantidadeSolicitada <= 0) {
      mensagem.value = 'Informe uma quantidade válida.'
      return
    }
    if (quantidadeNoCarrinho + quantidadeSolicitada > produto.quantidade) {
      mensagem.value = 'Quantidade do produto superior ao estoque'
      return
    }

    produtoSelecionado.value = produto
    if (existente) {
      existente.quantidade += quantidadeSolicitada
    } else {
      carrinho.value.push({ ...produto, quantidade: quantidadeSolicitada })
    }

    codigoBarras.value = ''
    quantidade.value = 1
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
  }
}

const totalCompra = computed(() =>
  carrinho.value.reduce((acc, item) => acc + item.preco * item.quantidade, 0),
)

// Finalizar compra
async function finalizarCompra() {
  if (!carrinho.value.length) {
    mensagem.value = 'Sem itens selecionados no carrinho'
    return
  }
  cadastroVenda.value.totalVenda.total = totalCompra.value
  cadastroVenda.value.totalVenda.carrinho = carrinho.value
  router.push('/TelaPagamento')
}

// Botão voltar
async function back() {
  if (carrinho.value.length) {
    senha.value = '' // 🔑 limpa ao abrir
    voltarAposSenha.value = true
    modalAberto.value = true
  } else {
    router.back()
  }
}

function abrirModal(item) {
  itemSelecionado.value = item
  quantidadeEdicao.value = item.quantidade
  senha.value = '' // 🔑 limpa ao abrir
  modalAberto.value = true
}

function validarSenha() {
  const senhaValida = usuarios.value.some((u) => u.senha_hash === senha.value)

  if (senhaValida) {
    modalAberto.value = false
    senha.value = '' // 🔑 reforço de segurança

    if (voltarAposSenha.value) {
      voltarAposSenha.value = false
      router.back()
    } else {
      editarAberto.value = true
    }
  } else {
    mensagem.value = 'Senha incorreta!'
    modalAberto.value = false
    senha.value = '' // 🔑 limpa também em caso de erro
  }
}

function fecharModal() {
  modalAberto.value = false
  senha.value = '' // 🔑 limpa sempre
  itemSelecionado.value = null
  voltarAposSenha.value = false
}

function fecharEdicao() {
  editarAberto.value = false
  itemSelecionado.value = null
}

async function salvarEdicao() {
  try {
    const response = await axios.get(
      `http://localhost:3333/produto/DD/${itemSelecionado.value.codigo_barras}`,
      { params: { codEmpresa: cadastroFuncionario.value.dadosLogin.codEmpresa } },
    )
    const produto = response.data.message[0]

    if (!produto) {
      mensagem.value = 'Produto não encontrado no estoque'
      return
    }

    if (quantidadeEdicao.value > produto.quantidade) {
      mensagem.value = 'Quantidade do produto superior ao estoque'
      return
    }

    const index = carrinho.value.findIndex(
      (p) => p.codigo_barras === itemSelecionado.value.codigo_barras,
    )
    if (index !== -1) {
      carrinho.value[index].quantidade = quantidadeEdicao.value
    }

    editarAberto.value = false
    itemSelecionado.value = null
  } catch (error) {
    console.error('Erro ao validar estoque na edição:', error)
    mensagem.value = 'Erro ao validar estoque'
  }
}

function removerItem() {
  carrinho.value = carrinho.value.filter(
    (i) => i.codigo_barras !== itemSelecionado.value.codigo_barras,
  )
  produtoSelecionado.value = null
  editarAberto.value = false
  itemSelecionado.value = null
}
</script>

<style scoped>
html,
body {
  overflow-y: auto;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #000;
}
.container {
  padding: 80px 20px;
}
.content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
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
  position: absolute;
  top: 20px;
  left: 20px;
}
.botao-voltar svg {
  width: 36px;
  height: 36px;
  stroke: white;
  stroke-width: 5;
  fill: none;
}
.scrollview {
  width: 400px;
  height: 400px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  padding: 20px;
}
.produto {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}
.imagem-produto {
  width: 200px;
  height: 200px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.input-label {
  font-size: 18px;
  color: #ffffff;
}
.scrollview::-webkit-scrollbar {
  width: 8px;
}
.scrollview::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 10px;
  margin: 8px;
}
.scrollview::-webkit-scrollbar-thumb {
  background-color: #353535;
  border-radius: 10px;
}
.scrollview::-webkit-scrollbar-thumb:hover {
  background-color: #424242;
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.modal {
  background: #111;
  padding: 20px;
  border-radius: 12px;
  color: white;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.modal-buttons button {
  background-color: #ff7f26;
  border: none;
  padding: 8px 12px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
.modal-buttons button:hover {
  background-color: #b14a01;
}
</style>
