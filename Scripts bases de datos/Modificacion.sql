USE SistemaReservas;

-- Modificaciones
ALTER TABLE Sedes MODIFY COLUMN Horario VARCHAR(600);
ALTER TABLE Menus ADD COLUMN ImagenMenu VARCHAR(200);
ALTER TABLE Reservas ADD COLUMN Telefono VARCHAR(15) NULL; -- Nuevo campo Telefono que puede ser NULL