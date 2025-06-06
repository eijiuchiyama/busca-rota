drop table if EXISTS comentario;
drop table if EXISTS usuario;
drop table if EXISTS aeroporto;
drop table if EXISTS companhiaaerea;

CREATE TABLE Usuario(
	username VARCHAR(63) PRIMARY KEY,
	senha VARCHAR(63) NOT NULL,
	nickname VARCHAR(63) NOT NULL,
	data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE,
	is_role_admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE CompanhiaAerea(
	id SERIAL PRIMARY KEY,
	nome VARCHAR(255)
);

CREATE TABLE Aeroporto(
	iata VARCHAR(3) PRIMARY KEY
		CHECK (iata ~ '^[A-Z]{3}$'),
	icao VARCHAR(4) NOT NULL UNIQUE
		CHECK (icao ~ '^[A-Z]{4}$'),
	pais VARCHAR(63),
	cidade VARCHAR(63),
	nome VARCHAR(255),
	latitude DOUBLE PRECISION
		CHECK (latitude BETWEEN -90 AND 90),
	longitude DOUBLE PRECISION
		CHECK (longitude BETWEEN -180 AND 180)
);

CREATE TABLE Comentario(
	id SERIAL PRIMARY KEY,
	conteudo VARCHAR(4095) NOT NULL,
	horario_postagem TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	usuario_username VARCHAR(63),
	aeroporto_iata VARCHAR(3),
	companhia_id INT,
	comentario_pai_id INT,

	-- Foreign key constraints with CASCADE rules
	CONSTRAINT fk_usuario
		FOREIGN KEY (usuario_username) REFERENCES Usuario(username)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_aeroporto
		FOREIGN KEY (aeroporto_iata) REFERENCES Aeroporto(iata)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_companhia
		FOREIGN KEY (companhia_id) REFERENCES CompanhiaAerea(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_comentario_pai
		FOREIGN KEY (comentario_pai_id) REFERENCES Comentario(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	
	CHECK (
		(aeroporto_iata IS NOT NULL)::INTEGER +
		(companhia_id IS NOT NULL)::INTEGER +
		(comentario_pai_id IS NOT NULL)::INTEGER = 1
	)
);
