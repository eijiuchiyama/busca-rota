from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Aeroporto, Usuario, Comentario, CompanhiaAerea
from .serializers import AeroportoSerializer, UsuarioSerializer, ComentarioSerializer, CompanhiaAereaSerializer
from neo4j import GraphDatabase
from pymongo import MongoClient
from datetime import date
from datetime import datetime
from rest_framework import status
from django.db import IntegrityError, connection
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from itertools import product
from dateutil.parser import isoparse

driver = GraphDatabase.driver("bolt://neo4j:7687", auth=("neo4j", "neo4jneo4j"))

client = MongoClient("mongodb://mongo:27017/")
db = client["mongo"]
rotas_mongo = db["rotas"]

@api_view(['GET'])
def listar_todos_aeroportos(request):
	try:
		aeros = Aeroporto.objects.raw('SELECT * FROM aeroporto')
		serializer = AeroportoSerializer(aeros, many=True)
	except Exception as e:
			return Response({"erro": str(e)}, status=500)
	return Response(serializer.data)
	
@swagger_auto_schema(
	methods=['get'],
	manual_parameters=[
        openapi.Parameter('iata', openapi.IN_QUERY, description="Código IATA do aeroporto", type=openapi.TYPE_STRING, required=True),
    ],
)
@api_view(['GET'])
def pega_aeroporto(request):
	iata = request.GET.get("iata")
	if iata:
		try:
			aeroporto = Aeroporto.objects.raw("SELECT * FROM aeroporto WHERE iata = %s", [iata])
			aeroporto_dict = [
				{"iata": a.iata, "icao": a.icao, "pais": a.pais, "cidade": a.cidade, "nome": a.nome, "latitude": a.latitude, "longitude": a.longitude} for a in aeroporto
			]
			return Response({"aeroporto": aeroporto_dict})
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	return Response({"Erro": "Parâmetro 'iata' não informado"}, status=400)
	
@api_view(['GET'])
def listar_todas_companhias(request):
	try:
		companhias = CompanhiaAerea.objects.raw('SELECT * FROM companhiaaerea')
		serializer = CompanhiaAereaSerializer(companhias, many=True)
		return Response(serializer.data)
	except Exception as e:
			return Response({"erro": str(e)}, status=500)

@swagger_auto_schema(
	methods=['get'],
	manual_parameters=[
        openapi.Parameter('id', openapi.IN_QUERY, description="id da companhia aérea", type=openapi.TYPE_INTEGER, required=True),
    ],
)
@api_view(['GET'])
def pega_companhia(request):
	id_companhia = request.GET.get("id")
	if id_companhia:
		try:
			companhia = CompanhiaAerea.objects.raw("SELECT * FROM companhiaaerea WHERE id = %s", [id_companhia])
			companhia_dict = [
				{"id": a.id, "nome": a.nome} for a in companhia
			]
			return Response({"companhia": companhia_dict})
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	return Response({"Erro": "Parâmetro 'id' não informado"}, status=400)

