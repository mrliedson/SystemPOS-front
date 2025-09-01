<template>
  <div class="container">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="abrirModalSenha" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="content">
      <Uilogo />

      <div class="form">
        <div class="login">
          <input
            type="number"
            :value="Number(total).toFixed(2)"
            placeholder="TOTAL"
            class="text-input"
            readonly
          />
        </div>

        <div class="login">
          <label class="input-label">Qual a forma de pagamento?</label>
          <select v-model="formaPagamento" class="text-input">
            <option disabled value="">Selecione a forma de pagamento...</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="cartao_debito">Cartão de Débito</option>
            <option value="pix">Pix</option>
          </select>
        </div>

        <div class="login">
          <label class="input-label">Valor:</label>
          <input
            type="text"
            v-model="valor"
            @focus="$event.target.select()"
            placeholder="Valor"
            class="text-input"
          />
        </div>

        <div class="login">
          <label class="input-label">A pagar:</label>
          <input
            type="text"
            :value="Number(aPagar).toFixed(2)"
            placeholder="A pagar"
            class="text-input"
            readonly
          />
        </div>

        <div class="login">
          <label class="input-label">Troco:</label>
          <input
            type="text"
            :value="Number(troco).toFixed(2)"
            placeholder="Troco"
            class="text-input"
            readonly
          />
        </div>

        <!-- Botão dinâmico -->
        <UiButton
          class="next"
          :label="pagamentoFinalizado ? 'Liberar Caixa' : 'Finalizar Pagamento'"
          @click="pagamentoFinalizado ? PagamentoFinalizado() : finalizarPagamento()"
        />
      </div>
    </div>

    <!-- Mensagem de alerta -->
    <div v-if="mensagem" class="mensagem-alerta">
      <p>{{ mensagem }}</p>
      <button @click="mensagem = ''" class="botao-fechar">Fechar</button>
    </div>

    <!-- Modal Senha -->
    <div v-if="modalSenhaAberto" class="modal-overlay">
      <div class="modal">
        <h2>Liberar acesso</h2>
        <label>Senha:</label>
        <input :key="modalSenhaAberto" type="password" v-model="senha" class="text-input" />
        <div class="modal-buttons">
          <button @click="validarSenha">Ok</button>
          <button @click="fecharModalSenha">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal Sucesso Pagamento -->
    <div v-if="modalAberto" class="modal-overlay">
      <div class="modal">
        <h2>Status da compra</h2>
        <label>Compra aprovada</label>
        <div class="modal-buttons">
          <button @click="modalAberto = false">Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UiButton, Uilogo } from 'src/components'
import axios from 'axios'
import { cadastroFuncionario } from 'src/stores/registroFuncionario.js'
import { cadastroVenda } from 'src/stores/registroVenda.js'

const router = useRouter()
const mensagem = ref('')

const total = ref(cadastroVenda.value.totalVenda.total)
const aPagar = ref(cadastroVenda.value.totalVenda.total)
const valor = ref(null)
const formaPagamento = ref('')
const troco = ref(0.0)

const modalAberto = ref(false)
const modalSenhaAberto = ref(false)
const pagamentoFinalizado = ref(false)

const senha = ref('')
const usuarios = ref([])

const carrinho = ref(cadastroVenda.value.totalVenda.carrinho || [])
const produtoSelecionado = ref(null)

function abrirModalSenha() {
  senha.value = ''
  modalSenhaAberto.value = true
}

function fecharModalSenha() {
  modalSenhaAberto.value = false
  senha.value = ''
}

function validarSenha() {
  const senhaValida = usuarios.value.some((u) => u.senha_hash === senha.value)

  if (senhaValida) {
    modalSenhaAberto.value = false
    senha.value = ''
    router.push('/CaixaLivre')
  } else {
    mensagem.value = 'Senha de administrador incorreta!'
    modalSenhaAberto.value = false
    senha.value = ''
  }
}

async function finalizarPagamento() {
  const valorPago = parseFloat(valor.value)

  if (isNaN(valorPago) || valorPago <= 0) {
    mensagem.value = 'Informe um valor válido para pagamento.'
    return
  }
  if (!formaPagamento.value) {
    mensagem.value = 'Selecione a forma de pagamento.'
    return
  }

  if (valorPago < aPagar.value) {
    aPagar.value = (aPagar.value - valorPago).toFixed(2)
    valor.value = null
    mensagem.value = `Pagamento parcial realizado com ${formaPagamento.value}. Restam R$ ${aPagar.value}`
    return
  }

  const trocoCalculado = (valorPago - aPagar.value).toFixed(2)
  troco.value = trocoCalculado
  aPagar.value = 0
  mensagem.value = `Pagamento completo com ${formaPagamento.value}. Troco: R$ ${troco.value}`

  try {
    for (const item of carrinho.value) {
      await axios.put(`http://localhost:3333/produto/VE/${item.id}`, {
        quantidadeNova: item.quantidade,
      })
    }
    console.log('Compra finalizada e estoque atualizado!')
    carrinho.value = []
    produtoSelecionado.value = null
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error)
    mensagem.value = 'Erro ao atualizar estoque, verifique o servidor.'
    return
  }

  modalAberto.value = true
  pagamentoFinalizado.value = true
}

function PagamentoFinalizado() {
  router.push('/CaixaLivre')
}

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
