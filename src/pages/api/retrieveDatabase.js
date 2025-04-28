import mysql from 'mysql2/promise';

import { DATABASE_NAME, TABLE_NAME } from "astro:env/client";

// POST handler for retrieving data from a MySQL database
export async function POST({ request, cookies }) {

    const connectionConfig = {
        host:     'localhost',
        user:     cookies.get('username')?.value,
        password: cookies.get('password')?.value,
        database: DATABASE_NAME
    };

    try {
        const connection = await mysql.createConnection(connectionConfig);

        const [rows] = await connection.query(`SELECT * FROM ${TABLE_NAME} ORDER BY tipo, dispositivo`);    // Retrieve all rows from the specified table
        await connection.end();

        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error retrieving data', error: error.message }), { status: 500 });
    }
}