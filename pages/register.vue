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
              <a class="text-white hover:text-gray-200" href="/">Home</a>
            </li>
 
          </ul>
        </div>
      </div>
    </nav>
    <main class="container mx-auto px-4 mt-10 flex-grow">
      <div class="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Register for HitTechBlog</h1>
        <form @submit.prevent="handleRegister">
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
            <div class="grid grid-cols-1 gap-4">
              <div class="relative">
                <label for="password" class="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  id="password" 
                  v-model="password" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="••••••••"
                  required
                >
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-8 p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <div class="relative">
                <label for="passwordConfirm" class="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  id="passwordConfirm" 
                  v-model="passwordConfirm" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="••••••••"
                  required
                >
              </div>
            </div>
          </div>
          
          <div class="text-center mt-4">
            <a href="/" class="text-blue-600 hover:text-blue-800 font-medium">← Back to Home</a>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">Register</button>
        </form>
        <p class="mt-4 text-center text-gray-600 text-sm">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-600 hover:underline">Login here</NuxtLink>
        </p>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
 
import Footer from '~/components/Footer.vue';

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

async function handleRegister() {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    if (password.value !== passwordConfirm.value) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
    const response = await fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    interface RegisterResponse {
      statusCode?: number;
      message?: string;
      body?: {
        message?: string;
      };
      [key: string]: any;
    }
    const data = await response.json() as RegisterResponse;
    if (!response.ok) {
      errorMessage.value = data.message || 'Registration failed.';
    } else {
      successMessage.value = data.body?.message || 'Registration successful! You can now log in.';
      email.value = '';
      password.value = '';
      alert(successMessage.value);
      router.push('/login');
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again.';
  }
}
</script>