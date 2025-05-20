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
              <button 
                @click="$router.push('/')" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                @click="$router.go(-1)" 
                class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg shadow-md transition-colors"
              >
                Back
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 mt-6 flex-grow">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6" v-if="post.title">
        <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
        <div class="flex flex-wrap items-center text-gray-600 mb-6">
          <span class="mr-4">By: {{ post.author_id>0?"admin":"anonymous" }}</span>
          <span class="mr-4">{{ new Date(post.created_at).toLocaleDateString() }}</span>
          <span class="mr-4">Category: {{ post.category }}</span>
          <span class="px-2 py-1 text-xs rounded-full" 
                :class="post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
            {{ post.status }}
          </span>
        </div>
        <TiptapReadonlyEditor :content="post.content" />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import TiptapReadonlyEditor from '~/components/TiptapReadonlyEditor.vue'

const route = useRoute()
const postId = ref(route.query.id)
const post = ref({
  id: 0,
  title: '',
  content: '',
  category: "",
  status: '',
  author_id: 0,
  created_at: ''
})

onMounted(async () => {
  try {
    if (postId.value) {
      const response = await $fetch(`/api/postbpi/retrieveoneonpostspage`, {
        method: 'GET',
        params: { id: postId.value },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response?.body?.post) {
        post.value = response.body.post
      } else {
        console.warn('No post data received')
      }
    }
  } catch (error) {
    console.error('Failed to fetch post:', error)
    navigateTo('/login')
  }
})
</script>