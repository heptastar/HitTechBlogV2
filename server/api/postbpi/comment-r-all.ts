/**
 * @api {get} /api/postbpi/comment-r-all Retrieve all comments for a specific post with pagination
 *
 * Query Parameters:
 * - post_id: ID of the post to retrieve comments for (required)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "comments": [
 *       {
 *         "id": 1,
 *         "post_id": 1,
 *         "content": "Comment content",
 *         "user_id": 1,
 *         "commenter_name": "User Name",
 *         "commenter_email": "user@example.com",
 *         "created_at": "2023-01-01T00:00:00.000Z",
 *         "status": "published"
 *       }
 *     ],
 *     "pagination": {
 *       "total": 100,
 *       "page": 1,
 *       "limit": 10,
 *       "totalPages": 10
 *     }
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing post_id parameter
 * - 404: Post not found
 * - 500: Server error
 */

import { H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const postId = Number(query.post_id)
    
    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'post_id parameter is required'
      })
    }
    
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const offset = (page - 1) * limit

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // Verify post exists
    const postExists = await db
      .prepare('SELECT 1 FROM posttb WHERE id = ?')
      .bind(postId)
      .first()
    
    if (!postExists) {
      throw createError({
        statusCode: 404,
        message: 'Post not found'
      })
    }

    // Get total count of comments for this post
    const totalResult = await db
      .prepare('SELECT COUNT(*) as total FROM commenttb WHERE post_id = ? AND status = ?')
      .bind(postId, 'published')
      .first<{ total: number }>()
    
    const total = totalResult?.total || 0
    const totalPages = Math.ceil(total / limit)

    // Get paginated comments
    const comments = await db
      .prepare('SELECT id, post_id, content, user_id, commenter_name, commenter_email, created_at, status FROM commenttb WHERE post_id = ? AND status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .bind(postId, 'published', limit, offset)
      .all<{ id: number; post_id: number; content: string; user_id: number | null; commenter_name: string | null; commenter_email: string | null; created_at: string; status: string }>()

    return {
      statusCode: 200,
      body: {
        comments: comments?.results || [],
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      }
    }
  } catch (error: any) {
    console.error('Retrieve comments error:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'An error occurred while retrieving comments'
    })
  }
})