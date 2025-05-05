<template>
    <div class="home">
      <h1>Tebak Kata Online</h1>
      <input v-model="name" placeholder="Masukkan nama" />
      <button @click="joinGame">Gabung</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const name = ref('')
  const router = useRouter()
  
  function joinGame() {
    if (name.value.trim()) {
      localStorage.setItem('playerName', name.value)
      router.push('/game')
    }
  }
  </script>
  
  <style scoped>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  </style>
  