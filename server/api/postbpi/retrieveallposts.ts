/**
 * @api {get} /api/postbpi/retrieveallposts Retrieve all posts with pagination
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "posts": [
 *       {
 *         "id": 1,
 *         "title": "Post Title",
 *         "content": "Post content",
 *         "category": "Technology",
 *         "status": "draft",
 *         "author_id": 1,
 *         "created_at": "2023-01-01T00:00:00.000Z"
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
 * - 401: Unauthorized
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
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const offset = (page - 1) * limit

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // Get total count of posts
    const totalResult = await db
      .prepare('SELECT COUNT(*) as total FROM posttb')
      .first<{ total: number }>()
    
    const total = totalResult?.total || 0
    const totalPages = Math.ceil(total / limit)

    // Get paginated posts
    const posts = await db
      .prepare('SELECT id, title, content, category, author_id, created_at, status FROM posttb ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all<{ id: number; title: string; content: string; category: string | null; author_id: number; created_at: string; status: string }>()

    return {
      statusCode: 200,
      body: {
        posts: posts?.results || [],
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Retrieve posts error:', error)
    throw createError({
      statusCode: 500,
      message: 'An error occurred while retrieving posts'
    })
  }
})