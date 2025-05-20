<script setup lang="ts">
import { ref } from 'vue';
import TiptapReadonlyEditor from '~/components/TiptapReadonlyEditor.vue';

const licenseText = `<p class="mb-2">MIT License</p>

<p class="mb-2">Copyright (c) [2025] [Beijing Heptastar Intelligent Tech Ltd.]</p>

<p class="mb-2">Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:</p>

<p class="mb-2">The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.</p>

<p class="mb-2">THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</p>

<p class="mb-2">---</p>

<p class="mb-2">Note: This license applies to the current version of [HitTechBlog]. The copyright holder reserves the right to release future versions of the Software under different license terms.</p>`;

const isMobileMenuOpen = ref(false);
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
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mx-auto p-4 flex-grow">
      <h1 class="text-2xl font-bold mb-4">Software License (MIT License)</h1>
      <TiptapReadonlyEditor :content="licenseText" />
    </div>

    <Footer />
  </div>
</template>

<style scoped>
/* Add any specific styles for the license page here */
</style>