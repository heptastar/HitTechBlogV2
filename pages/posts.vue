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
            <li v-if="userRank === 3">
              <button 
                @click="fetchPosts"
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                List All
              </button>
            </li>
            <li>
              <button 
                @click="router.push('/createpg')"
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Create Post
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
            <li v-if="userRank === 3">
              <button 
                @click="fetchPosts"
                class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                List All
              </button>
            </li>
            <li>
              <button 
                @click="router.push('/createpg')"
                class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Create Post
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 mt-10 flex-grow">
      <div class="w-full mx-4 bg-white p-8 border border-gray-200 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Posts</h1>
        
        <div v-if="loading" class="text-center">Loading...</div>
        
        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
        
        <div v-if="posts.length > 0" class="overflow-x-auto">
          <table class="w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-2 px-4 border-b text-left">ID</th>
                <th class="py-2 px-4 border-b text-left">Title</th>
                <th class="py-2 px-4 border-b text-left">Category</th>
                <th class="py-2 px-4 border-b text-left">Status</th>
                <th class="py-2 px-4 border-b text-left">Created At</th>
                <th class="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
                <td class="py-2 px-4 border-b">{{ post.id }}</td>
                <td class="py-2 px-4 border-b">{{ post.title }}</td>
                <td class="py-2 px-4 border-b">{{ post.category }}</td>
                <td class="py-2 px-4 border-b">{{ post.status }}</td>
                <td class="py-2 px-4 border-b">{{ new Date(post.created_at).toLocaleString() }}</td>
                <td class="py-2 px-4 border-b">
                  <button 
                    @click="() => updatePost(post)"
                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                  >
                    Update
                  </button>
                  <button 
                    @click="router.push(`/opencardonpostspage?id=${post.id}`)"
                    class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2 flex items-center justify-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    <span>Open</span>
                  </button>
                  <button 
                    @click="() => confirmDelete(post)"
                    class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="flex justify-between items-center mt-4">
            <button 
              @click="prevPage" 
              :disabled="pagination.page === 1"
              class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
            <button 
              @click="nextPage" 
              :disabled="pagination.page === pagination.totalPages"
              class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Update Post Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-xl font-bold mb-4">Update Post</h2>
        
        <div v-if="formError" class="text-red-500 mb-4">{{ formError }}</div>
        <div v-if="updateSuccess" class="text-green-500 mb-4">Post updated successfully!</div>
        
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
          <TiptapEditor ref="tiptapEditorRef" v-model="currentPost.content" />
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
            @click="showUpdateModal = false" 
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
    </div>
  </div>
  
  <!-- Create Post Modal -->
  <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4">Create New Post</h2>
      
      <div v-if="formError" class="text-red-500 mb-4">{{ formError }}</div>
      <div v-if="createSuccess" class="text-green-500 mb-4">Post created successfully!</div>
      
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
        <TiptapEditor v-model="newPost.content" />
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
          @click="showCreateModal = false" 
          class="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button 
          @click="handleCreate" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          :disabled="loading"
        >
          {{ loading ? 'Creating...' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'], // Requires both auth and admin role
});

import { ref } from 'vue';
import { decodeJwt } from 'jose';
import TiptapEditor from '~/components/TiptapEditor.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isMobileMenuOpen = ref(false);

const posts = ref<any[]>([]);
const loading = ref(false);
const error = ref('');
const userRank = ref(0);
const token4jwt = ref("");

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
});

onMounted(() => {
  const myauthcookiefromlogin = useCookie('authTokenCKKey');
  const token = myauthcookiefromlogin.value;
  token4jwt.value = token + "";
 
  if (token) {
    try {
      const decoded = decodeJwt(token) as { userrank?: number };
      userRank.value = decoded?.userrank || 0;
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }
});

const fetchPosts = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const { data } = await useFetch('/api/postbpi/retrieveallposts', {
      query: {
        page: pagination.value.page,
        limit: pagination.value.limit
      },
      headers: {
        'Cookie': `auth_token=${token4jwt.value}`
      }
    });
    
    if (data.value) {
      posts.value = data.value.body.posts;
      pagination.value = {
        ...pagination.value,
        total: data.value.body.pagination.total,
        totalPages: data.value.body.pagination.totalPages
      };
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch posts';
  } finally {
    loading.value = false;
  }
};

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++;
    fetchPosts();
  }
};

const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    fetchPosts();
  }
};

const showUpdateModal = ref(false);
const showCreateModal = ref(false);
const currentPost = ref<any>({});
const newPost = ref<any>({
  title: '',
  content: '',
  category: '',
  status: 'draft'
});
const formError = ref('');
const updateSuccess = ref(false);
const createSuccess = ref(false);

const updatePost = (post: any) => {
  // Navigate to the update page instead of showing the modal
  router.push({ path: '/updatepostpg', query: { id: post.id } });
};

const handleUpdate = async () => {
  try {
    loading.value = true;
    formError.value = '';
    
    const { data } = await useFetch('/api/postbpi/update', {
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
      setTimeout(() => {
        showUpdateModal.value = false;
        updateSuccess.value = false;
        fetchPosts();
      }, 1000);
    } else {
      formError.value = data.value?.body?.message || 'Failed to update post';
    }
  } catch (err: any) {
    formError.value = err.message || 'Failed to update post';
  } finally {
    loading.value = false;
  }
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
      setTimeout(() => {
        showCreateModal.value = false;
        createSuccess.value = false;
        newPost.value = {
          title: '',
          content: '',
          category: '',
          status: 'draft'
        };
        fetchPosts();
      }, 1000);
    } else {
      formError.value = data.value?.body?.message || 'Failed to create post';
    }
  } catch (err: any) {
    formError.value = err.message || 'Failed to create post';
  } finally {
    loading.value = false;
  }
};

// Add to script section
const confirmDelete = (post: any) => {
  if (confirm(`Are you sure you want to delete post "${post.title}"? This action cannot be undone.`)) {
    deletePost(post.id);
  }
};

const deletePost = async (postId: number) => {
  try {
    await $fetch('/api/postbpi/delete', {
      method: 'POST',
      body: { postId },
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth_token=${token4jwt.value}`
      }
    });
    fetchPosts();
  } catch (error: any) {
    error.value = error.data?.message || 'Failed to delete post';
  }
};

// Add a ref for the QuillEditor component
const tiptapEditorRef = ref<any>(null);

</script>

<style scoped>
/* Page styling will be added here */
</style>