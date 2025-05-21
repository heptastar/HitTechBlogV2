<template>
    <div class="tiptap-editor">
      <div v-if="editor" class="editor-toolbar">
        <button
          @click="toggleMathInput"
          :class="{ 'is-active': showMathInput || editor?.isActive('mathInline') || editor?.isActive('mathBlock') }"
        >
          Math
        </button>
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          <span class="icon-bold">B</span>
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
          <span class="icon-italic">I</span>
        </button>
        <!-- <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
          <span class="icon-underline">U</span>
        </button> -->
        <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
          <span class="icon-strikethrough">S</span>
        </button>
   
        <!-- <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
          <span class="icon-list">•</span>
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
          <span class="icon-list-ol">1.</span>
        </button> -->
        <button
          @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }"
        >
          p
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          h1
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          h2
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        >
          h3
        </button>
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          bullet
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          order list
        </button>
        <button
          :class="{ 'is-active': editor?.isActive('codeBlock') }"
          @click="toggleCodeBlock"
        >
          Coding
        </button>
        <!-- <select @change="(e) => setCodeBlockLanguage((e.target as HTMLSelectElement).value)">
          <option value="">Select Language</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
        </select> -->
   
         <!-- Image Button -->
         <button @click="showImageModal = true">
          Image
        </button>
   
      </div>
      <!-- Math Input Field (shown when Math button is clicked) -->
      <div v-if="showMathInput" class="math-input flex gap-1 mb-4">
        <input
          v-model="mathExpression"
          placeholder="Enter LaTeX expression"
          class="flex-grow p-2 border rounded"
          @keyup.enter="insertMath"
        />
        <button @click="insertMath" class="p-2 bg-blue-500 text-white rounded">Insert</button>
        <button @click="showMathInput = false" class="p-2 bg-gray-300 rounded">Cancel</button>
      </div>
  
      <!-- Image Upload Modal -->
      <div v-if="showImageModal" class="fixed top-0 left-0 p-4 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="modal-content bg-white p-6 rounded shadow-lg">
          <h3 class="text-lg font-bold mb-4">Upload Image</h3>
          <input type="file" ref="fileInputRef" @change="handleFileSelect" accept="image/*" class="hidden" />
          <div v-if="uploadError" class="text-red-500 mb-4">{{ uploadError }}</div>
          <div class="flex justify-end gap-2">
            <button @click="showImageModal = false" class="p-2 bg-gray-300 rounded">Cancel</button>
            <button @click="triggerFileInput" class="p-2 bg-blue-500 text-white rounded">Select Image</button>
            <button @click="uploadImage" :disabled="!selectedFile || uploading" class="p-2 bg-green-500 text-white rounded">{{ uploading ? 'Uploading...' : 'Upload' }}</button>
          </div>
        </div>
      </div>
  
      <editor-content :editor="editor" class="editor-content" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { Editor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  // import Underline from '@tiptap/extension-underline';
  import Code from '@tiptap/extension-code'; // Corrected import for Code extension
  import Image from '@tiptap/extension-image'; // Import Image extension
  
  import { watch, onMounted, onBeforeUnmount, ref, shallowRef } from 'vue'; // Added ref and shallowRef
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
  import { createLowlight } from 'lowlight'
  import 'highlight.js/styles/github.css' // Syntax highlighting theme
  import "katex/dist/katex.min.css";
   import MathExtension from "@aarkue/tiptap-math-extension" 
  const lowlight = createLowlight()
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const editor = shallowRef<Editor>();
  
  // Reactive variables for math input
  const showMathInput = ref(false);
  const mathExpression = ref('');
  
  // Reactive variables for image upload modal
  const showImageModal = ref(false);
  const selectedFile = ref<File | null>(null);
  const uploading = ref(false);
  const uploadError = ref<string | null>(null);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  
  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedFile.value = target.files[0];
      uploadError.value = null; // Clear previous errors
    } else {
      selectedFile.value = null;
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.value?.click();
  };
  
  const uploadImage = async () => {
    if (!selectedFile.value) return;
  
    uploading.value = true;
    uploadError.value = null;
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      // Extract base64 string part (remove data:image/...;base64, prefix)
      const base64Image = base64data.split(',')[1];
      // console.log("base64Image@tiptapeditor",base64Image);
      // console.log("auth_token@tiptapeditor",useCookie('authTokenCKKey').value);
      try {
        // Upload image
        const uploadResponse = await $fetch('/api/imgbpi/upload', {
          method: 'POST',
          body: {
            image: base64Image,
            imagename: selectedFile.value?.name || 'uploaded_image'
          },
          headers: {
            // Assuming auth_token is needed for upload
            'Cookie': `auth_token=${useCookie('authTokenCKKey').value}`
          }
        });
  
        const imageId = uploadResponse.body.imageId;
  
        // Retrieve image (optional, could insert directly if upload returns URL)
        // For this task, we retrieve base64 again as per requirement
        const retrieveResponse = await $fetch(`/api/imgbpi/retrieveoneimage?imageId=${imageId}`, {
          headers: {
             'Cookie': `auth_token=${useCookie('auth_token').value}`
          }
        });
  
        const retrievedBase64Image = retrieveResponse.body.image;
        const imageName = retrieveResponse.body.imagename;
  
        // Insert image into editor
        if (editor.value) {
          editor.value.chain().focus().setImage({ src: `data:image/png;base64,${retrievedBase64Image}`, alt: imageName, title: imageName }).run();
        }
  
        // Close modal and reset state
        showImageModal.value = false;
        selectedFile.value = null;
  
      } catch (error: any) {
        console.error('Image upload/retrieval failed:', error);
        uploadError.value = error.message || 'Failed to upload or retrieve image.';
      } finally {
        uploading.value = false;
      }
    };
    reader.readAsDataURL(selectedFile.value);
  };
  
  onMounted(() => {
    const newEditor = new Editor({
        content: props.modelValue,
        extensions: [
          StarterKit.configure({
            heading: {
              levels: [1, 2, 3, 4, 5]
            },
            bulletList: {},
            orderedList: {},
            paragraph: {}
          }),
          MathExtension.configure({ evaluation: true }),
          Code.configure({
            HTMLAttributes: {
              class: 'inline-code',
            },
          }),
          CodeBlockLowlight.configure({
            lowlight,
            defaultLanguage: 'javascript',
          }),
          Image.configure({
          inline: true,
          allowBase64: true
        })
        ],
        onUpdate: () => {
          emit('update:modelValue', newEditor.getHTML());
        }
      });
   
    editor.value = newEditor;
   
  });
  
    // Toolbar commands
    const toggleHeading = (level: 1 | 2 | 3 | 4 | 5) => {
      editor.value?.chain().focus().toggleHeading({ level }).run()
    }
  
    const toggleCodeBlock = () => {
      editor.value?.chain().focus().toggleCodeBlock().run()
    }
  
    const setCodeBlockLanguage = (language: string) => {
      if (!language) return
      editor.value?.chain().focus().setCodeBlock({ language }).run()
    }
  
    // Math commands
    const toggleMathInput = () => {
      showMathInput.value = !showMathInput.value;
      if (!showMathInput.value) {
        mathExpression.value = ''; // Clear input when hiding
      }
    };
  
    const insertMath = () => {
      if (mathExpression.value) {
        editor.value?.chain().focus().insertContent(`$${mathExpression.value}$`).run();
        mathExpression.value = '';
        showMathInput.value = false;
      }
    };
  watch(() => props.modelValue, (newValue) => {
    const editorValue = editor.value?.getHTML() || '';
    if (newValue !== editorValue) {
      editor.value?.commands.setContent(newValue, false);
    }
  });
  
  
  onBeforeUnmount(() => {
    editor.value?.destroy();
  });
  onUnmounted(() => {
    if (editor.value) {
      editor.value.destroy()
    }
  })
  </script>
  
  <style scoped>
  .tiptap-editor {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  .editor-toolbar {
    display: flex;
    gap: 0.25rem;
    padding: 0.5rem;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .editor-toolbar button {
    padding: 0.25rem 0.5rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  
  .editor-toolbar button.is-active {
    background-color: #e2e8f0;
  }
  
  .editor-content {
    padding: 1rem;
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }
  </style>