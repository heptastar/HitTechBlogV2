<template>
  <div class="min-h-screen flex flex-col">
    <!-- Confirmation Modal -->
    <div v-if="showVerificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Confirm Submission</h3>
        <p class="mb-4">Are you sure you want to submit this comment?</p>
        <div class="flex justify-end space-x-2">
          <button 
            @click="showVerificationModal = false" 
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            @click="submitCommentActual" 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    <nav class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold">HitTechBlogV2</a>
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

    <main class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">{{ post.title }}</h1>
        <div class="flex items-center mb-6 text-sm text-gray-600">
          <span class="mr-4">By: {{ post.author_id>0?"admin":"anonymous" }}</span>
          <span class="mr-4">{{ new Date(post.created_at).toLocaleDateString() }}</span>
          <span class="mr-4">Category: {{ post.category }}</span>
          <span class="px-2 py-1 text-xs rounded-full" 
                :class="post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
            {{ post.status }}
          </span>
        </div>
        <TiptapReadonlyEditor v-model="post.content" />
        
        <div class="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 class="text-xl font-semibold mb-4">Leave a Comment</h2>
          <textarea 
            v-model="newComment" 
            class="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Write your comment here..."
          ></textarea>
          <button 
            @click="submitComment"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="!newComment.trim()"
          >
            Post Comment
          </button>
        </div>
        
        <div class="mt-12">
          <h2 class="text-2xl font-semibold mb-6">Comments</h2>
          <div v-if="comments.length > 0" class="space-y-4">
            <CommentCard v-for="comment in comments" :key="comment.id" :comment="comment" />
          </div>
          <div v-else class="text-gray-500">
            No comments yet.
          </div>
          
          <div class="flex justify-between items-center mt-6">
            <button 
              @click="fetchComments(currentPage - 1)" 
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
              Previous
            </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button 
              @click="fetchComments(currentPage + 1)" 
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
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
const isLoggedIn = ref(false)
const cookitToken = ref('')
const newComment = ref('')
interface Comment {
  id: number
  post_id: number
  content: string
  user_id: number | null
  commenter_name: string | null
  commenter_email: string | null
  created_at: string
  status: string
}

const comments = ref<Comment[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(10)

interface CommentResponse {
  body: {
    comments: any[]
    total_pages: number
  }
}

const showVerificationModal = ref(false)
const verificationCode = ref('')
const userVerificationInput = ref('')

interface VerificationCodeResponse {
  randomString: string
}

const submitComment = async () => {
  if (!newComment.value.trim()) return;
  
  try {
    // First get verification code from API
    const verificationResponse = await $fetch('/api/postbpi/randomstring4commentbutton', {
      method: 'GET'
    });
    
    if (!verificationResponse?.randomString) {
      throw new Error('Failed to get verification code');
    }
    
    const verificationCode = verificationResponse.randomString;
    const userInput = prompt(`Please enter this verification code: ${verificationCode}`);
    
    if (userInput !== verificationCode) {
      alert('Verification code does not match. Please try again.');
      return;
    }
    
    // Proceed with comment submission
    const requestBody = isLoggedIn.value 
      ? {
          post_id: postId.value,
          content: newComment.value,
          token: cookitToken.value
        }
      : {
          post_id: postId.value,
          content: newComment.value,
          commenter_name: 'Anonymous',
          commenter_email: 'anonymous@example.com'
        };

    const response = await $fetch(`/api/postbpi/comment`, {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response?.body) {
      newComment.value = '';
      await fetchComments(currentPage.value);
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
    alert('Failed to submit comment. Please try again.');
  }
}

const submitCommentActual = async () => {
  try {
    const requestBody = isLoggedIn.value 
      ? {
          post_id: postId.value,
          content: newComment.value,
          token: cookitToken.value
        }
      : {
          post_id: postId.value,
          content: newComment.value,
          commenter_name: 'Anonymous',
          commenter_email: 'anonymous@example.com'
        };

    const response = await $fetch(`/api/postbpi/comment`, {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response?.body) {
      newComment.value = ''
      await fetchComments(currentPage.value)
    }
  } catch (error) {
    console.error('Error submitting comment:', error)
  }
}

const fetchComments = async (page = 1) => {
  try {
    const response = await $fetch<{ body: { comments: Comment[], pagination: { total: number, page: number, limit: number, totalPages: number } } }>(`/api/postbpi/comment-r-all`, {
      method: 'GET',
      params: { 
        post_id: postId.value,
        page,
        limit: perPage.value
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response?.body) {
      comments.value = response.body.comments
      currentPage.value = page
      totalPages.value = response.body.pagination?.totalPages || 1
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
  }
}

onMounted(async () => {
  isLoggedIn.value = !!useCookie('token').value
  cookitToken.value = useCookie('token').value || ''
  
  try {
    if (postId.value) {
      const response = await $fetch(`/api/postbpi/retrieveonepost`, {
        method: 'GET',
        params: { id: postId.value },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response?.body?.post) {
        post.value = response.body.post
        await fetchComments()
      } else {
        console.warn('No post data received')
      }
    }
  } catch (error) {
    console.error('Failed to fetch post:', error)
  }
})
</script>

 