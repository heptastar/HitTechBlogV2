/**
 * @api {get} /api/postbpi/retrieveoneonpostspage Retrieve one post by ID (JWT protected)
 *
 * Query Parameters:
 * - id: Post ID (required)
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "post": {
 *       "id": 1,
 *       "title": "Post Title",
 *       "content": "Post content",
 *       "category": "Technology",
 *       "status": "published",
 *       "author_id": 1,
 *       "created_at": "2023-01-01T00:00:00.000Z"
 *     }
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing or invalid ID
 * - 401: Unauthorized
 * - 404: Post not found
 * - 500: Server error
 */

import { H3Event } from 'h3'
import { jwtVerify } from 'jose'

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
    try {
      const secret = new TextEncoder().encode(useRuntimeConfig().JWT_SECRET || 'default_secret');
      await jwtVerify(token, secret);
    } catch (err) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Get query parameters
    const query = getQuery(event)
    const id = Number(query.id)
    
    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Missing or invalid post ID'
      })
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // Get post by ID (no status restriction)
    const post = await db
      .prepare('SELECT id, title, content, category, author_id, created_at, status FROM posttb WHERE id = ?')
      .bind(id)
      .first<{ id: number; title: string; content: string; category: string ; author_id: number; created_at: string; status: string }>()

    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Post not found'
      })
    }

    return {
      statusCode: 200,
      body: {
        post
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Retrieve post error:', error)
    throw createError({
      statusCode: 500,
      message: 'An error occurred while retrieving the post'
    })
  }
})