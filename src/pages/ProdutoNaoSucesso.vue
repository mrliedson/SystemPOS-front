<!-- ProdutoJaCadastrado.vue -->
<template>
  <div class="container">
    <div class="card">
      <img src="../assets/ProdCad.PNG" alt="Ícone de visualização" />
      <p>Este produto já está cadastrado!</p>
      <button @click="verProduto">Ver produto</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const verProduto = () => {
  // Pode fechar o modal ou redirecionar pra outra tela
  router.push('/alterarPreco')
};
</script>

<style scoped>
body {
  background-image: url('../assets/fundoTCClogin.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.card {
  background-color: #0a0a23;
  padding: 60px;          /* antes 40px */
  border-radius: 20px;
  box-shadow: 0 0 15px rgba(27, 27, 27, 0.7); /* sombra um pouco maior */
  text-align: center;
  max-width: 800px;       /* antes 600px */
  width: 90%;
  color: white;
}

.card img {
  width: 120px;           /* antes 80px */
  height: 120px;          /* antes 80px */
  margin-bottom: 25px;    /* aumentei um pouco */
}

.card p {
  font-size: 1.6rem;      /* antes 1.2rem */
  margin-bottom: 30px;    /* antes 20px */
}

.card button {
  background-color: #00C43D;
  color: white;
  border: none;
  padding: 14px 35px;     /* antes 10px 25px */
  font-size: 1.2rem;      /* antes 1rem */
  border-radius: 30px;
  cursor: pointer;
  transition: background 0.3s;
}

.card button:hover {
  background-color: #00a534;
}

</style>
