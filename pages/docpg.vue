<script setup lang="ts">
import { ref } from 'vue';
import TiptapReadonlyEditor from '~/components/TiptapReadonlyEditor.vue';
// ... existing code ...
const isMobileMenuOpen = ref(false);
import Footer from '~/components/Footer.vue';

const productFeaturesContent = ref(`
  <h2 class="text-xl font-semibold mb-3">Welcome to HitTechBlog Project!</h2>

  <h3 class="text-lg font-medium mb-2">Features:</h3>
  <ul class="list-disc list-inside mb-4">
    <li class="mb-1">TOTALLY ZERO COST DEPLOYED INDEPENDENT BLOG CMS SYSTEM WHICH CAN BE DEPLOYED AND GO ONLINE IN SECONDS.</li>
    <li class="mb-1">NO SERVER NEEDED!!! but using FREE Cloudflare's severless Pages system with daily 100,000 free visit volume, ZERO COST.</li>
    <li class="mb-1">NO DATABASE NEEDED!!! but using FREE Cloudflare's D1 which is a sqlite database with 5G free space, ZERO COST.</li>
    <li class="mb-1">NO DOMAIN NAME NEEDED!!! but using FREE given one by Cloudflare Pages with pattern: http://www.&lt;your-self-domain-name&gt;.pages.dev</li>
  </ul>

  <h3 class="text-lg font-medium mb-2">Functionalties:</h3>
  <ul class="list-disc list-inside mb-4">
    <li class="mb-1">User registration and login using emails are supported.</li>
    <li class="mb-1">Creating, editing, and deleting blog posts for admin user whose userrank == 3.</li>
    <li class="mb-1">Commenting on posts is supported for anonymous users.</li>
    <li class="mb-1">Searching for posts supporting full-text search for post's catefory, title and content in western and eastern languages.</li>
    <li class="mb-1">User settings: setting of blog name, hero title, hero content and displaying of selected links.</li>
    <li class="mb-1">Admin features (userrank == 3): registered users' retrieving, updating and deleting and posts' creating, retrieving, updating and deleting.</li>
    <li class="mb-1">Use Tiptap rich text editor, supporting LaTex math formula based on Katex, code block, headings from H1 to H3, ordered list, unordered list, bold and italic.</li>
    <li class="mb-1">Personal note-taking and public posts, both modes are supported.</li>
    <li class="mb-1">This blog cms system is supporting both text and image.</li>
  </ul>

  <p class="mb-4">We use modern technologies like Vue 3, Nuxt 3, and Tailwind CSS to provide a fast and responsive experience.</p>
`)

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold">HitTechBlog</a>
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
                @click="$router.push('/docpg')" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Docs
              </button>
            </li>
            <li>
              <button 
                @click="$router.push('/licensepg')" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                License
              </button>
            </li>
          </ul>
          <button 
            @click="$router.push('/login')" 
            class="px-4 py-2 bg-white hover:bg-gray-100 text-blue-600 rounded-lg shadow-md transition-colors"
          >
            Login
          </button>
        </div>
      </div>
      <div v-if="isMobileMenuOpen" class="md:hidden mt-2">
        <ul class="flex flex-col space-y-2">
          <li>
            <button 
              @click="$router.push('/'); isMobileMenuOpen = false;" 
              class="w-full text-left px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
            >
              Home
            </button>
          </li>
          <li>
            <button 
              @click="$router.push('/docpg'); isMobileMenuOpen = false;" 
              class="w-full text-left px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
            >
              Docs
            </button>
          </li>
          <li>
            <button 
              @click="$router.push('/licensepg'); isMobileMenuOpen = false;" 
              class="w-full text-left px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
            >
              License
            </button>
          </li>
          <li>
            <button 
              @click="$router.push('/login'); isMobileMenuOpen = false;" 
              class="w-full text-left px-4 py-2 bg-white hover:bg-gray-100 text-blue-600 rounded-lg shadow-md transition-colors"
            >
              Login
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container mx-auto p-4 flex-grow">
      <h1 class="text-2xl font-bold mb-4">README</h1>
      <TiptapReadonlyEditor :content="productFeaturesContent" />
    </div>

    <Footer />
  </div>
</template>

<style scoped>
/* Add any specific styles for the doc page here */
</style>