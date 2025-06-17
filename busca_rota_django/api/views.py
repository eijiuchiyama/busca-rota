from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Aeroporto, Usuario, Comentario, CompanhiaAerea
from .serializers import AeroportoSerializer, UsuarioSerializer, ComentarioSerializer, CompanhiaAereaSerializer

@api_view(['GET'])
def listar_todos_aeroportos(request):
	aeros = Aeroporto.objects.raw('SELECT * FROM aeroporto')
	serializer = AeroportoSerializer(aeros, many=True)
	return Response(serializer.data)
    
@api_view(['GET'])
def pega_aeroporto(request):
	iata = request.GET.get("iata")
	if iata:
		aeroportos = Aeroporto.objects.raw("SELECT * FROM aeroporto WHERE iata = %s", [iata])
		aeroportos_dict = [
			{"iata": a.iata, "icao": a.icao, "pais": a.pais, "cidade": a.cidade, "nome": a.nome, "latitude": a.latitude, "longitude": a.longitude} for a in aeroportos
		]
		return Response({"aeroportos": aeroportos_dict})
	return Response({"Erro": "Parâmetro 'iata' não informado"}, status=400)
	  
