import { Telnet } from "telnet-client";
import mysql from "mysql2/promise";

import {DATABASE_NAME, TABLE_NAME, TELNET_HOST, TELNET_PORT} from "astro:env/client";

export async function POST({ request, cookies }) {
    const telnetConnection = new Telnet();

    const telnetParams = {
        host: TELNET_HOST,
        port: TELNET_PORT,
        shellPrompt: "ESW1#",
        timeout: 1500,
        sendTimeout: 2000
    };

    const mysqlParams = {
        host:     'localhost',
        user:     cookies.get('username')?.value,
        password: cookies.get('password')?.value,
        database: DATABASE_NAME,
    };

    // Try to connect to the telnet server
    try {
        await telnetConnection.connect(telnetParams);
    } catch (error) {
        return new Response(JSON.stringify({message: "Error connecting to device", error: error.message,}), { status: 500 });
    }

    const routerCommand = "show mac-address-table\r\n";
    let response = await telnetConnection.send(routerCommand); 

    response = response.split("\n").slice(4, -2); // Remove the last line

    const notAllowedLines = [
        'ESW1#show mac-address-table\r',
        'Destination Address  Address Type  VLAN  Destination Port\r',
        '-------------------  ------------  ----  --------------------\r',
        'c001.2a24.0000\t\tSelf\t      1\t    Vlan1\t\r'
    ];

    if (response.length <= 1) {
        await telnetConnection.end();
        return new Response(JSON.stringify({ message: "No devices found or command not allowed", data: [] }), {status: 200});
    } else if (response.some(line => notAllowedLines.includes(line))) {
        await telnetConnection.end();
        return new Response(JSON.stringify({message: "No devices found or command not allowed", data: []}), { status: 200 });
    }

    
    // Get the MAC address from the response in the first column
    const detectedDevices = response.map((line) => {
        const columns = line.split(/\s+/); // Split by whitespace

        // MAC address is in the first column
        let macAddr = columns[0];
        macAddr = macAddr.split(".").join(""); // Convert to colon-separated format
        macAddr = macAddr
            .match(/.{1,2}/g)
            .join(":")
            .toUpperCase(); // Join every two characters with a colon
        
        // Port number is in the fourth column
        const port = columns[3].split("/").pop();

        return { mac: macAddr, port: port };
    });

    // Add every new MAC address to the database
    const connectionDB = await mysql.createConnection(mysqlParams);

    for (const device of detectedDevices) {
        const [rows] = await connectionDB.query(`SELECT * FROM ${TABLE_NAME} WHERE mac = ?`, [device.mac]);
        if (rows.length === 0) {
            await connectionDB.query(
                `INSERT INTO ${TABLE_NAME} (dispositivo, mac, switch, puerto, hora, fecha) VALUES (?, ?, ?, ?, NOW(), NOW())`,
                ["Dipositivo desconocido", device.mac, 0, device.port]);
        }
    }

    await telnetConnection.end();
    await connectionDB.end();
    return new Response(JSON.stringify({message: "Telnet connection successful", data: detectedDevices}), { status: 200 });
}
