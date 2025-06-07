#!/bin/bash

echo "Aguardando Neo4j iniciar..."
until cypher-shell -a bolt://neo4j:7687 -u neo4j -p neo4jneo4j "RETURN 1" > /dev/null 2>&1; do
  echo "Aguardando conexão com Neo4j..."
  sleep 2
done

echo "Neo4j está pronto. Executando init.cypher..."
cypher-shell -a bolt://neo4j:7687 -u neo4j -p neo4jneo4j < /var/lib/neo4j/import/init.cypher



