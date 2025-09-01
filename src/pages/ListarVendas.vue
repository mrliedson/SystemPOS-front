<template>
  <div class="centralizador">
    <!-- Botão de voltar -->
    <button class="botao-voltar" @click="voltar" aria-label="Voltar">
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <!-- Título -->
    <h1 class="title">HISTÓRICO DE VENDAS</h1>

    <!-- Box laranja -->
    <div class="Box-laranja">
      <!-- Ícone de filtro -->
      <img
        class="iconeFiltro"
        alt="Filtro"
        @click="mostrarOpcoes = !mostrarOpcoes"
        src="../assets/filter.png"
      />

      <!-- Dropdown de filtro -->
      <div class="opcoesFiltro" v-if="mostrarOpcoes">
        <button @click="aplicarFiltro('Dia')">Dia</button>
        <button @click="aplicarFiltro('Semana')">Semana</button>
        <button @click="aplicarFiltro('Mes')">Mês</button>
        <button @click="aplicarFiltro('Ano')">Ano</button>
        <button @click="aplicarFiltro('Todos')">Todos</button>
      </div>

      <!-- Lista de vendas -->
      <div class="boxrolavel">
        <div v-for="(grupo, index) in historico_vendas" :key="index">
          <div class="dataGrupo">{{ grupo.titulo }}</div>
          <div class="compra" v-for="(venda, idx) in grupo.vendas" :key="idx">
            <div class="boxConteudo">
              <div class="item">
                <span class="label">Nome do cliente</span>
                <span class="valor">{{ venda.nomeCliente }}</span>
              </div>
              <div class="item">
                <span class="label">CPF</span>
                <span class="valor">{{ venda.cpf }}</span>
              </div>
              <div class="item">
                <span class="label">Qtd. de itens</span>
                <span class="valor">{{ venda.totalItens }}</span>
              </div>
              <div class="item">
                <span class="label">Valor total</span>
                <span class="valor">{{ venda.valorTotal }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="historico_vendas.length === 0" class="sem-produtos">
          Nenhuma venda encontrada.
        </div>
      </div>

      <button class="BotaoGraficos" @click="irParaGraficos">Ver Gráficos</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      historico_vendas: [],
      mostrarOpcoes: false,
      filtroAtual: "Dia",
    };
  },
  mounted() {
    this.buscarVendas();
  },
  methods: {
    async buscarVendas() {
      try {
        const res = await axios.get("http://localhost:3333/historico-vendas");
        this.jsonData = res.data;
        this.aplicarFiltro(this.filtroAtual);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
      }
    },
    aplicarFiltro(filtro) {
      if (!this.jsonData) return;
      this.filtroAtual = filtro;

      const historicoArray = Object.entries(this.jsonData).map(([data, vendas]) => ({
        data,
        vendas,
      }));

      let resultado = [];

      if (filtro === "Dia" || filtro === "Todos") {
        resultado = historicoArray.map(grupo => ({ titulo: grupo.data, vendas: grupo.vendas }));
      } else if (filtro === "Semana") {
        const hoje = new Date();
        const semanas = {};
        historicoArray.forEach(grupo => {
          const data = new Date(grupo.data);
          const diffDias = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));
          let titulo = "";
          if (diffDias < 7) titulo = "Essa semana";
          else if (diffDias < 14) titulo = "Semana passada";
          else if (diffDias < 21) titulo = "Há duas semanas";
          else titulo = "Há três semanas ou mais";

          if (!semanas[titulo]) semanas[titulo] = [];
          semanas[titulo].push(...grupo.vendas);
        });
        resultado = Object.entries(semanas).map(([titulo, vendas]) => ({ titulo, vendas }));
      } else if (filtro === "Mes") {
        const meses = {};
        const nomesMeses = [
          "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
          "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
        ];
        historicoArray.forEach(grupo => {
          const data = new Date(grupo.data);
          const titulo = nomesMeses[data.getMonth()];
          if (!meses[titulo]) meses[titulo] = [];
          meses[titulo].push(...grupo.vendas);
        });
        resultado = Object.entries(meses).map(([titulo, vendas]) => ({ titulo, vendas }));
      } else if (filtro === "Ano") {
        const anos = {};
        historicoArray.forEach(grupo => {
          const ano = new Date(grupo.data).getFullYear();
          if (!anos[ano]) anos[ano] = [];
          anos[ano].push(...grupo.vendas);
        });
        resultado = Object.entries(anos).map(([titulo, vendas]) => ({ titulo, vendas }));
      }

      this.historico_vendas = resultado;
      this.mostrarOpcoes = false;
    },
    irParaGraficos() {
      this.$router.push("/historicoPage");
    },
    voltar() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
html, body, #q-app {
  height: 100%;
  margin: 0;
}

.centralizador {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 2rem;
  box-sizing: border-box;
  position: relative;
}

.title {
  color: #ffffff;
  font-size: 4em;
  text-align: center;
  margin: 0;
}

/* Box laranja */
.Box-laranja {
  background-color: #ff7f26;
  border-radius: 1em;
  height: 80%;
  width: 90%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

/* Scroll da lista */
.boxrolavel {
  width: 90%;
  flex: 1;
  overflow-y: auto;
  border-radius: 8px;
  padding: 20px;
  background: #ff7f26;
}

/* Itens da lista */
/* Itens da lista (item branco) */
.boxConteudo {
  background-color: white;
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 15px 20px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
  width: 100%; /* largura total da lista */
  box-sizing: border-box; /* garante padding dentro da largura */
}


.item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item span.label {
  font-weight: bold;
  font-size: 0.9rem;
}

.item span.valor {
  font-size: 1rem;
}

/* Scroll estilo */
.boxrolavel::-webkit-scrollbar {
  width: 8px;
}

.boxrolavel::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 10px;
  margin: 8px;
}

.boxrolavel::-webkit-scrollbar-thumb {
  background-color: #353535;
  border-radius: 10px;
}

.boxrolavel::-webkit-scrollbar-thumb:hover {
  background-color: #424242;
}

/* Data do grupo */
.dataGrupo {
  color: #fff;
  font-weight: bold;
  margin: 10px 0;
  font-size: 1.2rem;
}

/* Ícone de filtro */
.iconeFiltro {
  position: absolute;
  top: 10px;
  right: 2em;
  width: 3.5em;
  height: 3.5em;
  cursor: pointer;
  z-index: 10;
}

/* Botão de gráficos */
.BotaoGraficos {
  position: absolute;
  bottom: 10px;
  right: 3em;
  height: 6em;
  width: 17em;
  border-radius: 5rem;
  background-color: #FF4D00;
  border: 0.1em solid black;
  cursor: pointer;
  z-index: 10;
}

/* Filtro opções (preto) */
.opcoesFiltro {
  background-color: black;
  height: auto;
  width: 10%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  border-radius: 2em;
  position: absolute;
  top: 50px;
  right: 10px;
}

.opcoesFiltro button {
  background-color: black;
  color: white;
  border: none;
  padding: 10px;
  text-align: left;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  border-bottom: 1px solid #333;
}

.opcoesFiltro button:last-child {
  border-bottom: none;
}

.opcoesFiltro button:hover {
  background-color: #111;
}

/* Botão voltar */
.botao-voltar {
  width: 60px;
  height: 60px;
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
  z-index: 1000;
}

.botao-voltar svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: white;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Caso não haja vendas */
.sem-produtos {
  color: white;
  font-size: 18px;
  text-align: center;
  margin-top: 30px;
}

</style>
