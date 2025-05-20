/**
 * @api {post} /api/user/login User login
 *
 * Postman Example:
 * -----------------------------
 * Method: POST
 * URL: https://your-domain.com/api/user/login
 * Headers:
 *   Content-Type: application/json
 *
 * Request Body:
 * {
 *   "email": "john@example.com",
 *   "password": "securepass123"
 * }
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "message": "Login successful"
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
 * - 401: Invalid credentials
 * {
 *   "statusCode": 401,
 *   "message": "Invalid email or password"
 * }
 *
 * - 500: Server error
 * {
 *   "statusCode": 500,
 *   "message": "An error occurred during login"
 * }
 */

import { H3Event } from 'h3'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

interface LoginRequest {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LoginRequest>(event)

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

    // Get user from database
    const user = await db
      .prepare('SELECT id, password_hash, userrank FROM users WHERE email = ?')
      .bind(email)
      .first<{ id: number; password_hash: string; userrank: number }>()

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password_hash as string)

    if (!passwordMatch) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const config = useRuntimeConfig();
    const jwtSecret = config.JWT_SECRET || process.env.JWT_SECRET || 'fallback-secret-for-development';
    if (!jwtSecret || jwtSecret === 'fallback-secret-for-development') {
      console.warn('Using fallback JWT secret - this is not secure for production!');
    }
    
    // Generate JWT token using jose
    const token = await new SignJWT({ userId: user.id, userrank: user.userrank })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(jwtSecret))

    // Set HTTP-only cookie
    setCookie(event, 'auth_token', token, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
      maxAge: 3600
    })

    return {
      statusCode: 200,
      body: {
        message: 'Login successful',
        token: token
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      message: 'An error occurred during login'
    })
  }
})