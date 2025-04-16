DROP database administracion_red;

CREATE database administracion_red;

USE administracion_red;

CREATE TABLE dispositivos_red (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('autorizado', 'desconocido', 'bloqueado') NOT NULL DEFAULT 'desconocido',
  dispositivo VARCHAR(255),
  mac VARCHAR(17) UNIQUE NOT NULL,
  switch INT NOT NULL,
  puerto INT NOT NULL,
  hora TIME NOT NULL,
  fecha DATE NOT NULL, INDEX (mac), INDEX (switch, puerto)
);