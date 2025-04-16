USE administracion_red;

-- Ejemplo 1: Cliente autorizado
INSERT INTO dispositivos_red (tipo, dispositivo, mac, switch, puerto, hora, fecha)
VALUES ('autorizado', 'Cliente A1', '00:11:22:33:44:55', 1, 24, CURTIME(), CURDATE());

-- Ejemplo 2: Celular desconocido
INSERT INTO dispositivos_red (dispositivo, mac, switch, puerto, hora, fecha)
VALUES ('Celular IP desconocido', 'AA:BB:CC:DD:EE:FF', 2, 5, CURTIME(), CURDATE());
-- Note: 'tipo' is omitted here, so it will default to 'unknown'

-- Ejemplo 3: Dispositivo bloqueado
INSERT INTO dispositivos_red (tipo, dispositivo, mac, switch, puerto, hora, fecha)
VALUES ('bloqueado', 'IP Estafa', '11:22:33:44:55:66', 3, 10, CURTIME(), CURDATE());

SELECT * FROM dispositivos_red;