<template>
  <nav class="bg-blue-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <a href="/" class="text-xl font-bold">HitTechBlog</a>
      </div>
      <div class="flex items-center">
        <ul class="flex space-x-4 mr-6">
          <li>
            <a class="text-white hover:text-gray-200" href="/">Home</a>
          </li>
          <li>
            <a class="text-white hover:text-gray-200" href="/docpg">About</a>
          </li>
          <li>
            <a class="text-white hover:text-gray-200" href="/posts">Posts</a>
          </li>
          <ClientOnly>
            <li v-if="isLoggedIn">
              <a class="text-white hover:text-gray-200" href="/settings">Settings</a>
            </li>
          </ClientOnly>
          <ClientOnly>
            <li v-if="!isLoggedIn">
              <a class="text-white hover:text-gray-200" href="/login">Login</a>
            </li>
            <li v-else>
              <a class="text-white hover:text-gray-200" href="/logout">Logout</a>
              <span class="ml-2 text-green-400">✓</span>
            </li>
          </ClientOnly>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useCookie } from '#imports';

const isLoggedIn = computed(() => {
  const authCookie = useCookie('auth_token');
  return !!authCookie.value;
});
</script>