@swagger_auto_schema(
	methods=['get'],
	manual_parameters=[
		openapi.Parameter('id', openapi.IN_QUERY, description="ID da companhia aérea", type=openapi.TYPE_STRING, required=True),
        openapi.Parameter('iata', openapi.IN_QUERY, description="Código IATA do aeroporto", type=openapi.TYPE_STRING, required=True),
    ],
)
@api_view(['GET'])
def comentarios_relacionados(request):
	id_companhia = request.GET.get("id")
	iata = request.GET.get("iata")
	id_pai = request.GET.get("id_pai")
	if (id_companhia and iata) or (id_companhia and id_pai) or (iata and id_pai):
		return Response({"Erro": "Informe apenas um: 'id' ou 'iata' ou 'id_pai'"}, status=400)
	elif id_companhia:
		try:
			comentarios = Comentario.objects.raw("SELECT * FROM comentario WHERE companhia_id = %s", [id_companhia])
			comentarios_dict = []
			for a in comentarios:
				usuario_qs = Usuario.objects.raw("SELECT * FROM usuario WHERE username = %s", [a.usuario_username])
				usuario = next(iter(usuario_qs), None)
				nickname = usuario.nickname
				comentarios_dict.append({"id": a.id, "conteudo": a.conteudo, "horario_postagem": a.horario_postagem, "usuario_nickname": nickname, 
					"aeroporto_iata": a.aeroporto_iata, "companhia_id": a.companhia_id, "comentario_pai_id": a.comentario_pai_id}) 
			return Response({"comentarios": comentarios_dict})
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	elif iata:
		try:
			comentarios = Comentario.objects.raw("SELECT * FROM comentario WHERE aeroporto_iata = %s", [iata])
			comentarios_dict = []
			for a in comentarios:
				usuario_qs = Usuario.objects.raw("SELECT * FROM usuario WHERE username = %s", [a.usuario_username])
				usuario = next(iter(usuario_qs), None)
				nickname = usuario.nickname
				comentarios_dict.append({"id": a.id, "conteudo": a.conteudo, "horario_postagem": a.horario_postagem, "usuario_nickname": nickname, 
					"aeroporto_iata": a.aeroporto_iata, "companhia_id": a.companhia_id, "comentario_pai_id": a.comentario_pai_id})
			return Response({"comentarios": comentarios_dict})
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	elif id_pai:
		try:
			comentarios = Comentario.objects.raw("SELECT * FROM comentario WHERE comentario_pai_id = %s", [id_pai])
			comentarios_dict = []
			for a in comentarios:
				usuario_qs = Usuario.objects.raw("SELECT * FROM usuario WHERE username = %s", [a.usuario_username])
				usuario = next(iter(usuario_qs), None)
				nickname = usuario.nickname
				comentarios_dict.append({"id": a.id, "conteudo": a.conteudo, "horario_postagem": a.horario_postagem, "usuario_nickname": nickname, 
					"aeroporto_iata": a.aeroporto_iata, "companhia_id": a.companhia_id, "comentario_pai_id": a.comentario_pai_id})
			return Response({"comentarios": comentarios_dict})
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	return Response({"Erro": "Informe 'id' ou 'iata' ou 'id_pai'"}, status=400)

@swagger_auto_schema(
	methods=['get'],
	manual_parameters=[
        openapi.Parameter('username', openapi.IN_QUERY, description="Nome de usuário", type=openapi.TYPE_STRING, required=True),
        openapi.Parameter('senha', openapi.IN_QUERY, description="Senha", type=openapi.TYPE_STRING, required=True),
    ],
)
@api_view(['GET'])
def verifica_usuario(request):
	usuario = request.GET.get("username")
	senha = request.GET.get("senha")
	if usuario and senha:
		try:
			usuario_resposta = Usuario.objects.raw("SELECT * FROM usuario WHERE (username = %s AND senha = %s)", [usuario, senha])
			usuario_dict = [
				{"username": a.username, "senha": a.senha, "nickname": a.nickname, 
				"data_cadastro": a.data_cadastro, "is_role_admin": a.is_role_admin} for a in usuario_resposta
			]
			if(len(usuario_dict) == 1):
				return Response({"usuario": usuario_dict})
			else:
				return Response({"Usuário não cadastrado ou senha incorreta"}, status=204)
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	return Response({"Erro": "Informe 'username' e 'senha'"}, status=400)

