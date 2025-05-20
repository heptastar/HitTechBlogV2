<template>
    <div>
      <h1>My Tiptap Editor Page</h1>
      <TiptapEditor />
    </div>
  </template>
  
  <script setup>
  // Import the TiptapEditor component
  import TiptapEditor from '~/components/TiptapEditorGrok.vue';
  </script>
  
  <style scoped>
  div {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  </style>