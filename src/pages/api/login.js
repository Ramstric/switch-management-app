import mysql from 'mysql2/promise';
import { serialize } from 'cookie';
// For a request at /api/login with a json body containing username and password, this function will connect to the database and return a success message if the connection is successful, or an error message if it fails.

function generateAuthToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

export async function POST({request, cookies}) {
    const { username, password, database } = await request.json();
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: username,
            password: password,
            database: database
        });
        await connection.end();

        // Set a cookie with the auth token
        const authToken = generateAuthToken();

        cookies.set('authToken', authToken, {

            httpOnly: true,
            // For 3 minutes
            maxAge: 60 * 60,
            sameSite: 'strict',
            path: '/',
            secure: process.env.NODE_ENV === 'production' // Set to true if using HTTPS
        });


        return new Response(JSON.stringify({ message: 'Connection successful' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Connection failed', error: error.message }), { status: 401    });
    }
}