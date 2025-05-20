<template>
  <article class="mb-6 pb-6 border-b border-gray-200 hover:bg-gray-50 transition-colors p-4 rounded-lg">
    <h3 class="text-xl font-semibold mb-1 text-blue-700">{{ title }}</h3>
    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
      <span>Published on {{ new Date(createdAt).toLocaleDateString() }}</span>
      <span>•</span>
      <span>By {{ author }}</span>
      <span v-if="category" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{{ category }}</span>
    </div>
    <div class="mb-3 text-gray-700">
      <span v-html="highlightMatches(content)"></span>
      <span v-if="content.length > 150">...</span>
    </div>
    <a :href="`/opencardonindex?id=${id}`" class="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded no-underline inline-block">
      Read More
    </a>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  status?: string;
  category?: string | null;
  searchQuery?: string;
}>();

const highlightMatches = (text: string) => {
  if (!props.searchQuery) return text.substring(0, 150);
  
  const query = props.searchQuery.toLowerCase();
  const startIdx = text.toLowerCase().indexOf(query);
  
  if (startIdx === -1) return text.substring(0, 150);
  
  const endIdx = startIdx + query.length;
  const before = text.substring(Math.max(0, startIdx - 20), startIdx);
  const match = text.substring(startIdx, endIdx);
  const after = text.substring(endIdx, endIdx + 50);
  
  return `${before}<span class="bg-yellow-200 font-medium">${match}</span>${after}`;
};
</script>