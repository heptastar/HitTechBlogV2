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
            <li>
              <button 
                @click="$router.push('/about')" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                About
              </button>
            </li>
            <li>
              <button 
                @click="$router.push('/search')" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Search
              </button>
            </li>
        
         
          </ul>
        </div>
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
          <li>
            <button 
              @click="$router.push('/about')" 
              class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
            >
              About
            </button>
          </li>
          <li>
            <button 
              @click="$router.push('/search')" 
              class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
            >
              Search
            </button>
          </li>
 
        
        </ul>
      </div>
    </nav>

    <main class="container mx-auto px-4 mt-6 flex-grow">
      <div class="flex items-center space-x-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search posts..."
          class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="performSearch"
        />
        <button
          @click="performSearch"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          :disabled="isLoading"
        >
          <svg v-if="!isLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span v-if="isLoading">Searching...</span>
          <span v-else>Search</span>
        </button>
      </div>
    </main>

    <div class="container mx-auto px-4 mt-6" v-if="searchResults.length > 0">
      <h2 class="text-2xl font-bold mb-4">Search Results</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SearchResultCard 
          v-for="post in searchResults" 
          :key="post.id" 
          :id="post.id"
          :title="post.title"
          :content="post.content"
          :author="post.author_id > 0 ? 'admin' : 'anonymous'"
          :createdAt="post.created_at"
          :category="post.category"
          :searchQuery="searchQuery"
          class="mb-6"
        />
      </div>
    </div>
    <div class="container mx-auto px-4 mt-6" v-if="error">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from '#imports';
import Footer from '~/components/Footer.vue';
import BlogPostCard from '~/components/BlogPostCard.vue';

const isMobileMenuOpen = ref(false);
const searchQuery = ref('');
interface Post {
  id: number;
  title: string;
  content: string;
  category: string | null;
  author_id: number;
  created_at: string;
  status: string;
}

const searchResults = ref<Post[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);



async function performSearch() {
  if (!searchQuery.value.trim()) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await $fetch('/api/postbpi/search', {
      query: { q: searchQuery.value }
    });
    
    searchResults.value = response.body.posts;
  } catch (err) {
    error.value = 'Failed to perform search. Please try again.';
    console.error('Search error:', err);
  } finally {
    isLoading.value = false;
  }
}


</script>