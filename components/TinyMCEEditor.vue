<template>
  <div class="tinymce-editor">
    <Editor
      v-model="editorContent"
      :init="editorInit"
      :disabled="readonly"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const editorContent = ref(props.modelValue)

const editorInit = {
  height: 500,
  menubar: false,
  plugins: 'autoresize',
  toolbar: false,
  statusbar: false,
  readonly: props.readonly,
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
}

watch(() => props.modelValue, (newValue) => {
  editorContent.value = newValue
})

watch(editorContent, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped>
.tinymce-editor {
  width: 100%;
}
</style>