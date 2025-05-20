<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import "katex/dist/katex.min.css";
import MathExtension from "@aarkue/tiptap-math-extension"
import Image from '@tiptap/extension-image'
  
const props = defineProps({
  content: {
    type: String,
    required: false,
    default: ''
  },
  modelValue: {
    type: String,
    required: false,
    default: ''
  }
})

const editor = shallowRef<Editor>()

const initEditor = () => {
  if (editor.value) {
    editor.value.destroy()
  }
  
  editor.value = new Editor({
    content: props.content || props.modelValue,
    editable: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        bulletList: {},
        orderedList: {}
      }),
      MathExtension.configure({ evaluation: true }),
      Image.configure({
        inline: true,
        allowBase64: true
      })
    ]
  })
}

onMounted(() => {
  initEditor()
})

watch(() => props.content || props.modelValue, () => {
  initEditor()
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<template>
  <div v-if="editor" class="tiptap-readonly editor-content">
    <EditorContent :editor="editor" />
  </div>
</template>

<style scoped>
.tiptap-readonly {
  height: auto;
  overflow-y: visible;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 1rem;
}
</style>