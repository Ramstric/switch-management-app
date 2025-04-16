import mysql from 'mysql2/promise';

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