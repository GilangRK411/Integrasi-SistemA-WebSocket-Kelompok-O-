<template>
    <div class="question-box">
      <strong>Pertanyaan:</strong> {{ question }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    question: {
      type: String,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .question-box {
    background: #eaf7ff;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 16px;
  }
  </style>
  