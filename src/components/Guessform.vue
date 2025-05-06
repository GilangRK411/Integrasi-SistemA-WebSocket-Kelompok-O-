<template>
  <form @submit.prevent="submitGuess">
    <input v-model="guess" placeholder="Tebak jawaban..." />
    <button type="submit">Kirim</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  onGuess: {
    type: Function,
    required: true
  }
})

const guess = ref("")

function submitGuess() {
  if (guess.value.trim()) {
    props.onGuess(guess.value)
    guess.value = ""
  }
}
</script>

<style scoped>
form {
  display: flex;
  gap: 10px;
}
input {
  flex: 1;
  padding: 8px;
}
button {
  padding: 8px 12px;
}
</style>
