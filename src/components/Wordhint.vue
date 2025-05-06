<template>
  <div class="word-hint">
    <strong>Jawaban (untuk Host):</strong> {{ word }}
  </div>
</template>

<script setup>
defineProps({
  word: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.word-hint {
  background-color: #fff8dc;
  padding: 10px;
  margin-bottom: 1rem;
  border-radius: 6px;
  font-weight: bold;
}
</style>
