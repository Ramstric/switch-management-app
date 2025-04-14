import mysql from 'mysql2/promise';

// For a request at /api/retrieveData with a json body containing username, password, database, and table, this function will connect to the database and return the data from the specified table as a JSON response.

export async function POST({ request }) {

    const { username, password, database, table } = await request.json();

    const connectionConfig = {
        host: 'localhost',
        user: username,
        password: password,
        database: database
    };

    try {
        const connection = await mysql.createConnection(connectionConfig);
        const [rows] = await connection.query(`SELECT * FROM ${table}`);
        await connection.end();
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error retrieving data', error: error.message }), { status: 500 });
    }

}