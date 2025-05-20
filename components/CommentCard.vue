<template>
  <div class="comment-card">
    <div class="comment-header">
      <span class="commenter-name">{{ comment.commenter_name }}</span>
      <span class="comment-date">{{ formattedDate }}</span>
    </div>
    <div class="comment-content">
      {{ comment.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  comment: {
    type: Object as () => {
      id: number
      post_id: number
      content: string
      user_id: number | null
      commenter_name: string | null
      commenter_email: string | null
      created_at: string
      status: string
    },
    required: true
  }
})

const formattedDate = computed(() => {
  return new Date(props.comment.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped>
.comment-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: white;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.commenter-name {
  font-weight: 600;
  color: #2d3748;
}

.comment-date {
  color: #718096;
}

.comment-content {
  color: #4a5568;
  line-height: 1.5;
}
</style>