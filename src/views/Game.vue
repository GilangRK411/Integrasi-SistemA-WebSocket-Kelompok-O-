<template>
  <div class="game">
    <h2>Selamat datang, {{ name }}</h2>

    <QuestionBox :question="question" />

    <WordHint v-if="isHost" :word="answer" />

    <ChatBox :messages="messages" />
    <GuessForm :onGuess="sendGuess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QuestionBox from '../components/Questionbox.vue'
import WordHint from '../components/Wordhint.vue'
import ChatBox from '../components/Chatbox.vue'
import GuessForm from '../components/Guessform.vue'

const name = localStorage.getItem('playerName') || 'Player'
const ws = ref(null)

const isHost = ref(false)
const answer = ref('')       
const question = ref('')    
const messages = ref([])    

onMounted(() => {
  ws.value = new WebSocket('ws://localhost:3000')

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)

    switch (data.type) {
      case 'host':
        isHost.value = true
        question.value = data.question
        answer.value = data.answer
        break
      case 'player':
        isHost.value = false
        question.value = data.question
        break
      case 'guess':
        messages.value.push({ player: data.player, text: data.guess })
        break
      case 'win':
        alert(`${data.player} menebak dengan benar: "${data.guess}" 🎉`)
        messages.value = []
        break
      case 'question':
        question.value = data.question
        break
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

<style scoped>
.game {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
</style>
