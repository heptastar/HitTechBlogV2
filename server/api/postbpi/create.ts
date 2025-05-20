/**
 * @api {post} /api/postbpi/create Create a new post
 *
 * Postman Example:
 * -----------------------------
 * Method: POST
 * URL: https://your-domain.com/api/postbpi/create
 * Headers:
 *   Content-Type: application/json
 *   Cookie: auth_token=<token>
 *
 * Request Body:
 * {
 *   "title": "Post Title",
 *   "content": "Post content",
 *   "category": "Technology"
 * }
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "message": "Post created successfully",
 *     "postId": 1
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing or invalid fields
 * {
 *   "statusCode": 400,
 *   "message": "Title and content are required"
 * }
 *
 * - 401: Unauthorized
 * {
 *   "statusCode": 401,
 *   "message": "Unauthorized"
 * }
 *
 * - 500: Server error
 * {
 *   "statusCode": 500,
 *   "message": "Failed to create post"
 * }
 */

import { H3Event } from 'h3'
import { jwtVerify } from 'jose'

interface CreatePostRequest {
  title: string
  content: string
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
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const body = await readBody<CreatePostRequest>(event)
    
    // Validate required fields
    if (!body.title || !body.content) {
      throw createError({
        statusCode: 400,
        message: 'Title and content are required'
      })
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    console.log("decoded.userId@postbpi/create.ts",decoded.userId)
    // Insert new post
    const result = await db
      .prepare('INSERT INTO posttb (title, content, author_id, category, status) VALUES (?, ?, ?, ?, ?)')
      .bind(body.title, body.content, decoded.userId, body.category || null, body.status || 'draft')
      .run()

    if (!result.success) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create post'
      })
    }

    return {
      statusCode: 200,
      body: {
        message: 'Post created successfully',
        postId: result.meta.last_row_id
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create post'
    })
  }
})