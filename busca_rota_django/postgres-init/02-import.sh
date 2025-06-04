#!/bin/bash
# Esse script será executado automaticamente pelo Docker
psql -U postgres -d busca-rota-postgres <<EOF
COPY Aeroporto FROM '/docker-entrypoint-initdb.d/airports_filtered.dat' DELIMITER ',' CSV;
COPY CompanhiaAerea(sigla, nome) FROM '/docker-entrypoint-initdb.d/airlines_filtered.dat' DELIMITER ',' CSV;
COPY Aviao(marca, modelo) FROM '/docker-entrypoint-initdb.d/planes_filtered.dat' DELIMITER ',' CSV;
EOF
