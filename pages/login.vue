<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold">HitTechBlog</a>
        </div>
        <div class="flex items-center">
          <ul class="flex space-x-4 mr-6">
            <li>
              <a class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors" href="/">Home</a>
            </li>
            <ClientOnly>
              <li v-if="!isLoggedIn">
                <a class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors" href="/login">Login</a>
              </li>
              <li v-else>
                <a class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors" href="/logout">Logout</a>
                <span class="ml-2 text-green-400">✓</span>
              </li>
            </ClientOnly>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 mt-10 flex-grow">
      <!-- cookie test -->
      <!-- <div>
        <h1>Page A - Set Cookie</h1>
        <button @click="saveCookieTest">Save Cookie</button>
        <p>Current cookie value: {{ mycookietest || 'No cookie set' }}</p>
        <NuxtLink to="/page-b">Go to Page B</NuxtLink>
      </div> -->
      <!-- cookie test -->

      <div class="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Login to HitTechBlog</h1>
        
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            >
          </div>
          
          <div class="mb-6">
            <label for="password" class="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            >

          </div>
          
          <div class="text-center mt-4">
            <a href="/" class="text-blue-600 hover:text-blue-800 font-medium">← Back to Home</a>
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
        <p class="mt-4 text-center text-gray-600 text-sm">
          Don\'t have an account?
          <NuxtLink to="/register" class="text-blue-600 hover:underline">Register here</NuxtLink>
        </p>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Footer from '~/components/Footer.vue';
import { useCookie } from '#imports';

const email = ref('');
const password = ref('');
const isLoggedIn = computed(() => {
  const authCookie = useCookie('auth_token');
  return !!authCookie.value;
});

const myAuthCookie = useCookie('auth_token', {
  maxAge: 60 * 60 * 24 * 7 // 1 week expiry
})

//-----------------VVV COOKIETEST VVV-----------------
const mycookietest = useCookie('myCookieTestCKKey', {
  maxAge: 60 * 60 * 24 * 7 // 1 week expiry
})

function saveCookieTest() {
  mycookietest.value = 'Hello from Page A!'
  alert('Cookietest saved!')
}
function save_myCookieTestCKKey(ckvalue: string) {
  mycookietest.value = ckvalue
  // alert('Cookietest saved!'+mycookietest.value)
}

const authTokenCKInstance = useCookie('authTokenCKKey', {
  maxAge: 60 * 60 * 24 * 7 // 1 week expiry
})
function set_authTokenCKKey(ckvalue: string) {
  authTokenCKInstance.value = ckvalue
  // alert('Cookietest saved!'+mycookietest.value)
}
//-----------------^^^ COOKIETEST ^^^-----------------

async function handleLogin() {
  // This would typically include authentication logic
  // For now, we'll just log the attempt
  console.log('Login attempt:', { email: email.value, password: password.value });
  
  // In a real application, you would:
  // 1. Validate inputs
  try {
    const response = await $fetch<{body: {token: string, message: string}, statusCode: number}>('/api/user/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    });
    
    if (response.statusCode === 200) {
      // Store token in cookie for frontend use
      // const authCookie = useCookie('auth_token', {
      //     // path: '/',
      //     // sameSite: 'lax',
      //     // secure: process.env.NODE_ENV === 'production',
      //     maxAge: 60 * 60 * 24 * 7 // 1 week
      //   });
      myAuthCookie.value = response.body.token;
      set_authTokenCKKey(response.body.token);
      // save_myCookieTestCKKey(myAuthCookie.value);
      // authCookie.value = response.body.token;
      console.log('myAuthCookie@login===', myAuthCookie.value)
      console.log('response===',response.body.token)
      // Show success message
      alert(response.body.message || 'Login successful');
      
      // Redirect to home page with token parameter on successful login
      window.location.href = `/?token=${encodeURIComponent(response.body.token)}`;
    }
  } catch (error: any) {
    alert(error.data?.message || 'Login failed. Please try again.');
  }
}
</script>