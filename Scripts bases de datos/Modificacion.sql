
USE SistemaReservas;

-- Modificaciones
ALTER TABLE Sedes MODIFY COLUMN Horario VARCHAR(600);
ALTER TABLE Menus ADD COLUMN ImagenMenu VARCHAR(200);