@swagger_auto_schema(
	methods=['post'],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'username': openapi.Schema(type=openapi.TYPE_STRING),
			'senha': openapi.Schema(type=openapi.TYPE_STRING),
			'nickname': openapi.Schema(type=openapi.TYPE_STRING),
		},
		required=['username', 'senha', 'nickname']
	)
)
@api_view(['POST'])
def insere_usuario(request):
	usuario = request.data.get("username")
	senha = request.data.get("senha")
	nickname = request.data.get("nickname")
	if usuario and senha and nickname:
		try:
			with connection.cursor() as cursor: #Adiciona no postgres
				cursor.execute(""" 
				INSERT INTO usuario (username, senha, nickname)
				VALUES (%s, %s, %s)
				""", [usuario, senha, nickname])
			rotas_mongo.insert_one({"_id": usuario, "rotas": []}) #Adiciona no mongo
			return Response({"mensagem": "Usuário adicionado", "username": usuario})
		except IntegrityError:
			return Response({"erro": "Dados inválidos ou conflito no banco"}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	return Response({"Erro": "Informe 'username', 'senha' e 'nickname'"}, status=400)
	
@swagger_auto_schema(
	methods=['post'],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'username': openapi.Schema(type=openapi.TYPE_STRING),
			'partida': openapi.Schema(type=openapi.TYPE_STRING),
			'chegada': openapi.Schema(type=openapi.TYPE_STRING),
			'busca': openapi.Schema(type=openapi.TYPE_STRING),
			'total': openapi.Schema(type=openapi.TYPE_INTEGER),
			'trajetos': openapi.Schema(type=openapi.TYPE_ARRAY,
				items=openapi.Items(
					type=openapi.TYPE_OBJECT,
					properties={
						'partida': openapi.Schema(type=openapi.TYPE_STRING),
						'chegada': openapi.Schema(type=openapi.TYPE_STRING),
						"horario_partida": openapi.Schema(type=openapi.FORMAT_DATETIME),
						"horario_chegada": openapi.Schema(type=openapi.FORMAT_DATETIME),
						"companhia": openapi.Schema(type=openapi.TYPE_INTEGER),
						"tipo_classe": openapi.Schema(type=openapi.TYPE_STRING),
						"total": openapi.Schema(type=openapi.TYPE_INTEGER),
					}
            	)
            ),
		},
		required=['username', 'partida', 'chegada', 'busca', 'total']
	)
)
@api_view(['POST'])
def insere_rota(request):
	usuario = request.data.get("username")
	aero_partida = request.data.get("partida")
	aero_chegada = request.data.get("chegada")
	tipo_busca = request.data.get("busca")
	total = request.data.get("total")
	trajetos = request.data.get("trajetos")
	if usuario and aero_partida and aero_chegada and tipo_busca and total and trajetos:
		existe_usuario = rotas_mongo.find_one({ "_id": usuario});
		if existe_usuario:
			try:
				nova_rota = {
					"aeroporto_partida": aero_partida,
					"aeroporto_chegada": aero_chegada,
					"tipo_busca": tipo_busca,
					"total": total,
					"trajetos": trajetos
				}
				rotas_mongo.update_one(
					{"_id": usuario},
					{"$push": {"rotas": nova_rota}}
				)
				return Response({"mensagem": "Caminho adicionado"})
			except Exception as e:
				return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		else:
			return Response({"Erro": "Usuário não foi criado ainda"}, status=400)
	return Response({"Erro": "Informe 'username', 'partida', 'chegada', 'tipo_busca', 'total' e o vetor 'trajetos'"}, status=400)

@swagger_auto_schema(
	methods=['get'],
	manual_parameters = [
		openapi.Parameter('username', openapi.IN_QUERY, description="Nome de usuário", type=openapi.TYPE_STRING, required=True),
		openapi.Parameter('quantidade', openapi.IN_QUERY, description="Quantas rotas retornadas (últimas)", type=openapi.TYPE_INTEGER, required=True),
	],
)	
@api_view(['GET'])
def retorna_rotas(request):
	usuario = request.GET.get("username")
	quantidade = request.GET.get("quantidade")
	if usuario and quantidade:
		try:
			quantidade = int(quantidade)
			result = rotas_mongo.aggregate([
				{ "$match": { "_id": usuario } },
				{ "$project": {
					"rotas": { "$slice": ["$rotas", -quantidade] }
				}}
			])
			result_list = list(result)
			rotas = result_list[0].get("rotas", [])
			return Response({"rotas": rotas})
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	return Response({"Erro": "Informe 'username' e 'quantidade'"}, status=400)
		
	
@api_view(['GET'])
def listar_usuarios_postgres(request):
	usuarios = Usuario.objects.raw('SELECT * FROM usuario')
	try:
		serialize = UsuarioSerializer(usuarios, many=True)
		return Response(serialize.data)
	except Exception as e:
			return Response({"erro": str(e)}, status=500)
	
