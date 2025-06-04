LOAD CSV WITH HEADERS FROM 'file:///airports_filtered.dat' AS row
WITH row
WHERE row.iata IS NOT NULL AND row.iata <> ''
CREATE (:Aeroporto {
	iata: row.iata
})

LOAD CSV WITH HEADERS FROM 'file:///paths.dat' AS row
CREATE (:Trajeto {
	distancia: row.distancia
})

LOAD CSV WITH HEADERS FROM 'file:///flights.dat' AS row
CREATE (:Voo {
	horario_partida: row.horario_partida,
	horario_chegada:  row.horario_chegada,
	companhia:  row.companhia,
	aviao:  row.aviao,
	preco_economica:  row.preco_economica,
	preco_executiva:  row.preco_executiva,
	preco_primeira:  row.preco_primeira
})
