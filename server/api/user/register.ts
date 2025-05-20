/**
 * @api {post} /api/user/register User registration
 *
 * Postman Example:
 * -----------------------------
 * Method: POST
 * URL: https://your-domain.com/api/user/register
 * Headers:
 *   Content-Type: application/json
 *
 * Request Body:
 * {
 *   "email": "john@example.com",
 *   "password": "securepass123"
 * }
 *
 * Success Response (201):
 * {
 *   "statusCode": 201,
 *   "body": {
 *     "message": "User registered successfully"
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing fields
 * {
 *   "statusCode": 400,
 *   "message": "Email and password are required"
 * }
 *
 * - 409: Email already exists
 * {
 *   "statusCode": 409,
 *   "message": "Email already registered"
 * }
 *
 * - 500: Server error
 * {
 *   "statusCode": 500,
 *   "message": "An error occurred during registration"
 * }
 */

import { H3Event } from 'h3'
import bcrypt from 'bcryptjs'

interface RegisterRequest {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<RegisterRequest>(event)

    // Validate required fields
    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required'
      })
    }

    const { email, password } = body

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    // Check if user already exists
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first()

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Email already registered'
      })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Insert new user
    await db.prepare('INSERT INTO users (email, password_hash, userrank) VALUES (?, ?, 0)')
      .bind(email, password_hash)
      .run()

    return {
      statusCode: 201,
      body: {
        message: 'User registered successfully'
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Register error:', error)
    throw createError({
      statusCode: 500,
      message: 'An error occurred during registration'
    })
  }
}
)