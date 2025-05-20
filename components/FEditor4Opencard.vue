<template>
  <ClientOnly>
    <div class="froala-editor-container" v-if="content">
      <FroalaEditor
        :modelValue="content"
        :config="editorOptions"
        :disabled="true"
      />
    </div>
    <div v-else class="text-gray-500 p-4">
      No content to display
    </div>
  </ClientOnly>
</template>

<script setup>
import { FroalaEditor } from 'vue-froala-wysiwyg';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import { defineProps } from 'vue';
import { ClientOnly } from '#components';

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
});

const editorOptions = {
  toolbarInline: false,
  toolbarSticky: false,
  toolbarVisibleWithoutSelection: false,
  placeholderText: 'Content will be displayed here...',
  initOnClick: false,
  toolbar: false,
  quickInsertEnabled: false,
  key: 'content', // Ensure proper reactivity
  immediateVueModelUpdate: true,
  events: {
    initialized: function() {
      if (this && this.edit) {
        this.edit.off(); // Disable editing
        this.html.set(props.content || ''); // Use props.content directly
      }
    },
    contentChanged: function() {
      // Prevent any content changes
      if (this && this.html) {
        this.html.set(props.content || '');
      }
    }
  }
};


</script>

<style scoped>
.froala-editor-container {
  width: 100%;
  height: 100%;
}

:deep(.fr-wrapper) {
  border: none !important;
}

:deep(.fr-view) {
  padding: 0;
  font-size: 16px;
  line-height: 1.5;
  color: inherit;
}
</style>