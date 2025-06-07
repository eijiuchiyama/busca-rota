# meu_app/serializers.py

from rest_framework import serializers
from .models import Aeroporto, Usuario, Comentario, 

class PessoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pessoa
        fields = '__all__'