@api_view(['GET'])
def listar_usuarios_mongo(request):
	try:
		usuarios = list(rotas_mongo.find({}, {"_id": 1}))
		nomes = [u["_id"] for u in usuarios]
		return Response({"usuarios": nomes})
	except Exception as e:
			return Response({"erro": str(e)}, status=500)
	
@api_view(['GET'])
def listar_comentarios(request):
	try:
		comentarios = Comentario.objects.raw('SELECT * FROM comentario')
		serialize = ComentarioSerializer(comentarios, many=True)
		return Response(serialize.data)
	except Exception as e:
			return Response({"erro": str(e)}, status=500)
	
@swagger_auto_schema(
	methods=['post'],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'conteudo': openapi.Schema(type=openapi.TYPE_STRING),
			'username': openapi.Schema(type=openapi.TYPE_STRING),
			'iata': openapi.Schema(type=openapi.TYPE_STRING),
			'id': openapi.Schema(type=openapi.TYPE_INTEGER),
			'comentario_pai': openapi.Schema(type=openapi.TYPE_INTEGER),
		},
		required=['conteudo', 'username', 'iata', 'id']
	)
)
@api_view(['POST'])
def insere_comentario(request):
	conteudo = request.data.get("conteudo")
	usuario = request.data.get("username")
	aeroporto_iata = request.data.get("iata")
	companhia_id = request.data.get("id")
	comentario_pai_id = request.data.get("comentario_pai")
	if conteudo and usuario and aeroporto_iata and not companhia_id and not comentario_pai_id:
		try:
			with connection.cursor() as cursor:
				cursor.execute(""" 
				INSERT INTO comentario (conteudo, usuario_username, aeroporto_iata)
				VALUES (%s, %s, %s)
				RETURNING id
				""", [conteudo, usuario, aeroporto_iata])
				comentario_id = cursor.fetchone()[0]
			return Response({"mensagem": "Comentario adicionado", "id": comentario_id})
		except IntegrityError:
			return Response({"erro": "Dados inválidos ou conflito no banco"}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	if conteudo and usuario and not aeroporto_iata and companhia_id and not comentario_pai_id:
		try:
			with connection.cursor() as cursor:
				cursor.execute(""" 
				INSERT INTO comentario (conteudo, usuario_username, companhia_id)
				VALUES (%s, %s, %s)
				RETURNING id
				""", [conteudo, usuario, companhia_id])
				comentario_id = cursor.fetchone()[0]
			return Response({"mensagem": "Comentario adicionado", "id": comentario_id})
		except IntegrityError:
			return Response({"erro": "Dados inválidos ou conflito no banco"}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	if conteudo and usuario and not aeroporto_iata and not companhia_id and comentario_pai_id:
		try:
			with connection.cursor() as cursor:
				cursor.execute(""" 
				INSERT INTO comentario (conteudo, usuario_username, comentario_pai_id)
				VALUES (%s, %s, %s)
				RETURNING id
				""", [conteudo, usuario, comentario_pai_id])
				comentario_id = cursor.fetchone()[0]
			return Response({"mensagem": "Comentario adicionado", "id": comentario_id})
		except IntegrityError:
			return Response({"erro": "Dados inválidos ou conflito no banco"}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	if not conteudo or not usuario:
		return Response({"Erro": "Informe 'conteudo', 'username' e 'iata' ou 'id' ou 'comentario_pai'"}, status=400)
	return Response({"Erro": "Informe apenas um: 'iata' ou 'id' ou 'comentario_pai'"}, status=400)
	
def combina_voos_por_trecho_por_preco(listas_de_voos):
    combinacoes = product(*listas_de_voos)
    combinacoes_validas = []

    for combo in combinacoes:
        valido = True
        for i in range(len(combo) - 1):
            if combo[i]['voo']['horario_chegada'] >= combo[i+1]['voo']['horario_partida']:
                valido = False
                break
        if valido:
            combinacoes_validas.append(combo)

    melhor_rota = None
    menor_preco = None

    for combo in combinacoes_validas:
        preco_total = sum(item['preco'] for item in combo)
        if menor_preco is None or preco_total < menor_preco:
            menor_preco = preco_total
            melhor_rota = combo

    return melhor_rota, menor_preco
    

def combina_voos_por_trecho(listas_voos):
    combinacoes = product(*listas_voos)
    combinacoes_validas = []

    for combo in combinacoes:
        valido = True
        for i in range(len(combo) - 1):
            if combo[i]['horario_chegada'] >= combo[i+1]['horario_partida']:
                valido = False
                break
        if valido:
            combinacoes_validas.append(combo)

    # Escolhe a combinação com menor tempo total
    melhor_rota = None
    menor_tempo = None

    for combo in combinacoes_validas:
        inicio = combo[0]['horario_partida']
        fim = combo[-1]['horario_chegada']
        tempo_total = (fim - inicio).total_seconds()

        if menor_tempo is None or tempo_total < menor_tempo:
            menor_tempo = tempo_total
            melhor_rota = combo

    return melhor_rota, menor_tempo

@swagger_auto_schema(
	methods=['get'],
	manual_parameters = [
		openapi.Parameter('partida', openapi.IN_QUERY, description="IATA do aeroporto de origem", type=openapi.TYPE_STRING, required=True),
		openapi.Parameter('chegada', openapi.IN_QUERY, description="IATA do aeroporto de destino", type=openapi.TYPE_STRING, required=True),
		openapi.Parameter('classe', openapi.IN_QUERY, description="Classe escolhida", type=openapi.TYPE_STRING, required=True),
		openapi.Parameter('tipo_busca', openapi.IN_QUERY, description="Nome de usuário", type=openapi.TYPE_STRING, required=True),
	],
)	
@api_view(['GET'])
def pesquisa(request):
	aero_partida = request.GET.get("partida")
	aero_chegada = request.GET.get("chegada")
	classe = request.GET.get("classe")
	tipo_busca = request.GET.get("tipo_busca")
	if aero_partida and aero_chegada and tipo_busca:
		if tipo_busca == 'distancia':
			query = '''
			MATCH path = (a1:Aeroporto {iata: $partida})-[:ORIGEM|DESTINO*1..5]->(a2:Aeroporto {iata: $chegada})
			WHERE ALL(n IN nodes(path) WHERE single(m IN nodes(path) WHERE m = n))
			WITH [n IN nodes(path) WHERE n:Trajeto] AS trechos, 
				 [n IN nodes(path) WHERE n:Aeroporto AND n.iata IS NOT NULL | n.iata] AS rota
			WITH rota, trechos, reduce(soma = 0, trecho IN trechos | soma + trecho.distancia) AS totalDist
			RETURN rota, totalDist, trechos
			ORDER BY totalDist ASC
			LIMIT 1
			'''
			try:
				with driver.session() as session:
				    record = session.run(query, partida=aero_partida, chegada=aero_chegada).single()
				    if not record:
				        return Response({"erro": "Rota não encontrada"}, status=404)

				    rota = record["rota"]
				    total_dist = record["totalDist"]
				    trechos = record["trechos"]

				    horario_limite = datetime.now()

				    voos_resultado = []
				    for trecho in trechos:
				        voo_query = '''
				        MATCH (v:Voo)-[:PERTENCE_A]->(t:Trajeto)
				        WHERE id(t) = $id_trecho AND datetime(v.horario_partida) > datetime($limite)
				        RETURN v
				        ORDER BY v.horario_partida ASC
				        LIMIT 1
				        '''
				        voo_result = session.run(voo_query, id_trecho=trecho.id, limite=horario_limite.isoformat())
				        voo_record = voo_result.single()

				        if not voo_record:
				            return Response({"erro": "Sem voo válido para um dos trechos"}, status=400)

				        voo = voo_record["v"]
				        voo_dict = dict(voo)
				        voo_dict["horario_partida"] = voo_dict["horario_partida"].isoformat()
				        voo_dict["horario_chegada"] = voo_dict["horario_chegada"].isoformat()
				        voos_resultado.append(voo_dict)

				        # Atualiza o limite para o horário de chegada do voo atual
				        horario_limite = voo["horario_chegada"]

				    return Response({
				        "rota": rota,
				        "distancia_total": total_dist,
				        "voos": voos_resultado
				    })
			except Exception as e:
				return Response({"erro": str(e)}, status=500)
		elif tipo_busca == 'tempo':
			query = '''
			MATCH path = (a1:Aeroporto {iata: $partida})-[:ORIGEM|DESTINO*1..3]->(a2:Aeroporto {iata: $chegada})
			WHERE ALL(n IN nodes(path) WHERE single(m IN nodes(path) WHERE m = n))
			WITH path, nodes(path) AS stops

			WITH path, [i IN range(0, size(stops)-2) | {
				origem: stops[i],
				destino: stops[i+1]
			}] AS trechos

			UNWIND trechos AS trecho
			WITH path, trecho, trecho.origem AS origem, trecho.destino AS destino

			MATCH (origem)<-[:ORIGEM]-(t:Trajeto)-[:DESTINO]->(destino)
			MATCH (v:Voo)-[:PERTENCE_A]->(t)

			WITH path, trecho, collect(v)[..5] AS voos_por_trecho
			WITH path, collect(voos_por_trecho) AS listas_voos

			WITH path, listas_voos,
				 [n IN nodes(path) WHERE n:Aeroporto AND n.iata IS NOT NULL | n.iata] AS rota

			RETURN rota, listas_voos
			LIMIT 1
			'''
			try:
				with driver.session() as session:
					result = session.run(query, partida=aero_partida, chegada=aero_chegada)
					record = result.single()
					if not record:
						return Response({"rotas": []})

					rota = record["rota"]
					listas_voos = record["listas_voos"]

					for i, lista in enumerate(listas_voos):
						for j, voo in enumerate(lista):
							voo['horario_partida'] = isoparse(voo['horario_partida'])
							voo['horario_chegada'] = isoparse(voo['horario_chegada'])

					melhor_rota, tempo_total = combina_voos_por_trecho(listas_voos)

					if melhor_rota is None:
						return Response({"rotas": []})

					voos_formatados = [{
						"partida": v['horario_partida'].isoformat(),
						"chegada": v['horario_chegada'].isoformat(),
						"companhia": v['companhia']
					} for v in melhor_rota]

					return Response({
						"rota": rota,
						"voos": voos_formatados,
						"tempoTotal": tempo_total
					})

			except Exception as e:
				return Response({"erro": str(e)}, status=500)
		elif tipo_busca == 'preco':
			query = '''
			MATCH path = (a1:Aeroporto {iata: $partida})-[:ORIGEM|DESTINO*1..5]->(a2:Aeroporto {iata: $chegada})
			WHERE ALL(n IN nodes(path) WHERE single(m IN nodes(path) WHERE m = n))
			  AND ALL(n IN nodes(path) WHERE n:Aeroporto OR n:Trajeto)

			WITH path, nodes(path) AS stops
			WITH path, [i IN range(0, size(stops)-2) | {origem: stops[i], destino: stops[i+1]}] AS trechos

			UNWIND trechos AS trecho
			WITH path, trecho, trecho.origem AS origem, trecho.destino AS destino
			MATCH (origem)<-[:ORIGEM]-(t:Trajeto)-[:DESTINO]->(destino)
			MATCH (v:Voo)-[:PERTENCE_A]->(t)

			WITH path, trecho, v,
				 CASE $classe
				   WHEN 'executiva' THEN v.preco_executiva
				   ELSE v.preco_economica
				 END AS preco

			WITH path, trecho, collect({voo: v, preco: preco})[..5] AS voosPorTrecho
			WITH path, collect(voosPorTrecho) AS listasDeVoos

			WITH path,
				 [n IN nodes(path) WHERE n:Aeroporto AND n.iata IS NOT NULL | n.iata] AS rota,
				 listasDeVoos

			RETURN rota, listasDeVoos
			LIMIT 1
			'''
			try:
				with driver.session() as session:
					result = session.run(query, partida=aero_partida, chegada=aero_chegada, classe=classe)
					record = result.single()
					if not record:
						return Response({"rotas": []})

					rota = record["rota"]
					listas_de_voos = record["listasDeVoos"]

					for lista in listas_de_voos:
						for item in lista:
							voo = item['voo']
							voo['horario_partida'] = isoparse(voo['horario_partida'])
							voo['horario_chegada'] = isoparse(voo['horario_chegada'])

					melhor_rota, preco_total = combina_voos_por_trecho_por_preco(listas_de_voos)

					if melhor_rota is None:
						return Response({"rotas": []})

					voos_formatados = [{
						"partida": item['voo']['horario_partida'].isoformat(),
						"chegada": item['voo']['horario_chegada'].isoformat(),
						"companhia": item['voo']['companhia'],
						"preco": item['preco'],
						"classe": classe
					} for item in melhor_rota]

					return Response({
						"rota": rota,
						"voos": voos_formatados,
						"precoTotal": preco_total
					})
			except Exception as e:
				return Response({"erro": str(e)}, status=500)
	return Response({"Erro": "Informe 'partida', 'chegada' e 'tipo_busca'"}, status=400)

@swagger_auto_schema(
	methods=['post'],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'username': openapi.Schema(type=openapi.TYPE_STRING),
			'nova_senha': openapi.Schema(type=openapi.TYPE_STRING),
		},
		required=['username', 'nova_senha']
	)
)
@api_view(['POST'])
def atualiza_senha(request):
	usuario = request.data.get("username")
	nova_senha = request.data.get("nova_senha")
	if usuario and nova_senha:
		try:
			with connection.cursor() as cursor:
				cursor.execute(
					"UPDATE usuario SET senha = %s WHERE username = %s", [nova_senha, usuario]
				)
			return Response({"mensagem": "Senha atualizada"})
		except IntegrityError:
			return Response({"erro": "Dados inválidos ou conflito no banco"}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	return Response({"Erro": "Informe 'username' e 'nova_senha'"}, status=400)

@swagger_auto_schema(
	methods=['get'],
	manual_parameters = [
		openapi.Parameter('username', openapi.IN_QUERY, description="Nome de usuário", type=openapi.TYPE_STRING, required=True),
	],
)		
@api_view(['GET'])
def verifica_admin(request):
	usuario = request.GET.get("username")
	if usuario:
		try:
			usuario_resposta = Usuario.objects.raw("SELECT * FROM usuario WHERE (username = %s AND is_role_admin = %s)", [usuario, True])
			usuario_dict = [
				{"username": a.username, "senha": a.senha, "nickname": a.nickname, 
				"data_cadastro": a.data_cadastro, "is_role_admin": a.is_role_admin} for a in usuario_resposta
			]
			if(len(usuario_dict) > 0):
				return Response({"is_admin": True})
			else:
				return Response({"is_admin": False})
		except Exception as e:
			return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	return Response({"Erro": "Informe 'username'"}, status=400)

@api_view(['POST'])
def insere_usuario_admin(request):
	try:
		with connection.cursor() as cursor: #Adiciona no postgres
			cursor.execute(""" 
				INSERT INTO usuario (username, senha, nickname)
				VALUES (%s, %s, %s)
				""", ['admin', 'admin', 'admin'])
		rotas_mongo.insert_one({"_id": 'admin', "rotas": []}) #Adiciona no mongo
		with connection.cursor() as cursor:
			cursor.execute(
				"UPDATE usuario SET is_role_admin = %s WHERE username = %s", [True, 'admin']
			)
	except Exception as e:
		return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
