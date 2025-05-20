import { H3Event } from 'h3';
import { jwtVerify } from 'jose';

/*
Postman Example Request:

Method: GET
URL: {{base_url}}/api/imgbpi/retrieveoneimage?imageId={{your_image_id}}

Headers:
  Cookie: auth_token={{your_auth_token}}

Replace {{base_url}} with your application's base URL (e.g., http://localhost:3000).
Replace {{your_auth_token}} with the actual JWT token obtained after login.
Replace {{your_image_id}} with the ID of the image you want to retrieve.
*/

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Verify JWT token from cookie
    const token = getCookie(event, 'auth_token');
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }

    // Verify token
    let decoded: any;
    try {
      const config = useRuntimeConfig();
      const jwtSecret = config.JWT_SECRET || process.env.JWT_SECRET || 'fallback-secret-for-development';
      if (!jwtSecret || jwtSecret === 'fallback-secret-for-development') {
        console.warn('Using fallback JWT secret - this is not secure for production!');
      }
      const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret));
      decoded = payload;
    } catch (err) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }

    // Get image ID from query parameters
    const query = getQuery(event);
    const imageId = query.imageId;

    if (!imageId) {
      throw createError({
        statusCode: 400,
        message: 'Image ID is required'
      });
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB;

    // Retrieve image from imgtb
    // Retrieve image from imgtb
    // Now storing image as Base64 string in imagev column
    const { results } = await db
      .prepare('SELECT imagename, imagev FROM imgtb WHERE id = ?')
      .bind(String(imageId))
      .all();

    if (!results || results.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Image not found'
      });
    }

    const imageRecord = results[0];
    // Image is already stored as Base64 in imagev column

    return {
      statusCode: 200,
      body: {
        imagename: imageRecord.imagename,
        image: imageRecord.imagev
      }
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to retrieve image'
    });
  }
});