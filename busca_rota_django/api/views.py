from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Aeroporto, Usuario, Comentario, CompanhiaAerea
from .serializers import AeroportoSerializer, UsuarioSerializer, ComentarioSerializer, CompanhiaAereaSerializer

@api_view(['GET'])
def listar_aeroportos(request):
    aeros = Aeroporto.objects.all()
    serializer = AeroportoSerializer(aeros, many=True)
    return Response(serializer.data)
    
   
