/**
 * @api {post} /api/user/delete Delete user
 *
 * Request Body:
 * {
 *   "id": 1
 * }
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "message": "User deleted successfully"
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing or invalid fields
 * - 401: Unauthorized
 * - 500: Server error
 */

import { H3Event } from 'h3'
import { jwtVerify } from 'jose'

interface DeleteRequest {
  id: number
}

export default defineEventHandler(async (event) => {
  // Ensure the request method is POST
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method Not Allowed'
    });
  }
  try {
    // Verify JWT token from cookie
    const token = getCookie(event, 'auth_token')
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Verify token and get decoded payload
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

    // Check if user has admin privileges (rank 1)
    // console.log("decoded.userrank===",decoded.userrank)
    if (decoded.userrank !== 3) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden'
      })
    }

    const body = await readBody<DeleteRequest>(event)
    if (!body.id) {
      throw createError({
        statusCode: 400,
        message: 'Missing user ID'
      })
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // Delete user from database
    try {
      const result = await db.prepare('DELETE FROM users WHERE id = ?').bind(body.id).run();
      
      // Check if the operation was successful
      if (!result || result.error) {
        console.error('Database operation failed:', result?.error || 'Unknown error');
        throw createError({
          statusCode: 500,
          message: 'Failed to delete user: Database operation failed'
        });
      }
      
      // Check if any rows were affected
      if (result.meta?.changes === 0) {
        return {
          statusCode: 404,
          body: {
            message: 'User not found or already deleted'
          }
        };
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw createError({
        statusCode: 500,
        message: 'Failed to delete user: Database error'
      });
    }

    // Ensure we return a properly formatted response
    return {
      statusCode: 200,
      body: {
        message: 'User deleted successfully'
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Delete user error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete user'
    })
  }
})