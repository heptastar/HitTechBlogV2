/**
 * @api {get} /api/user/retrieveallusers Retrieve all users with pagination
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "users": [
 *       {
 *         "id": 1,
 *         "email": "user1@example.com",
 *         "userrank": 0,
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
    // console.log('TokenOnRetrievealluser===:', token)
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
      console.error('JWT verification error:', err);
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

    // Get total count of users
    const totalResult = await db
      .prepare('SELECT COUNT(*) as total FROM users')
      .first<{ total: number }>()
    
    const total = totalResult?.total || 0
    const totalPages = Math.ceil(total / limit)

    // Get paginated users
    const users = await db
      .prepare('SELECT id, email, userrank, created_at FROM users WHERE userrank != 3 LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all<{ id: number; email: string; userrank: number; created_at: string }>()

    return {
      statusCode: 200,
      body: {
        users: users?.results || [],
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
    console.error('Retrieve users error:', error)
    throw createError({
      statusCode: 500,
      message: 'An error occurred while retrieving users'
    })
  }
})