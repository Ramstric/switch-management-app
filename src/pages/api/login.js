import mysql from 'mysql2/promise';

// For a request at /api/login with a json body containing username and password, this function will connect to the database and return a success message if the connection is successful, or an error message if it fails.

export async function POST({request}) {
    const { username, password, database } = await request.json();
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: username,
            password: password,
            database: database
        });
        await connection.end();
        return new Response(JSON.stringify({ message: 'Connection successful' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Connection failed', error: error.message }), { status: 401    });
    }
}