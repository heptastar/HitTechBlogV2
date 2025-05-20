/**
 * @api {post} /api/postbpi/comment Create a new comment
 *
 * Postman Example:
 * -----------------------------
 * Method: POST
 * URL: https://your-domain.com/api/postbpi/comment
 * Headers:
 *   Content-Type: application/json
 *
 * Request Body (All fields required for anonymous comments):
 * {
 *   "post_id": 1,
 *   "content": "Comment content",
 *   "commenter_name": "John Doe",
 *   "commenter_email": "john@example.com"
 * }
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "message": "Comment created successfully",
 *     "commentId": 1
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing required fields
 * {
 *   "statusCode": 400,
 *   "message": "Post ID, content, commenter name and email are required"
 * }
 *
 * - 404: Post not found
 * {
 *   "statusCode": 404,
 *   "message": "Post not found"
 * }
 *
 * - 500: Server error
 * {
 *   "statusCode": 500,
 *   "message": "Failed to create comment"
 * }
 */

import { H3Event } from 'h3'

interface CreateCommentRequest {
  post_id: number
  content: string
  commenter_name: string
  commenter_email: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreateCommentRequest>(event)
    
    // Validate required fields
    if (!body.post_id || !body.content || !body.commenter_name || !body.commenter_email) {
      throw createError({
        statusCode: 400,
        message: 'Post ID, content, commenter name and email are required'
      })
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // Check if post exists
    const post = await db
      .prepare('SELECT id FROM posttb WHERE id = ?')
      .bind(body.post_id)
      .first()

    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Post not found'
      })
    }

    // All comments will be anonymous with required name and email
    const userId = null;

    // Insert new comment
    const result = await db
      .prepare('INSERT INTO commenttb (post_id, content, user_id, commenter_name, commenter_email) VALUES (?, ?, ?, ?, ?)')
      .bind(body.post_id, body.content, userId, body.commenter_name, body.commenter_email)
      .run()

    if (!result.success) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create comment'
      })
    }

    return {
      statusCode: 200,
      body: {
        message: 'Comment created successfully',
        commentId: result.meta.last_row_id
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create comment'
    })
  }
})