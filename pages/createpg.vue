<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold">HitTechBlogV2</a>
        </div>
        <div class="md:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-white focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        <div class="hidden md:flex items-center">
          <ul class="flex space-x-4 mr-6">
            <li>
              <button 
                @click="$router.push('/')" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                @click="$router.push('/posts')" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Posts
              </button>
            </li>
          </ul>
        </div>
        <!-- Mobile menu -->
        <div class="md:hidden" v-if="isMobileMenuOpen">
          <ul class="flex flex-col space-y-2 mt-4">
            <li>
              <button 
                @click="$router.push('/')" 
                class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                @click="$router.push('/posts')" 
                class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Posts
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 mt-10 flex-grow flex items-center justify-center">
      <!-- Create Post Form directly on the page -->
      <div class="bg-white rounded-lg p-6 w-full max-w-7xl shadow-md border border-gray-200">
        <h2 class="text-xl font-bold mb-4 text-center">Create New Post</h2>
        
        <div v-if="formError" class="text-red-500 mb-4">{{ formError }}</div>

        
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Title</label>
          <input 
            v-model="newPost.title" 
            class="w-full px-3 py-2 border rounded"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Content</label>
          <TiptapEditor4Createpg v-model="newPost.content" />
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Category</label>
          <input 
            v-model="newPost.category" 
            class="w-full px-3 py-2 border rounded"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Status</label>
          <select v-model="newPost.status" class="w-full px-3 py-2 border rounded">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="handleCreate" 
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="loading"
          >
            {{ loading ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="createSuccess" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="relative p-8 border w-96 shadow-lg rounded-md bg-white text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-3">Success</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">Post created successfully!</p>
        </div>
        <div class="items-center px-4 py-3">
          <button 
            @click="handleOkClick"
            class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            OK
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { decodeJwt } from 'jose';
import TiptapEditor4Createpg from '~/components/TiptapEditor4Createpg.vue';

definePageMeta({
  middleware: ['auth'], // Requires auth
});

const isMobileMenuOpen = ref(false);

const loading = ref(false);
const formError = ref('');
const createSuccess = ref(false);
const token4jwt = ref("");

const newPost = ref<any>({
  title: '',
  content: '',
  category: '',
  status: 'draft'
});

onMounted(() => {
  const myauthcookiefromlogin = useCookie('authTokenCKKey');
  const token = myauthcookiefromlogin.value;
  token4jwt.value = token + "";
});

const router = useRouter();

const handleOkClick = () => {
  createSuccess.value = false;
  router.push('/posts');
};

const handleCreate = async () => {
  try {
    loading.value = true;
    formError.value = '';
    
    const { data } = await useFetch('/api/postbpi/create', {
      method: 'POST',
      body: {
        title: newPost.value.title,
        content: newPost.value.content,
        category: newPost.value.category,
        status: newPost.value.status
      },
      headers: {
        'Cookie': `auth_token=${token4jwt.value}`
      }
    });
    
    if (data.value?.body?.message) {
      createSuccess.value = true;
      // Optionally redirect or clear form after success
      // Clear form after success
      newPost.value = {
        title: '',
        content: '',
        category: '',
        status: 'draft'
      };
    } else {
      formError.value = data.value?.body?.message || 'Failed to create post';
    }
  } catch (err: any) {
    formError.value = err.message || 'Failed to create post';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Scoped styles for the page */
</style>