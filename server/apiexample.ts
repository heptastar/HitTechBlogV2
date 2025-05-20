// /**
//  * @api {post} /api/user/login User login with JWT
//  * 
//  * Postman Example:
//  * -----------------------------
//  * Method: POST
//  * URL: https://your-domain.com/api/user/login
//  * Headers: 
//  *   Content-Type: application/json
//  * 
//  * Request Body:
//  * {
//  *   "email": "john@example.com",
//  *   "password": "securepass123"
//  * }
//  * 
//  * Success Response (200):
//  * {
//  *   "statusCode": 200,
//  *   "body": {
//  *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
//  *     "user": {
//  *       "email": "john@example.com",
//  *       "userrank": 0
//  *     }
//  *   }
//  * }
//  * 
//  * Error Responses:
//  * - 400: Missing fields
//  * {
//  *   "statusCode": 400,
//  *   "message": "Email and password are required"
//  * }
//  * 
//  * - 401: Invalid credentials
//  * {
//  *   "statusCode": 401,
//  *   "message": "Invalid email or password"
//  * }
//  * 
//  * - 500: Server error
//  * {
//  *   "statusCode": 500,
//  *   "message": "An error occurred during login"
//  * }
//  */

// import { H3Event } from 'h3'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'

// interface LoginRequest {
//   email: string
//   password: string
// }

// interface User {
//   email: string
//   password_hash: string
//   userrank: number
// }

// export default defineEventHandler(async (event) => {
//   try {
//     const body = await readBody<LoginRequest>(event)

//     // Validate required fields
//     if (!body.email || !body.password) {
//       throw createError({
//         statusCode: 400,
//         message: 'Email and password are required'
//       })
//     }

//     const { email, password } = body

//     // Get D1 database instance
//     const db = event.context.cloudflare.env.DB

//     // Get user from database
//     const user = await db
//       .prepare('SELECT email, password_hash, userrank FROM users WHERE email = ?')
//       .bind(email)
//       .first<User>()

//     if (!user) {
//       throw createError({
//         statusCode: 401,
//         message: 'Invalid email or password'
//       })
//     }

//     // Verify password
//     const isMatch = await bcrypt.compare(password, user.password_hash)
//     if (!isMatch) {
//       throw createError({
//         statusCode: 401,
//         message: 'Invalid email or password'
//       })
//     }

//     const config = useRuntimeConfig()
    
//     // Check JWT_SECRET is configured
//     // console.log('Checking JWT_SECRET:', config.jwtSecret)
//     if (!config.jwtSecret) {
//       throw createError({
//         statusCode: 500,
//         message: 'JWT_SECRET is not configured in environment variables'
//       })
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { email: user.email, userrank: user.userrank },
//       config.jwtSecret,
//       { expiresIn: '1h' }
//     )

//     return {
//       statusCode: 200,
//       body: {
//         token,
//         user: {
//           email: user.email,
//           userrank: user.userrank
//         }
//       }
//     }
//   } catch (error: any) {
//     if (error.statusCode) {
//       throw error
//     }
//     console.error('Login error:', error)
//     throw createError({
//       statusCode: 500,
//       message: 'An error occurred during login'
//     })
//   }
// })