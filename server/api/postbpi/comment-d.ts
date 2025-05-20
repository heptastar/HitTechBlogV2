/**
 * @api {post} /api/postbpi/comment-d Delete a comment
 *
 * Postman Example:
 * -----------------------------
 * Method: POST
 * URL: https://your-domain.com/api/postbpi/comment-d
 * Headers:
 *   Content-Type: application/json
 *   Cookie: auth_token=<token>
 *
 * Request Body:
 * {
 *   "commentId": 1
 * }
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "message": "Comment deleted successfully"
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing comment ID
 * {
 *   "statusCode": 400,
 *   "message": "Comment ID is required"
 * }
 *
 * - 401: Unauthorized
 * {
 *   "statusCode": 401,
 *   "message": "Unauthorized"
 * }
 *
 * - 403: Not authorized to delete this comment
 * {
 *   "statusCode": 403,
 *   "message": "Not authorized to delete this comment"
 * }
 *
 * - 500: Server error
 * {
 *   "statusCode": 500,
 *   "message": "Failed to delete comment"
 * }
 */

import { H3Event } from 'h3'
import { jwtVerify } from 'jose'

interface DeleteCommentRequest {
  commentId: number
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

    const body = await readBody<DeleteCommentRequest>(event)
    
    // Validate required fields
    if (!body.commentId) {
      throw createError({
        statusCode: 400,
        message: 'Comment ID is required'
      })
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // Check if comment exists and belongs to user (or user has admin rights)
    const comment = await db
      .prepare('SELECT user_id FROM commenttb WHERE id = ?')
      .bind(body.commentId)
      .first<{ user_id: number }>()

    if (!comment) {
      throw createError({
        statusCode: 404,
        message: 'Comment not found'
      })
    }

    // Only allow deletion if user is author or admin (userrank > 0)
    if (comment.user_id !== decoded.userId && decoded.userrank <= 0) {
      throw createError({
        statusCode: 403,
        message: 'Not authorized to delete this comment'
      })
    }

    // Delete comment
    const result = await db
      .prepare('DELETE FROM commenttb WHERE id = ?')
      .bind(body.commentId)
      .run()

    if (!result.success) {
      throw createError({
        statusCode: 500,
        message: 'Failed to delete comment'
      })
    }

    return {
      statusCode: 200,
      body: {
        message: 'Comment deleted successfully'
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete comment'
    })
  }
})