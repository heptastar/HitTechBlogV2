<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">Navigation</nav>
    <main class="container mx-auto px-4 mt-10 flex-grow">
      <div class="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-md text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Logging out...</h1>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCookie } from '#imports';
import Navigation from '~/components/Navigation.vue';

const router = useRouter();
const authCookie = useCookie('auth_token');
// authTokenCKKey
const authTokenCKKeyCookie = useCookie('authTokenCKKey');

// Clear auth cookie and redirect to login
onMounted(() => {
    console.log('authCookie in logout===', authCookie.value)
  authCookie.value = null;
  authTokenCKKeyCookie.value = null;
  router.push('/login');
});
</script>