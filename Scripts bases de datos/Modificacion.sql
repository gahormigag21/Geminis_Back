USE SistemaReservas;

-- Modificaciones
ALTER TABLE Sedes MODIFY COLUMN Horario VARCHAR(600);
ALTER TABLE Menus ADD COLUMN ImagenMenu VARCHAR(200);
ALTER TABLE Reservas ADD COLUMN Telefono VARCHAR(15) NULL; -- Nuevo campo Telefono que puede ser NULL
ALTER TABLE Usuario ADD COLUMN Email VARCHAR(100) NOT NULL;
ALTER TABLE Usuario ADD COLUMN AutenticacionDosFactores TINYINT(1) NOT NULL DEFAULT 0; -- Nuevo campo AutenticacionDosFactores