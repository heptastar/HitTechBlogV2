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
                @click="router.push('/')" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                @click="router.push('/posts')" 
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
                @click="router.push('/')" 
                class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                @click="router.push('/posts')" 
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
      <!-- The update form will be placed here -->
      <div class="w-full max-w-full bg-white p-8 border border-gray-200 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Update Post</h1>
        
        <div v-if="loading" class="text-center">Loading...</div>
        
        <div v-if="formError" class="text-red-500 mb-4">{{ formError }}</div>
        <!-- Remove the old success message display -->
        <!-- <div v-if="updateSuccess" class="text-green-500 mb-4">Post updated successfully!</div> -->
        
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Title</label>
          <input 
            v-model="currentPost.title" 
            class="w-full px-3 py-2 border rounded"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Content</label>
          <TiptapEditor4Updatepg ref="tiptapEditorRef" v-model="currentPost.content" />
        </div>
          
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Category</label>
          <input 
            v-model="currentPost.category" 
            class="w-full px-3 py-2 border rounded"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Status</label>
          <select v-model="currentPost.status" class="w-full px-3 py-2 border rounded">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="router.push('/posts')" 
            class="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button 
            @click="handleUpdate" 
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="loading"
          >
            {{ loading ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="updateSuccess" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="relative p-8 border w-96 shadow-lg rounded-md bg-white text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-3">Success</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">Post updated successfully!</p>
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
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { decodeJwt } from 'jose';
import TiptapEditor4Updatepg from '~/components/TiptapEditor4Updatepg.vue';

interface PostData {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
}

interface FetchPostResponse {
  body: {
    post?: PostData;
    message?: string;
  };
}

interface UpdatePostResponse {
  body: {
    message?: string;
  };
}

definePageMeta({
  middleware: ['auth'], // Requires auth
});

const isMobileMenuOpen = ref(false);

const currentPost = ref<PostData>({ // Use the defined interface
  id: '',
  title: '',
  content: '',
  category: '',
  status: 'draft' // Default status
});
const loading = ref(false);
const formError = ref('');
const updateSuccess = ref(false);
const token4jwt = ref("");

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const myauthcookiefromlogin = useCookie('authTokenCKKey');
  const token = myauthcookiefromlogin.value;
  token4jwt.value = token + "";
 
  if (token) {
    try {
      const decoded = decodeJwt(token) as { userrank?: number };
      // userRank.value = decoded?.userrank || 0; // Not needed for update page
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }

  const postId = route.query.id;
+ console.log('Route query:', route.query);
  if (postId) {
    await fetchPost(postId as string);
  }
});

const fetchPost = async (postId: string) => {
  console.log('Fetching post with ID:', postId);
  try {
    loading.value = true;
    formError.value = '';
    
    const { data } = await useFetch<FetchPostResponse>(`/api/postbpi/retrieveoneonpostspage?id=${postId}`, {
      headers: {
        'Cookie': `auth_token=${token4jwt.value}`
      }
    });
    
    console.log('Fetch post API response:', data.value);
    
    if (data.value?.body?.post) {
      currentPost.value = data.value.body.post;
      // Use nextTick to ensure the editor is mounted before setting content
      nextTick(() => {
        // If using TiptapEditor, you might need a specific method to set content
        // For now, direct assignment works with v-model
      });
    } else {
      formError.value = data.value?.body?.message || 'Failed to fetch post';
    }
  } catch (err: any) {
    formError.value = err.message || 'Failed to fetch post';
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async () => {
  try {
    loading.value = true;
    formError.value = '';
    
    const { data } = await useFetch<UpdatePostResponse>('/api/postbpi/update', {
      method: 'POST',
      body: {
        id: currentPost.value.id,
        title: currentPost.value.title,
        content: currentPost.value.content,
        category: currentPost.value.category,
        status: currentPost.value.status
      },
      headers: {
        'Cookie': `auth_token=${token4jwt.value}`
      }
    });
    
    if (data.value?.body?.message) {
      updateSuccess.value = true;
      // Remove the old timeout for redirection
      // setTimeout(() => {
      //   // Redirect back to posts page after successful update
      //   router.push('/posts');
      // }, 1000);
    } else {
      formError.value = data.value?.body?.message || 'Failed to update post';
    }
  } catch (err: any) {
    formError.value = err.message || 'Failed to update post';
  } finally {
    loading.value = false;
  }
};

// Add a new method to handle the OK button click
const handleOkClick = () => {
  updateSuccess.value = false; // Hide the modal
  router.push('/posts'); // Redirect to posts page
};

// Add a ref for the TiptapEditor component if needed for specific editor methods
const tiptapEditorRef = ref<any>(null);

</script>

<style scoped>
/* Scoped styles for the page */
</style>