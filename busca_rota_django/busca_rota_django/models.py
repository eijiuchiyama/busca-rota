from django.db import models

class Aeroporto(models.Model):
    iata = models.CharField(max_length=7)
    icao = models.CharField(max_length=7)
    pais = models.CharField(max_length=63)
    cidade = models.CharField(max_length=63)
    nome = = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    
class Usuario(models.Model):
	username = models.CharField(max_length=63)
	senha = models.CharField(max_length=63)
	nickname = models.CharField(max_length=63)
	data_cadastro = models.DateField()
	is_role_admin = models.BooleanField()

class Comentario(models.Model):
	usuario = models.CharField(max_length=63)
	conteudo = models.CharField(max_length=4095)
	horario_postagem = models.DateTimeField()
	
class CompanhiaAerea(models.Model):
	sigla = models.CharField(max_length=63)
	nome = models.CharField(max_length=255)
	
class Aviao(models.Model):
	marca = models.CharField(max_length=255)
	modelo = models.CharField(max_length=255)

