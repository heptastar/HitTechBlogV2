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
            <li v-if="userRank === 3">
              <button 
                @click="fetchUsers"
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                List All Users
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
            <li v-if="userRank === 3">
              <button 
                @click="fetchUsers"
                class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                List All Users
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
    
    <!-- Post Editor Modal -->
    <div v-if="showEditor" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl">
        <h2 class="text-xl font-bold mb-4">Write New Post</h2>
        
        <form @submit.prevent="submitPost">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Title</label>
            <input 
              v-model="post.title" 
              type="text" 
              class="w-full px-3 py-2 border rounded"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Category</label>
            <input 
              v-model="post.category" 
              type="text" 
              class="w-full px-3 py-2 border rounded"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Status</label>
            <select 
              v-model="post.status" 
              class="w-full px-3 py-2 border rounded"
              required
            >
              <option value="draft">Draft</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Content</label>
            <TiptapEditor v-model="post.content" />
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              type="button" 
              @click="showEditor = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Update User Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Update User</h2>
        
        <form @submit.prevent="submitUpdate">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Email</label>
            <input 
              v-model="currentUser.email" 
              type="email" 
              class="w-full px-3 py-2 border rounded"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">User Rank</label>
            <input 
              v-model="currentUser.userrank" 
              type="number" 
              min="0"
              class="w-full px-3 py-2 border rounded"
              required
            >
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              type="button" 
              @click="showUpdateModal = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    <main class="container mx-auto px-4 mt-10 flex-grow">
      <div class="w-full mx-4 bg-white p-8 border border-gray-200 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Settings</h1>
        

        
        <div v-if="loading" class="text-center">Loading...</div>
        
        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
        
        <div v-if="activeView === 'users' && users.length > 0" class="overflow-x-auto">
          <table class="w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-2 px-4 border-b text-left">ID</th>
                <th class="py-2 px-4 border-b text-left">Email</th>
                <th class="py-2 px-4 border-b text-left">Rank</th>
                <th class="py-2 px-4 border-b text-left">Created At</th>
                <th class="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="py-2 px-4 border-b">{{ user.id }}</td>
                <td class="py-2 px-4 border-b">{{ user.email }}</td>
                <td class="py-2 px-4 border-b">{{ user.userrank }}</td>
                <td class="py-2 px-4 border-b">{{ new Date(user.created_at).toLocaleString() }}</td>
                <td class="py-2 px-4 border-b flex space-x-2">
                  <button 
                    @click="updateUser(user.id)"
                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button 
                    @click="deleteUser(user.id)"
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
        
        <div v-if="activeView === 'posts' && posts.length > 0" class="overflow-x-auto">
          <h2 class="text-xl font-bold mb-4">Posts</h2>
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
                    @click="updatePost(post.id)"
                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Update
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
    <Footer />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'], // Requires both auth and admin role
});

import { ref } from 'vue';
 
import Footer from '~/components/Footer.vue';
const isMobileMenuOpen = ref(false);
// import { jwtVerify } from 'jose'; // Remove this import

const showEditor = ref(false);
const showSettingsDropdown = ref(false);
const post = ref({
  title: '',
  content: '',
  category: '',
  status: 'draft'
});

const openBlogNameSetting = () => {
  showSettingsDropdown.value = false;
  // TODO: Implement blog name setting functionality
  alert('Blog Name Setting clicked');
};

const openThemeSetting = () => {
  showSettingsDropdown.value = false;
  // TODO: Implement theme setting functionality
  alert('Theme Setting clicked');
};

const openHeroTitleSetting = () => {
  showSettingsDropdown.value = false;
  // TODO: Implement hero title setting functionality
  alert('Hero Title Setting clicked');
};

const openHeroContentSetting = () => {
  showSettingsDropdown.value = false;
  // TODO: Implement hero content setting functionality
  alert('Hero Content Setting clicked');
};

const submitPost = async () => {
  try {
    const response = await $fetch('/api/postbpi/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth_token=${token4jwt.value}`
      },
      body: {
        title: post.value.title,
        content: post.value.content,
        category: post.value.category,
        status: post.value.status
      }
    });
    
    if (response.statusCode === 200) {
      alert('Post created successfully!');
      showEditor.value = false;
      post.value = { title: '', content: '' ,category: "", status: "draft"};
    } else if (response.statusCode === 400) {
      alert(response.body.message || 'Missing or invalid fields');
    } else if (response.statusCode === 401) {
      alert('Unauthorized - Please login again');
    } else {
      alert('Failed to create post');
    }
  } catch (error) {
    console.error('Error creating post:', error);
    alert('Failed to create post');
  }
};
const userRank = ref(0);
const token4jwt = ref("");

