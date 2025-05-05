<template>
    <div class="chat-box">
      <ul>
        <li v-for="(msg, index) in messages" :key="index">
          <strong>{{ msg.player }}:</strong> {{ msg.text }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  defineProps({
    messages: {
      type: Array,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .chat-box {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px;
    max-height: 250px;
    overflow-y: auto;
    margin-bottom: 1rem;
  }
  </style>
  