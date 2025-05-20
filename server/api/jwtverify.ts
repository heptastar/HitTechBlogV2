/**
 * @api {post} /api/jwtverify JWT verification
 *
 * Postman Example:
 * -----------------------------
 * Method: POST
 * URL: https://your-domain.com/api/jwtverify
 * Headers:
 *   Content-Type: application/json
 *   Authorization: Bearer <token>
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "valid": true,
 *     "payload": {
 *       "userId": 123,
 *       "iat": 1234567890,
 *       "exp": 1234567890
 *     }
 *   }
 * }
 *
 * Error Responses:
 * - 401: Invalid or expired token
 * {
 *   "statusCode": 401,
 *   "message": "Invalid or expired token"
 * }
 *
 * - 500: Server error
 * {
 *   "statusCode": 500,
 *   "message": "An error occurred during token verification"
 * }
 */

import { H3Event } from 'h3'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Authorization header with Bearer token required'
      })
    }

    const token = authHeader.split(' ')[1]
    
    try {
      const jwtSecret = useRuntimeConfig().JWT_SECRET || 'default_secret';
      const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret));
      
      return {
        statusCode: 200,
        body: {
          valid: true,
          payload: payload,
          userrank: (payload as { userrank?: number }).userrank || 0
        }
      }
    } catch (err) {
      throw createError({
        statusCode: 401,
        message: 'Invalid or expired token'
      })
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('JWT verification error:', error)
    throw createError({
      statusCode: 500,
      message: 'An error occurred during token verification'
    })
  }
})