// Remover dados existentes (se o banco for reconstruido toda vez)
MATCH (n) DETACH DELETE n;

// Criar constraints e índices
CREATE CONSTRAINT airport_iata_unique IF NOT EXISTS FOR (a:Aeroporto) REQUIRE a.iata IS UNIQUE;
CREATE INDEX trajeto_chave_idx IF NOT EXISTS FOR (t:Trajeto) ON (t.chave);

// Inserir Aeroportos com validação de IATA
LOAD CSV WITH HEADERS FROM 'file:///airports_filtered.dat' AS row
WITH row 
WHERE row.iata IS NOT NULL AND trim(row.iata) <> ''
MERGE (a:Aeroporto {iata: trim(row.iata)});
RETURN count(*) AS aeroportos_importados;

// Inserir Trajetos com validações
LOAD CSV WITH HEADERS FROM 'file:///paths.dat' AS row
WITH row 
WHERE row.aeroporto1 IS NOT NULL AND row.aeroporto2 IS NOT NULL AND row.distancia IS NOT NULL
  AND trim(row.aeroporto1) <> trim(row.aeroporto2)  // Aeroportos distintos
  AND toFloat(row.distancia) > 0             // Distância positiva
WITH row, trim(row.aeroporto1) AS aero1, trim(row.aeroporto2) AS aero2, toFloat(row.distancia) AS distancia

MERGE (origem1:Aeroporto {iata: aero1})
MERGE (destino1:Aeroporto {iata: aero2})
MERGE (origem1)-[:ORIGEM]->(t1:Trajeto {
    chave: aero1 + '->' + aero2,
    distancia: distancia
})-[:DESTINO]->(destino1)
MERGE (origem2:Aeroporto {iata: aero2})
MERGE (destino2:Aeroporto {iata: aero1})
MERGE (origem2)-[:ORIGEM]->(t2:Trajeto {
    chave: aero2 + '->' + aero1,
    distancia: distancia
})-[:DESTINO]->(destino2);

RETURN count(*) AS trajetos_importados;

// Inserir Voos com validações
LOAD CSV WITH HEADERS FROM 'file:///flights.dat' AS row
WITH row 
WHERE 
  row.origem IS NOT NULL AND row.destino IS NOT NULL AND
  row.partida IS NOT NULL AND row.chegada IS NOT NULL AND
  datetime(row.chegada) > datetime(row.partida) AND  // Chegada > Partida
  toFloat(row.preco_economica) >= 0 AND  // Preços não-negativos
  toFloat(row.preco_executiva) >= 0 AND
  toFloat(row.preco_primeira) >= 0

WITH row, trim(row.origem) AS origem_clean, trim(row.destino) AS destino_clean
MATCH (t:Trajeto {chave: origem_clean + '->' + destino_clean})
CREATE (v:Voo {
    horario_partida: datetime(row.partida),
    horario_chegada: datetime(row.chegada),
    companhia: row.companhia,
    preco_economica: toFloat(row.preco_economica),
    preco_executiva: toFloat(row.preco_executiva),
    preco_primeira: toFloat(row.preco_primeira)
})-[:PERTENCE_A]->(t);
RETURN count(*) AS voos_importados;
