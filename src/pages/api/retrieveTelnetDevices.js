import { Telnet } from 'telnet-client';
import mysql from 'mysql2/promise';

import { DATABASE_NAME, TABLE_NAME, TELNET_HOST, TELNET_PORT } from "astro:env/client";


export async function POST({ request, cookies }) {

    const telnetConnection = new Telnet();
    const telnetParams = {
        host: TELNET_HOST,
        port: TELNET_PORT,
        shellPrompt: 'IOU1#',
        initialLFCR: true,
        timeout: 1500,
    };

    const mysqlParams = {
        host:     'localhost',
        user:     cookies.get('username')?.value,
        password: cookies.get('password')?.value,
        database: DATABASE_NAME
    };

    try {
        await telnetConnection.connect(telnetParams);
        
        // Router command to be executed to show ip interface brief
        const routerCommand = 'show mac address-table'; // Example command
        
        let response = await telnetConnection.send(routerCommand); // Send command and wait for response
        
        response = response.split('\n').slice(6, -2); // Remove the last line        
        
        if (response.length <= 1) {
            await connection.end();
            return new Response(JSON.stringify({ message: 'No MAC adressess' }), { status: 500 });
        }


        // Get the MAC address from the response in the first column
        const detectedDevices = response.map(line => {
            const columns = line.split(/\s+/); // Split by whitespace
            
            let macAddr = columns[2]; // MAC address is in the second column
            macAddr = macAddr.split('.').join(''); // Convert to colon-separated format
            macAddr = macAddr.match(/.{1,2}/g).join(':').toUpperCase(); // Join every two characters with a colon

            const port = columns[4].split('/').pop(); // Port number is in the third column

            return { mac: macAddr, port: port }; // Return the MAC address and port number
        });
                
        // Add every new MAC address to the database
        const connectionDB = await mysql.createConnection(mysqlParams);
        
        for (const device of detectedDevices) {
            const [rows] = await connectionDB.query(`SELECT * FROM ${TABLE_NAME} WHERE mac = ?`, [device.mac]);
            if (rows.length === 0) {
                // INSERT INTO dispositivos_red (dispositivo, mac, switch, puerto, hora, fecha) where dispositivo is null
                // Where dispositivo isn't given as it defaults into 'desconocido'
                // mac is the MAC address, switch is set to 0, port is the port number, and the date and time are set to now
                await connectionDB.query(`INSERT INTO ${TABLE_NAME} (dispositivo, mac, switch, puerto, hora, fecha) VALUES (?, ?, ?, ?, NOW(), NOW())`, ['Dipositivo desconocido', device.mac, 0, device.port]);
            }
        }
        

        await connection.end();
        await connectionDB.end();
        return new Response(JSON.stringify({ message: 'Telnet connection successful', data: detectedDevices }), { status: 200 });

    } catch (error) {
        console.error('Telnet connection error:', error);
        return new Response(JSON.stringify({ message: 'Error connecting to device', error: error.message }), { status: 500 });
    }
}