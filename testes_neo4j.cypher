CALL {
  // Aeroportos importados
  MATCH (a:Aeroporto)
  WHERE a.iata IS NOT NULL AND trim(a.iata) <> ''
  RETURN count(a) > 0 AS aeroportos_ok
}
CALL {
  // Trajetos válidos
  MATCH (a1:Aeroporto)-[:ORIGEM]->(t:Trajeto)-[:DESTINO]->(a2:Aeroporto)
  WHERE a1.iata <> a2.iata AND t.distancia > 0
  RETURN count(t) > 0 AS trajetos_ok
}
CALL {
  // Voos válidos
  MATCH (v:Voo)-[:PERTENCE_A]->(t:Trajeto)
  WHERE v.horario_chegada > v.horario_partida
    AND v.preco_economica >= 0
    AND v.preco_executiva >= 0
    AND v.preco_primeira >= 0
  RETURN count(v) > 0 AS voos_ok
}
CALL {
  // Voos inválidos
  MATCH (v:Voo)
  WHERE v.preco_economica < 0 OR v.preco_executiva < 0 OR v.preco_primeira < 0
  RETURN count(v) = 0 AS voos_invalidos_ok
}
CALL {
  // Trajetos com distância inválida
  MATCH (t:Trajeto)
  WHERE t.distancia <= 0
  RETURN count(t) = 0 AS trajetos_invalidos_ok
}
CALL {
  // Inserção teste aeroporto
  CREATE (a:Aeroporto {iata: 'QQQ'})
  RETURN count(a) = 1 AS insercao_ok
}
CALL {
  // Verifica inserção aeroporto
  MATCH (a:Aeroporto {iata: 'QQQ'})
  RETURN count(a) = 1 AS existe_apos_insercao
}
CALL {
  // Remoção teste aeroporto
  MATCH (a:Aeroporto {iata: 'QQQ'})
  DELETE a
  RETURN true AS remocao_ok
}
CALL {
  // Verifica remoção aeroporto
  MATCH (a:Aeroporto {iata: 'QQQ'})
  RETURN count(a) = 0 AS nao_existe_apos_remocao
}
RETURN
  aeroportos_ok,
  trajetos_ok,
  voos_ok,
  voos_invalidos_ok,
  trajetos_invalidos_ok,
  insercao_ok,
  existe_apos_insercao,
  remocao_ok,
  nao_existe_apos_remocao;

