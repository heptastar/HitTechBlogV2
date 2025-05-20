/**
 * @api {put} /api/postbpi/update Update a post
 *
 * Postman Example:
 * -----------------------------
 * Method: PUT
 * URL: https://your-domain.com/api/postbpi/update
 * Headers:
 *   Content-Type: application/json
 *   Cookie: auth_token=<token>
 *
 * Request Body:
 * {
 *   "id": 1,
 *   "title": "Updated Title",
 *   "content": "Updated content",
 *   "category": "Updated Category",
 *   "status": "published"
 * }
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "message": "Post updated successfully"
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing or invalid fields
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
 * - 403: Forbidden (user not author)
 * {
 *   "statusCode": 403,
 *   "message": "Not authorized to update this post"
 * }
 *
 * - 500: Server error
 * {
 *   "statusCode": 500,
 *   "message": "Failed to update post"
 * }
 */

import { H3Event } from 'h3'
import { jwtVerify } from 'jose'

interface UpdatePostRequest {
  id: number
  title?: string
  content?: string
  category?: string
  status?: string
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

    // Verify token and get user ID
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

    const body = await readBody<UpdatePostRequest>(event)
    
    // Validate required fields
    if (!body.id) {
      throw createError({
        statusCode: 400,
        message: 'Post ID is required'
      })
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // First check if post exists and user is author
    const post = await db
      .prepare('SELECT author_id FROM posttb WHERE id = ?')
      .bind(body.id)
      .first()

    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Post not found'
      })
    }

    if (post.author_id !== decoded.userId) {
      throw createError({
        statusCode: 403,
        message: 'Not authorized to update this post'
      })
    }

    // Build update query based on provided fields
    const updates: string[] = []
    const values: any[] = []
    
    if (body.title) {
      updates.push('title = ?')
      values.push(body.title)
    }
    
    if (body.content) {
      updates.push('content = ?')
      values.push(body.content)
    }

    if (body.category) {
      updates.push('category = ?')
      values.push(body.category)
    }

    if (body.status) {
      updates.push('status = ?')
      values.push(body.status)
    }

    // Always update the updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP')

    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    // Add id to values for WHERE clause
    values.push(body.id)

    // Execute update
    const query = `UPDATE posttb SET ${updates.join(', ')} WHERE id = ?`
    await db.prepare(query).bind(...values).run()

    return {
      statusCode: 200,
      body: {
        message: 'Post updated successfully'
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Update post error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update post'
    })
  }
})