onMounted(async () => {
  const myauthcookiefromlogin = useCookie('authTokenCKKey')
  const token = myauthcookiefromlogin.value
  console.log('Token:OnMounted@Settings======', token);
  token4jwt.value = token + "";

  if (token) {
    try {
      // Call the /api/jwtverify endpoint
      const response = await $fetch('/api/jwtverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Assuming the response body contains the userrank
      if (response && response.body && typeof response.body.userrank === 'number') {
        userRank.value = response.body.userrank;
        console.log('User Rank from API:', userRank.value);
      } else {
        console.error('API response did not contain userrank:', response);
        userRank.value = 0; // Default to 0 if rank is not found
      }

      // Remove the old jwtVerify logic
      // const secret = new TextEncoder().encode('YOUR_SECRET_KEY');
      // const { payload } = await jwtVerify(token, secret);
      // userRank.value = (payload as { userrank?: number })?.userrank || 0;
      // console.log('User Rank===:', userRank.value);
    } catch (err) {
      console.error('Error fetching user rank:', err);
      userRank.value = 0; // Default to 0 on error
    }
  }
});

const users = ref<any[]>([]);
const posts = ref<any[]>([]);
const loading = ref(false);
const error = ref('');
const activeView = ref<'users' | 'posts' | null>(null);
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
});

const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = '';
    activeView.value = 'users';
    posts.value = [];
    
    const { data } = await useFetch('/api/user/retrieveallusers', {
      query: {
        page: pagination.value.page,
        limit: pagination.value.limit
      }
    });
    
    if (data.value) {
      users.value = data.value.body.users;
      pagination.value = {
        ...pagination.value,
        total: data.value.body.pagination.total,
        totalPages: data.value.body.pagination.totalPages
      };
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch users';
  } finally {
    loading.value = false;
  }
};

const fetchPosts = async () => {
  try {
    loading.value = true;
    error.value = '';
    activeView.value = 'posts';
    users.value = [];
    
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
  if (activeView.value === 'users') {
    if (pagination.value.page < pagination.value.totalPages) {
      pagination.value.page++;
      fetchUsers();
    }
  } else if (activeView.value === 'posts') {
    if (pagination.value.page < pagination.value.totalPages) {
      pagination.value.page++;
      fetchPosts();
    }
  }
};

const prevPage = () => {
  if (activeView.value === 'users') {
    if (pagination.value.page > 1) {
      pagination.value.page--;
      fetchUsers();
    }
  } else if (activeView.value === 'posts') {
    if (pagination.value.page > 1) {
      pagination.value.page--;
      fetchPosts();
    }
  }
};

const nextPostsPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++;
    fetchPosts();
  }
};

const prevPostsPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    fetchPosts();
  }
};

const showUpdateModal = ref(false);
const currentUser = ref<any>({});
const showPostUpdateModal = ref(false);
const currentPost = ref<any>({});

const updateUser = async (userId: string) => {
  try {
    loading.value = true;
    error.value = '';
    
    // Find the user in the list
    const user = users.value.find(u => u.id === Number(userId));
    if (user) {
      currentUser.value = { ...user };
      showUpdateModal.value = true;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load user data';
  } finally {
    loading.value = false;
  }
};

const submitUpdate = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const { data } = await useFetch('/api/user/update', {
      method: 'PUT',
      body: {
        id: currentUser.value.id,
        email: currentUser.value.email,
        userrank: currentUser.value.userrank
      }
    });
    
    if (data.value) {
      showUpdateModal.value = false;
      fetchUsers(); // Refresh user list
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to update user';
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (userId: string) => {
  try {
    const confirmed = confirm('WARNING: This will permanently delete the user. Are you sure you want to proceed?');
    if (!confirmed) return;
    
    loading.value = true;
    error.value = '';
    
    const response = await $fetch('/api/user/delete', {
      method: 'POST',
      body: { id: userId }
    });
    
    if ((response as any).statusCode === 404) {
      alert((response as any).body.message || 'User not found or already deleted');
    } else if ((response as any).error) {
      throw new Error((response as any).error.message);
    } else {
      alert('User deleted successfully!');
    }
    
    fetchUsers(); // Refresh user list regardless of whether the user was found
    error.value = '';
  } catch (err: any) {
    error.value = err.message || 'Failed to delete user';
  } finally {
    loading.value = false;
  }
};

const updatePost = async (postId: string) => {
  try {
    loading.value = true;
    error.value = '';
    
    // Find the post in the list
    const post = posts.value.find(p => p.id === Number(postId));
    if (post) {
      currentPost.value = { ...post };
      showPostUpdateModal.value = true;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load post data';
  } finally {
    loading.value = false;
  }
};

const submitPostUpdate = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await $fetch('/api/postbpi/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth_token=${token4jwt.value}`
      },
      body: {
        id: currentPost.value.id,
        title: currentPost.value.title,
        content: currentPost.value.content,
        category: currentPost.value.category,
        status: currentPost.value.status
      }
    });
    
    if (response.statusCode === 200) {
      showPostUpdateModal.value = false;
      fetchPosts(); // Refresh post list
    } else if (response.statusCode === 400) {
      alert(response.body.message || 'Missing or invalid fields');
    } else if (response.statusCode === 401) {
      alert('Unauthorized - Please login again');
    } else {
      alert('Failed to update post');
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to update post';
  } finally {
    loading.value = false;
  }
};
</script>