/**
 * @api {get} /api/postbpi/retrieveonepost Retrieve one published post by ID
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
 * - 404: Post not found or not published
 * - 500: Server error
 */

import { H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
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

    // Get published post by ID
    const post = await db
      .prepare('SELECT id, title, content, category, author_id, created_at, status FROM posttb WHERE id = ? AND status = ?')
      .bind(id, 'published')
      .first<{ id: number; title: string; content: string; category: string ; author_id: number; created_at: string; status: string }>()

    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Post not found or not published'
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