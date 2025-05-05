<template>
    <div class="game">
      <h2>Selamat datang, {{ name }}</h2>
  
      <WordHint v-if="isHost" :word="word" />
  
      <ChatBox :messages="messages" />
      <GuessForm :onGuess="sendGuess" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import ChatBox from '../components/Chatbox.vue'
  import GuessForm from '../components/Guessform.vue'
  import WordHint from '../components/Wordhint.vue'
  
  const name = localStorage.getItem('playerName') || 'Player'
  const ws = ref(null)
  const messages = ref([])
  const word = ref('')
  const isHost = ref(false)
  
  onMounted(() => {
    ws.value = new WebSocket('ws://localhost:3000')
  
    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
  
      if (data.type === 'host') {
        isHost.value = true
        word.value = data.word
      } else if (data.type === 'player') {
        isHost.value = false
      } else if (data.type === 'guess') {
        messages.value.push({ player: data.player, text: data.guess })
      } else if (data.type === 'win') {
        alert(`${data.player} menebak dengan benar: "${data.guess}"`)
        messages.value = []
      }
    }
  })
  
  function sendGuess(guessText) {
    ws.value.send(
      JSON.stringify({
        type: 'guess',
        guess: guessText,
        name
      })
    )
  }
  </script>
  