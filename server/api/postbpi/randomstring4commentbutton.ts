/**
 * @api {get} /api/postbpi/randomstring4commentbutton Generate random string for comment button
 *
 * Postman Example:
 * -----------------------------
 * Method: GET
 * URL: https://your-domain.com/api/postbpi/randomstring4commentbutton
 *
 * Success Response (200):
 * {
 *   "randomString": "Ab12"
 * }
 *
 * Note: Returns a 4-character alphanumeric random string
 */

import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return { 
    randomString: result
  }
})