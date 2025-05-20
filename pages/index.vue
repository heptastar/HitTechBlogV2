<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold">{{ blogName }}</a>
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
                About
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
                @click="$router.push('/search')" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Search
              </button>
            </li>
            <ClientOnly>
              <li v-if="isLoggedIn">
                <button 
                  @click="$router.push('/settings?token=' + (cookitToken || ''))" 
                  class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
                >
                  Settings
                </button>
              </li>
            </ClientOnly>
            <ClientOnly>
              <li v-if="!isLoggedIn">
                <button 
                  @click="$router.push('/login')" 
                  class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
                >
                  Login
                </button>
              </li>
              <li v-else>
                <button 
                  @click="$router.push('/logout')" 
                  class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
                >
                  Logout
                </button>
                <span class="ml-2 text-green-400">✓</span>
              </li>
            </ClientOnly>
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
          <ClientOnly>
            <li v-if="isLoggedIn">
              <button 
                @click="$router.push('/settings?token=' + (cookitToken || ''))" 
                class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Settings
              </button>
            </li>
          </ClientOnly>
          <ClientOnly>
            <li v-if="!isLoggedIn">
              <button 
                @click="$router.push('/login')" 
                class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Login
              </button>
            </li>
            <li v-else>
              <button 
                @click="$router.push('/logout')" 
                class="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Logout
              </button>
            </li>
          </ClientOnly>
        </ul>
      </div>
    </nav>

    <main class="container mx-auto px-4 mt-6 flex-grow">
      <header class="text-center py-16 bg-blue-50">
        <h1 class="text-4xl font-light text-gray-800">{{ runtimeConfig.public.HERO_TITLE || 'Welcome to My Tech Blog!' }}</h1>
        <p class="text-xl font-light mt-2 text-gray-700">{{ runtimeConfig.public.HERO_CONTENT || 'Exploring the latest in technology, development, and more.' }}</p>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div class="md:col-span-2">
          <h2 class="text-2xl font-semibold mb-4">Latest Posts</h2>
          <div v-if="loading" class="text-center py-8">
            <p>Loading posts ...</p>
          </div>
          <div v-else-if="error" class="text-center py-8 text-red-500">
            <p>Error loading posts: {{ error }}</p>
          </div>
          <template v-else>
            <BlogPostCard 
              v-for="post in posts"
              :key="post.id"
              :id="post.id"
              :title="post.title"
              :content="post.content"
              :author="post.author_id>0?'Admin':'Anonymous'"
              :created-at="post.created_at"
              :status="post.status"
              :category="post.category"
            />
            
            <div class="flex flex-wrap justify-center mt-8 space-x-2">
              <button 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span class="px-4 py-2">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              
              <button 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </template>
        </div>
        <aside>
          <!-- <h3 class="text-xl font-semibold mb-3">Categories</h3>
          <ul class="list-none p-0 mb-6">
            <li class="mb-1"><a href="#" class="text-blue-600 hover:text-blue-800">Web Development</a></li>
            <li class="mb-1"><a href="#" class="text-blue-600 hover:text-blue-800">Cloud Computing</a></li>
            <li class="mb-1"><a href="#" class="text-blue-600 hover:text-blue-800">DevOps</a></li>
            <li class="mb-1"><a href="#" class="text-blue-600 hover:text-blue-800">AI & Machine Learning</a></li>
          </ul> -->
          <h3 class="text-xl font-semibold mb-3 mt-6">Selected Useful Links</h3>
          <ul class="list-none p-0">
            <li class="mb-1"><a :href="runtimeConfig.public.LINK1URL || '#null'" class="text-blue-600 hover:text-blue-800">{{ runtimeConfig.public.LINK1LABEL || 'LINK1LABEL'}} </a></li>
            <li class="mb-1"><a :href="runtimeConfig.public.LINK2URL || '#null'" class="text-blue-600 hover:text-blue-800">{{ runtimeConfig.public.LINK2LABEL || 'LINK2LABEL'}}</a></li>
            <li class="mb-1"><a :href="runtimeConfig.public.LINK3URL || '#null'" class="text-blue-600 hover:text-blue-800">{{ runtimeConfig.public.LINK3LABEL || 'LINK3LABEL'}}</a></li>
            <li class="mb-1"><a :href="runtimeConfig.public.LINK4URL || '#null'" class="text-blue-600 hover:text-blue-800">{{ runtimeConfig.public.LINK4LABEL || 'LINK4LABEL'}}</a></li>
            <li class="mb-1"><a :href="runtimeConfig.public.LINK5URL || '#null'" class="text-blue-600 hover:text-blue-800">{{ runtimeConfig.public.LINK5LABEL || 'LINK5LABEL'}}</a></li>
            <!-- <li class="mb-1"><a href="#" class="text-blue-600 hover:text-blue-800">GitHub</a></li>
            <li class="mb-1"><a href="#" class="text-blue-600 hover:text-blue-800">GitHub</a></li> -->
          </ul>
        </aside>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from '#imports';
import Footer from '~/components/Footer.vue';
import BlogPostCard from '~/components/BlogPostCard.vue';

const isMobileMenuOpen = ref(false);

const isLoggedIn = ref(false);
const cookitToken = ref("");
const router = useRouter();

const runtimeConfig = useRuntimeConfig();
const blogName = ref(runtimeConfig.public.BLOG_NAME || 'My Tech Blog');

interface Post {
  id: number;
  title: string;
  content: string;
  category: string | null;
  author_id: number;
  created_at: string;
  status: string;
}

const posts = ref<Post[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const checkAuthCookie = computed(() => {
  // const authCookie = useCookie('auth_token');
  // myauthcookiefromlogin
  const authCookie = useCookie('auth_token');

  return !!authCookie.value;
});

 

async function verifyToken(token: string) {
  // console.log('Token@verifyToken@index======:', token);
  if (!token) {
    isLoggedIn.value = false;
    return;
  }

  try {
    const response = await $fetch('/api/jwtverify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    isLoggedIn.value = response.body.valid;
  } catch (error) {
    isLoggedIn.value = false;
  }
}

// const authCookie = useCookie('auth_token', {
//   path: '/',
//   sameSite: 'lax',
//   secure: process.env.NODE_ENV === 'production',
//   maxAge: 60 * 60 * 24 * 7 // 1 week
// });

onMounted(async () => {
  const myauthcookiefromlogin = useCookie('authTokenCKKey');
  const token = myauthcookiefromlogin.value;
  
  verifyToken(token + "");
  await fetchPosts();
});

const currentPage = ref(1);
const totalPages = ref(1);

async function fetchPosts() {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await $fetch('/api/postbpi/retrieveallpublishedposts', {
      method: 'GET',
      params: {
        page: currentPage.value,
        limit: 10
      }
    });
    
    posts.value = response.body.posts;
    totalPages.value = response.body.pagination.totalPages || 1;
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'Failed to fetch posts';
    }
  } finally {
    loading.value = false;
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchPosts();
  }
}
</script>