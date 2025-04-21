import mysql from 'mysql2/promise';

export async function POST({ request }) {
    const { username, password, database, table, mac, name, type } = await request.json();

    const connectionConfig = {
        host: 'localhost',
        user: username,
        password: password,
        database: database
    };

    try {
        // Update the item with the given MAC address, change the 'tipo' column to the new type and the 'dispositivo' column to the new name
        const connection = await mysql.createConnection(connectionConfig);
        
        // If no name is provided, keep the current name
        if (name.trim() === '') {
            await connection.query(`UPDATE ${table} SET tipo = ? WHERE mac = ?`, [type, mac]);
        } else {
            await connection.query(`UPDATE ${table} SET tipo = ?, dispositivo = ? WHERE mac = ?`, [type, name, mac]);
        }

        await connection.end();
        return new Response(JSON.stringify({ message: 'Item updated successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error updating item', error: error.message }), { status: 500 });
    }

}