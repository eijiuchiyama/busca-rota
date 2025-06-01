#!/bin/bash

# Espera o Neo4j estar pronto
echo "Aguardando Neo4j iniciar..."
sleep 10

# Executa o Cypher via cypher-shell
cypher-shell -u neo4j -p neo < /data/init.cypher
