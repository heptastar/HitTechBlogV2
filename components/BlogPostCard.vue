<template>
  <article class="mb-6 pb-6 border-b">
    <h3 class="text-xl font-semibold mb-1"><a :href="`/opencardonindex?id=${id}`" class="text-blue-700 hover:underline">{{ title }}</a></h3>
    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
      <span>Published on {{ new Date(createdAt).toLocaleDateString() }}</span>
      <span>•</span>
      <span>By {{ author }}</span>
    </div>
    <div class="mb-3" v-html="excerpt || content.substring(0, 150)"></div>
    <a :href="`/opencardonindex?id=${id}`" class="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded no-underline">Read More</a>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  status?: string;
  category?: string | null;
  excerpt?: string;
}>();
</script>