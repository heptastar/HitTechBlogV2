/**
 * @api {put} /api/user/update Update user information
 *
 * Request Body:
 * {
 *   "id": 1,
 *   "email": "newemail@example.com",
 *   "userrank": 1
 * }
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "message": "User updated successfully"
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

interface UpdateRequest {
  id: number
  email?: string
  userrank?: number
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
    try {
      const jwtSecret = useRuntimeConfig().JWT_SECRET || 'default_secret';
      await jwtVerify(token, new TextEncoder().encode(jwtSecret));
    } catch (err) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const body = await readBody<UpdateRequest>(event)
    
    // Validate required fields
    if (!body.id) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      })
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // Build update query based on provided fields
    const updates: string[] = []
    const values: any[] = []
    
    if (body.email) {
      updates.push('email = ?')
      values.push(body.email)
    }
    
    if (body.userrank !== undefined) {
      updates.push('userrank = ?')
      values.push(body.userrank)
    }

    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    // Add id to values for WHERE clause
    values.push(body.id)

    // Execute update
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
    await db.prepare(query).bind(...values).run()

    return {
      statusCode: 200,
      body: {
        message: 'User updated successfully'
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Update user error:', error)
    throw createError({
      statusCode: 500,
      message: 'An error occurred while updating user'
    })
  }
})