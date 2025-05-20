import { H3Event } from 'h3';
import { jwtVerify } from 'jose';

/*
Postman Example Request:

Method: POST
URL: {{base_url}}/api/imgbpi/upload

Headers:
  Cookie: auth_token={{your_auth_token}}

Body: raw (JSON)
{
  "image": "<base64_encoded_image_data>", // Base64 encoded image data to be stored in the 'imagev' column
  "imagename": "your_image_name.jpg"
}

Replace {{base_url}} with your application's base URL (e.g., http://localhost:3000).
Replace {{your_auth_token}} with the actual JWT token obtained after login.
Replace <base64_encoded_image_data> with the Base64 string of the image file.
Replace "your_image_name.jpg" with the desired name for the image.
*/

interface UploadImageRequest {
  image: string; // Base64 encoded image data
  imagename: string;
}

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
    console.log('D1 insert result:@upload 03' );

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

    const body = await readBody<UploadImageRequest>(event);
    console.log('D1 insert result:@upload 02' );

    // Validate required fields
    if (!body.image || !body.imagename) {
      throw createError({
        statusCode: 400,
        message: 'Image data and image name are required'
      });
    }
    console.log('D1 insert result:@upload 01' );

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB;

    // Insert image into imgtb
    // Note: D1 supports inserting Buffer/Uint8Array for BLOB
    // Store image as Base64 string in imagev column
    console.log('body.imagename@upload ',body.imagename );

    console.log('Preparing D1 insert statement...');
    const stmt = db
      .prepare('INSERT INTO imgtb (imagev, imagename) VALUES (?, ?)')
      .bind(body.image, body.imagename);

    console.log('Executing D1 insert statement...');
    const result = await stmt.run();

    console.log('D1 insert result:@upload', result);
    if (!result.success) {
      console.error('D1 insert failed:', result.error);
      throw createError({
        statusCode: 500,
        message: result.error || 'Failed to upload image'
      });
    }
    console.log('D1 insert result:@upload 2' );

    return {
      statusCode: 200,
      body: {
        message: 'Image uploaded successfully',
        imageId: result.meta.last_row_id
      }
    };
  } catch (error: any) {
    console.log('D1 insert result:@upload 3' );

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to upload image'
    });
  }
});