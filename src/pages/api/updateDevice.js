import Telnet from 'telnet-client';
import mysql from 'mysql2/promise';

import { DATABASE_NAME, TABLE_NAME, TELNET_HOST, TELNET_PORT } from "astro:env/client";

// POST handler for updating an item in the database
export async function POST({ request, cookies }) {

    const { mac, name, type } = await request.json();

    const telnetConnection = new Telnet();
    const telnetParams = {
        host:        TELNET_HOST,
        port:        TELNET_PORT,
        shellPrompt: 'IOU1#',
        initialLFCR: true,
        timeout:     1500,
    };
    
    const mysqlParams = {
        host:     'localhost',
        user:     cookies.get('username')?.value,
        password: cookies.get('password')?.value,
        database: DATABASE_NAME
    };


    try {
        if (type === 'bloqueado') {
            await telnetConnection.connect(telnetParams);
            
            // Router command to be executed to show ip interface brief
            const routerCommand = `clear mac address-table dynamic ${mac}`; // Example command
            
            let response = await telnetConnection.send(routerCommand); // Send command and wait for response
            
            if (response.includes('Invalid input')) {
                return new Response(JSON.stringify({ message: 'Invalid MAC address' }), { status: 400 });
            }
            
            await telnetConnection.end();
        }

        const connection = await mysql.createConnection(connectionConfig);
        
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