import mysql from 'mysql2/promise';

import { DATABASE_NAME } from "astro:env/client";

// POST handler for validating credentials through MySQL connection
export async function POST({request, cookies}) {

    const { username, password } = await request.json();

    const connectionConfig = {
        host:     'localhost',
        user:     username,
        password: password,
        database: DATABASE_NAME
    }

    const cookiesConfig = {
        httpOnly: true,
        maxAge:   60 * 60,                              // For 3 minutes
        sameSite: 'strict',
        path:     '/',
        secure:   process.env.NODE_ENV === 'production' // Set to true if using HTTPS
    }

    try {
        const connection = await mysql.createConnection(connectionConfig);

        await connection.end();

        const authToken = generateAuthToken();              // Set a cookie with the auth token

        cookies.set('authToken', authToken, cookiesConfig); // Set the cookie with the auth token
        cookies.set('username', username, cookiesConfig);   // Set the cookie with the username
        cookies.set('password', password, cookiesConfig);   // Set the cookie with the password

        return new Response(JSON.stringify({ message: 'Successful login' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Credentials invalid', error: error.message }), { status: 401});
    }
}

// This function generates a random auth token for persistent login sessions
function generateAuthToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}