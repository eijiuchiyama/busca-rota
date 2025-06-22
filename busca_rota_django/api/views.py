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
        openapi.Parameter('partida', openapi.IN_QUERY, description="Código IATA do aeroporto de partida", type=openapi.TYPE_STRING, required=True),
        openapi.Parameter('chegada', openapi.IN_QUERY, description="Código IATA do aeroporto de chegada", type=openapi.TYPE_STRING, required=True),
    ],
)
@api_view(['GET'])
def lista_caminhos(request):
	aero_partida = request.GET.get("partida")
	aero_chegada = request.GET.get("chegada")
	if aero_partida and aero_chegada:
		query = """
		MATCH path = (a1:Aeroporto {iata: $partida})-[:ORIGEM|DESTINO*1..10]->(a2:Aeroporto {iata: $chegada})
		WHERE ALL(n IN nodes(path) WHERE single(m IN nodes(path) WHERE m = n))
		RETURN [n IN nodes(path) WHERE n.iata IS NOT NULL | n.iata] AS rota
		"""
		try:
			with driver.session() as session:
				result = session.run(query, partida=aero_partida, chegada=aero_chegada)
				rotas = [{"rota": record["rota"]} for record in result]
				return Response({"rotas": rotas})
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	return Response({"erro": "Parâmetros 'partida' e 'chegada' não informados"}, status=400)
		

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
	if id_companhia and iata:
		return Response({"Erro": "Informe apenas um: 'id' ou 'iata'"}, status=400)
	elif id_companhia:
		try:
			comentarios = Comentario.objects.raw("SELECT * FROM comentario WHERE companhia_id = %s", [id_companhia])
			comentarios_dict = [
				{"conteudo": a.conteudo, "horario_postagem": a.horario_postagem, "usuario_username": a.usuario_username, 
				"aeroporto_iata": a.aeroporto_iata, "companhia_id": a.companhia_id, "comentario_pai_id": a.comentario_pai_id} for a in comentarios
			]
			return Response({"comentarios": comentarios_dict})
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	elif iata:
		try:
			comentarios = Comentario.objects.raw("SELECT * FROM comentario WHERE aeroporto_iata = %s", [iata])
			comentarios_dict = [
				{"conteudo": a.conteudo, "horario_postagem": a.horario_postagem, "usuario_username": a.usuario_username, 
				"aeroporto_iata": a.aeroporto_iata, "companhia_id": a.companhia_id, "comentario_pai_id": a.comentario_pai_id} for a in comentarios
			]
			return Response({"comentarios": comentarios_dict})
		except Exception as e:
			return Response({"erro": str(e)}, status=500)
	return Response({"Erro": "Informe 'id' ou 'iata'"}, status=400)

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
			usuario = Usuario.objects.raw("SELECT * FROM usuario WHERE (username = %s AND senha = %s)", [usuario, senha])
			usuario_dict = [
				{"username": a.username, "senha": a.senha, "nickname": a.nickname, 
				"data_cadastro": a.data_cadastro, "is_role_admin": a.is_role_admin} for a in usuario
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
	data = date.today()
	is_admin = False
	if usuario and data and nickname:
		try:
			with connection.cursor() as cursor: #Adiciona no postgres
				cursor.execute(""" 
				INSERT INTO usuario (username, senha, nickname, data_cadastro, is_role_admin)
				VALUES (%s, %s, %s, %s, %s)
				""", [usuario, senha, nickname, data, is_admin])
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
	horario_postagem = datetime.now()
	usuario = request.data.get("username")
	aeroporto_iata = request.data.get("iata")
	companhia_id = request.data.get("id")
	comentario_pai_id = request.data.get("comentario_pai")
	if conteudo and usuario and aeroporto_iata and not companhia_id:
		try:
			with connection.cursor() as cursor:
				cursor.execute(""" 
				INSERT INTO comentario (conteudo, horario_postagem, usuario_username, aeroporto_iata, companhia_id, comentario_pai_id)
				VALUES (%s, %s, %s, %s, %s, %s)
				RETURNING id
				""", [conteudo, horario_postagem, usuario, aeroporto_iata, companhia_id, comentario_pai_id])
				comentario_id = cursor.fetchone()[0]
			return Response({"mensagem": "Comentario adicionado", "id": comentario_id})
		except IntegrityError:
			return Response({"erro": "Dados inválidos ou conflito no banco"}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	if conteudo and not usuario and not aeroporto_iata and companhia_id:
		try:
			with connection.cursor() as cursor:
				cursor.execute(""" 
				INSERT INTO comentario (conteudo, horario_postagem, usuario_username, aeroporto_iata, companhia_id, comentario_pai_id)
				VALUES (%s, %s, %s, %s, %s, %s)
				RETURNING id
				""", [conteudo, horario_postagem, usuario, aeroporto_iata, companhia_id, comentario_pai_id])
				comentario_id = cursor.fetchone()[0]
			return Response({"mensagem": "Comentario adicionado", "id": comentario_id})
		except IntegrityError:
			return Response({"erro": "Dados inválidos ou conflito no banco"}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	if not conteudo or not usuario:
		return Response({"Erro": "Informe 'conteudo', 'username' e 'iata' ou 'id'"}, status=400)
	return Response({"Erro": "Informe apenas um: 'username' ou 'iata' ou 'id'"}, status=400)

@api_view(['GET'])
def pesquisa(request):
	aero_partida = request.GET.get("partida")
	aero_chegada = request.GET.get("chegada")
	tipo_busca = request.GET.get("tipo_busca")
	if aero_partida and aero_chegada and tipo_busca:
		if tipo_busca == 'distancia':
			query = '''
			MATCH path = (a1:Aeroporto {iata: $partida})-[:ORIGEM|DESTINO*1..9]-(a2:Aeroporto {iata: $chegada})
			WHERE ALL(n IN nodes(path) WHERE single(m IN nodes(path) WHERE m = n))
			WITH [n IN nodes(path) WHERE n:Trajeto] AS trechos,
				[n IN nodes(path) WHERE n:Aeroporto AND exists(n.iata) | n.iata] AS rota
			WITH rota, reduce(soma = 0, trecho IN trechos | soma + trecho.distancia) AS totalDist
			RETURN rota, totalDist
			ORDER BY totalDist ASC
			LIMIT 1
			'''
			try:
				with driver.session() as session:
					result = session.run(query, partida=aero_partida, chegada=aero_chegada)
					rotas = [{"rota": record["rota"], "distancia": record["totalDist"]} for record in result]
					return Response({"rotas": rotas})
			except Exception as e:
				return Response({"erro": str(e)}, status=500)
		elif tipo_busca == 'tempo':
			query = '''
			MATCH path = (a1:Aeroporto {iata: $partida})-[:ORIGEM|DESTINO*1..5]->(a2:Aeroporto {iata: $chegada})
			WHERE ALL(n IN nodes(path) WHERE single(m IN nodes(path) WHERE m = n))

			WITH path, nodes(path) AS stops
			CALL {
				WITH stops
				WITH stops, range(0, size(stops)-2) AS indices
				UNWIND indices AS i
				MATCH (stops[i])<-[:ORIGEM]-(t:Trajeto)-[:DESTINO]->(stops[i+1])
				MATCH (v:Voo)-[:PERTENCE_A]->(t)
				RETURN collect(v) AS voosPossiveis
			}
			WITH path, voosPossiveis
			WHERE size(voosPossiveis) = length(relationships(path))

			UNWIND voosPossiveis AS voos
			WITH path, voos
			ORDER BY voos.horario_partida ASC

			WITH path,
				voos,
				head(voos).horario_partida AS inicio,
				last(voos).horario_chegada AS fim,
				duration.inSeconds(head(voos).horario_partida, last(voos).horario_chegada).seconds AS tempo_total
			ORDER BY tempo_total ASC
			LIMIT 1

			RETURN [n IN nodes(path) WHERE n.iata IS NOT NULL | n.iata] AS rota,
				[v IN voos | {
				partida: v.horario_partida,
				chegada: v.horario_chegada,
				companhia: v.companhia
				}] AS voos,
			tempo_total
			'''
			try:
				with driver.session() as session:
					result = session.run(query, partida=aero_partida, chegada=aero_chegada)
					rotas = [{"rota": record["rota"], "tempoTotal": record["tempoTotal"]} for record in result]
					return Response({"rotas": rotas})
			except Exception as e:
				return Response({"erro": str(e)}, status=500)
		elif tipo_busca == 'preco':
			query = '''
			MATCH path = (a1:Aeroporto {iata: $partida})-[:ORIGEM|DESTINO*1..5]->(a2:Aeroporto {iata: $chegada})
			WHERE ALL(n IN nodes(path) WHERE single(m IN nodes(path) WHERE m = n))
				AND ALL(n IN nodes(path) WHERE n:Aeroporto OR n:Trajeto)
			WITH path,
				[n IN nodes(path) WHERE n:Trajeto] AS trechos
			UNWIND trechos AS trajeto
			MATCH (v:Voo)-[:PERTENCE_A]->(trajeto)
			WITH path, trajeto, min(v.preco_economica) AS precoMinimo
			WITH path, sum(precoMinimo) AS precoTotal
			RETURN 
				[n IN nodes(path) WHERE n:Aeroporto | n.iata] AS rota,
				precoTotal
			ORDER BY precoTotal ASC
			LIMIT 1
			'''
			try:
				with driver.session() as session:
					result = session.run(query, partida=aero_partida, chegada=aero_chegada)
					rotas = [{"rota": record["rota"], "precoTotal": record["precoTotal"]} for record in result]
					return Response({"rotas": rotas})
			except Exception as e:
				return Response({"erro": str(e)}, status=500)
	return Response({"Erro": "Informe 'partida', 'chegada' e 'tipo_busca'"}, status=400)
	

