CREATE TABLE Usuario(
	username VARCHAR(63),
	senha VARCHAR(63),
	nickname VARCHAR(63),
	data_cadastro DATE,
	is_role_admin BOOLEAN
);

CREATE TABLE Comentario(
	id: SERIAL PRIMARY KEY,
	conteudo VARCHAR(4095),
	horario_postagem TIMESTAMP
);

CREATE TABLE Aviao(
	marca VARCHAR(255),
	modelo VARCHAR(255)
);

CREATE TABLE CompanhiaAerea(
	sigla VARCHAR(63),
	nome VARCHAR(255)
);

CREATE TABLE Aeroporto(
	iata VARCHAR(7),
	icao VARCHAR(7),
	pais VARCHAR(63),
	cidade VARCHAR(63),
	nome VARCHAR(255),
	latitude DOUBLE PRECISION,
	longitude DOUBLE PRECISION
);

\COPY Aeroporto FROM 'airports_filtered.dat' DELIMITER ',' CSV;
\COPY CompanhiaAerea FROM 'airlines_filtered.dat' DELIMITER ',' CSV;
\COPY Aviao FROM 'planes_filtered.dat' DELIMITER ',' CSV;

