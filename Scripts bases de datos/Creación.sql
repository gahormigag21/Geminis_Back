-- Crear la base de datos
CREATE DATABASE SistemaReservas;
USE SistemaReservas;

-- Tabla Empresas
CREATE TABLE Empresas (
    NIT VARCHAR(20) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Logo LONGBLOB, -- Ensure this field can handle binary data
    UbicacionLogo VARCHAR(200),
    Descripcion VARCHAR(255), -- Nuevo campo Descripcion
    Categoria VARCHAR(100) -- Nuevo campo Categoria
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
    Email VARCHAR(100) NOT NULL, -- Nuevo campo Email
    AutenticacionDosFactores TINYINT(1) NOT NULL DEFAULT 0, -- Nuevo campo AutenticacionDosFactores
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
    MesasDisponibles INT NOT NULL,
    CantidadDePersonasPorMesa INT NOT NULL,
    Telefono VARCHAR(15) NULL,
    Imagenes VARCHAR(200), -- Ensure this field can handle large binary data
    Horario VARCHAR(600), -- Nuevo campo Horario
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
    ImagenMenu VARCHAR(200), -- Nuevo campo ImagenMenu
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
    Estado int not null,
    CONSTRAINT FK_Domicilios_Usuario FOREIGN KEY (Usuario) REFERENCES Usuario(Documento),
    CONSTRAINT FK_Domicilios_Sedes FOREIGN KEY (Sede) REFERENCES Sedes(Rowid)
);

-- Tabla Reservas
CREATE TABLE Reservas (
    Rowid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Usuario VARCHAR(20) NOT NULL,
    Sede INT NOT NULL,
    Ocasion INT NOT NULL, 
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    Personas INT NOT NULL,
    Estado INT NOT NULL,
    NumeroDeConfirmacion VARCHAR(50) NOT NULL, -- New field NumeroDeConfirmacion
    Telefono VARCHAR(15) NULL, -- Nuevo campo Telefono que puede ser NULL
    CONSTRAINT FK_Reservas_Usuario FOREIGN KEY (Usuario) REFERENCES Usuario(Documento),
    CONSTRAINT FK_Reservas_Sedes FOREIGN KEY (Sede) REFERENCES Sedes(Rowid)
);

create table ComidaDomicilio(
	Rowid int not null auto_increment primary key,
    DomicilioId int not null,
    MenuId int not null,
    Cantidad int not null, 
    Valor int not null,
    constraint FK_ComidaMenu_Menu foreign key (MenuId) references Menus(Rowid),
    constraint FK_ComidaMenu_Domicilio foreign key (DomicilioId) References domicilios(Rowid)
);