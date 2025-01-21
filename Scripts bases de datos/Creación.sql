-- Crear la base de datos
CREATE DATABASE SistemaReservas;
USE SistemaReservas;

-- Tabla Empresas
CREATE TABLE Empresas (
    NIT VARCHAR(20) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Logo VARBINARY(10000),
    UbicacionLogo VARCHAR(200) 
);

-- Tabla Usuario
CREATE TABLE Usuario (
    Documento VARCHAR(20) NOT NULL PRIMARY KEY,
    Nombres VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15) NOT NULL,
    Direccion VARCHAR(100) NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    Penalizacion INT NOT NULL,
    Estado TINYINT(1) NOT NULL,
    Tipo INT NOT NULL,
    Empresa VARCHAR(20),
    Administrador TINYINT(1) NOT NULL,
    CONSTRAINT FK_Usuario_Empresas FOREIGN KEY (Empresa) REFERENCES Empresas(NIT)
);

-- Tabla Bitacora
CREATE TABLE Bitacora (
    Rowid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Usuario VARCHAR(20) NOT NULL,
    Accion VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(255) NOT NULL,
    Tabla VARCHAR(50) NOT NULL,
    CONSTRAINT FK_Bitacora_Usuario FOREIGN KEY (Usuario) REFERENCES Usuario(Documento)
);

-- Tabla Sedes
CREATE TABLE Sedes (
    Rowid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Direccion VARCHAR(100) NOT NULL,
    Empresa VARCHAR(20) NOT NULL,
    MesasTotales INT NOT NULL,
    MesasDisponibles INT NOT NULL,
    ReservasMaximas INT NOT NULL,
    Telefono VARCHAR(15) NULL,
    CONSTRAINT FK_Sedes_Empresas FOREIGN KEY (Empresa) REFERENCES Empresas(NIT)
);

-- Tabla Menus
CREATE TABLE Menus (
    Rowid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Sede INT NOT NULL,
    Estado TINYINT(1) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(255) NULL,
    Precio DECIMAL(10, 2) NOT NULL,
    Tipo INT NOT NULL,
    CONSTRAINT FK_Menus_Sedes FOREIGN KEY (Sede) REFERENCES Sedes(Rowid)
);

-- Tabla Domicilios
CREATE TABLE Domicilios (
    Rowid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Usuario VARCHAR(20) NOT NULL,
    Sede INT NOT NULL,
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    DireccionEntrega VARCHAR(200) NOT NULL,
    TipoPago INT NOT NULL,
    NumeroDomicilio INT NOT NULL,
    CONSTRAINT FK_Domicilios_Usuario FOREIGN KEY (Usuario) REFERENCES Usuario(Documento),
    CONSTRAINT FK_Domicilios_Sedes FOREIGN KEY (Sede) REFERENCES Sedes(Rowid)
);

-- Tabla Reservas
CREATE TABLE Reservas (
    Rowid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Usuario VARCHAR(20) NOT NULL,
    Sede INT NOT NULL,
    Mesas INT NOT NULL,
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    Personas INT NOT NULL,
    Estado INT NOT NULL,
    CONSTRAINT FK_Reservas_Usuario FOREIGN KEY (Usuario) REFERENCES Usuario(Documento),
    CONSTRAINT FK_Reservas_Sedes FOREIGN KEY (Sede) REFERENCES Sedes(Rowid)
);
