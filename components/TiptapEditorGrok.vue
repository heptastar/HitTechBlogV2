<template>
    <div>
      <ClientOnly>
        <!-- Toolbar for formatting controls -->
        <div v-if="editor" class="toolbar">
          <button
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
          >
            Bold
          </button>
          <button
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          >
            Italic
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          >
            H1
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          >
            H2
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          >
            H3
          </button>
          <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
          >
            Bullet List
          </button>
          <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
          >
            Ordered List
          </button>
          <button
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeBlock') }"
          >
            Code Block
          </button>
        </div>
        <!-- Tiptap Editor -->
        <editor-content :editor="editor" class="editor-content" />
        <template #fallback>
          <div>Loading editor...</div>
        </template>
      </ClientOnly>
    </div>
  </template>
  
  <script setup>
  import { Editor, EditorContent } from '@tiptap/vue-3';
  import { StarterKit } from '@tiptap/starter-kit';
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  // Define the editor instance
  const editor = ref(null);
  
  // Initialize the editor with the desired extensions
  onMounted(() => {
    editor.value = new Editor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3], // Restrict headings to H1, H2, H3
          },
        }),
      ],
      content: `
        <h1>Welcome to Tiptap in Nuxt 3</h1>
        <p>This is a <strong>bold</strong> and <em>italic</em> example.</p>
        <ul>
          <li>Bullet list item 1</li>
          <li>Bullet list item 2</li>
        </ul>
        <ol>
          <li>Ordered list item 1</li>
          <li>Ordered list item 2</li>
        </ol>
        <pre><code>console.log('Hello, Tiptap!');</code></pre>
      `,
    });
  });
  
  // Clean up the editor instance when the component is unmounted
  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.destroy();
    }
  });
  </script>
  
  <style scoped>
  .toolbar {
    margin-bottom: 1rem;
  }
  .toolbar button {
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    border: 1px solid #ccc;
    background: #f9f9f9;
    cursor: pointer;
  }
  .toolbar button.is-active {
    background: #007bff;
    color: white;
  }
  .toolbar button:hover {
    background: #e0e0e0;
  }
  /* Styles for headings */
.editor-content h1 {
  font-size: 2em;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  font-weight: bold;
}

.editor-content h2 {
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  font-weight: bold;
}

.editor-content h3 {
  font-size: 1.17em;
  margin-top: 1em;
  margin-bottom: 1em;
  font-weight: bold;
}

/* Ensure editor content is styled */
.editor-content {
  padding: 1rem;
}

/* Styles for lists */
.editor-content ul,
.editor-content ol {
  padding-left: 1.5rem;
}

.editor-content li {
  margin-bottom: 0.5rem;
}

.editor-content ul li::marker {
  content: '• ';
}

.editor-content ol li::marker {
  content: counter(list-item) '. ';
}

</style>