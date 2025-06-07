# meu_app/serializers.py

from rest_framework import serializers
from .models import Aeroporto, Usuario, Comentario, CompanhiaAerea

class AeroportoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aeroporto
        fields = '__all__'
     
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        
class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'
        
class CompanhiaAereaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanhiaAerea
        fields = '__all__'
