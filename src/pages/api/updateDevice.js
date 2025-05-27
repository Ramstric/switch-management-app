import mysql from 'mysql2/promise';

import { DATABASE_NAME, TABLE_NAME } from "astro:env/client";

// POST handler for updating an item in the database
export async function POST({ request, cookies }) {

    const { mac, name, type } = await request.json();
    
    const mysqlParams = {
        host:     'localhost',
        user:     cookies.get('username')?.value,
        password: cookies.get('password')?.value,
        database: DATABASE_NAME
    };


    try {
        const connection = await mysql.createConnection(mysqlParams);
        
        if (name.trim() === '') {
            await connection.query(`UPDATE ${TABLE_NAME} SET tipo = ? WHERE mac = ?`, [type, mac]);  // If no name is provided, keep the current name
        } else {
            await connection.query(`UPDATE ${TABLE_NAME} SET tipo = ?, dispositivo = ? WHERE mac = ?`, [type, name, mac]);
        }
        
        await connection.end();

        return new Response(JSON.stringify({ message: 'Item updated successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error updating item', error: error.message }), { status: 500 });
    }
}