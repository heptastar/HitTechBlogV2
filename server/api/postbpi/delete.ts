/**
 * @api {post} /api/postbpi/delete Delete a post
 *
 * Postman Example:
 * -----------------------------
 * Method: POST
 * URL: https://your-domain.com/api/postbpi/delete
 * Headers:
 *   Content-Type: application/json
 *   Cookie: auth_token=<token>
 *
 * Request Body:
 * {
 *   "postId": 1
 * }
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "message": "Post deleted successfully"
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing post ID
 * {
 *   "statusCode": 400,
 *   "message": "Post ID is required"
 * }
 *
 * - 401: Unauthorized
 * {
 *   "statusCode": 401,
 *   "message": "Unauthorized"
 * }
 *
 * - 403: Not authorized to delete this post
 * {
 *   "statusCode": 403,
 *   "message": "Not authorized to delete this post"
 * }
 *
 * - 500: Server error
 * {
 *   "statusCode": 500,
 *   "message": "Failed to delete post"
 * }
 */

import { H3Event } from 'h3'
import { jwtVerify } from 'jose'

interface DeletePostRequest {
  postId: number
}

export default defineEventHandler(async (event) => {
  try {
    // Verify JWT token from cookie
    const token = getCookie(event, 'auth_token')
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Verify token
    let decoded: any
    try {
      const config = useRuntimeConfig();
      const jwtSecret = config.JWT_SECRET || process.env.JWT_SECRET || 'fallback-secret-for-development';
      if (!jwtSecret || jwtSecret === 'fallback-secret-for-development') {
        console.warn('Using fallback JWT secret - this is not secure for production!');
      }
      const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret));
      decoded = payload;
    } catch (err) {
      console.error('JWT verification error:', err);
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const body = await readBody<DeletePostRequest>(event)
    
    // Validate required fields
    if (!body.postId) {
      throw createError({
        statusCode: 400,
        message: 'Post ID is required'
      })
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // Check if post exists and belongs to user (or user has admin rights)
    const post = await db
      .prepare('SELECT author_id FROM posttb WHERE id = ?')
      .bind(body.postId)
      .first<{ author_id: number }>()

    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Post not found'
      })
    }

    // Only allow deletion if user is author or admin (userrank > 0)
    if (post.author_id !== decoded.userId && decoded.userrank <= 0) {
      throw createError({
        statusCode: 403,
        message: 'Not authorized to delete this post'
      })
    }

    // Delete post
    const result = await db
      .prepare('DELETE FROM posttb WHERE id = ?')
      .bind(body.postId)
      .run()

    if (!result.success) {
      throw createError({
        statusCode: 500,
        message: 'Failed to delete post'
      })
    }

    return {
      statusCode: 200,
      body: {
        message: 'Post deleted successfully'
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete post'
    })
  }
})