from django.db import models

class Aeroporto(models.Model):
	iata = models.CharField(max_length=3, primary_key=True)
	icao = models.CharField(max_length=4)
	pais = models.CharField(max_length=63)
	cidade = models.CharField(max_length=63)
	nome = models.CharField(max_length=255)
	latitude = models.FloatField()
	longitude = models.FloatField()
	
	class Meta:
		db_table = "aeroporto"
    
class Usuario(models.Model):
	username = models.CharField(max_length=63, primary_key=True)
	senha = models.CharField(max_length=63)
	nickname = models.CharField(max_length=63)
	data_cadastro = models.DateField()
	is_role_admin = models.BooleanField()
	
	class Meta:
		db_table = "usuario"

class Comentario(models.Model):
	conteudo = models.CharField(max_length=4095)
	horario_postagem = models.DateTimeField()
	usuario_username = models.CharField(max_length=63)
	aeroporto_iata = models.CharField(max_length=3)
	companhia_id = models.IntegerField()
	comentario_pai_id = models.IntegerField()
	
	class Meta:
		db_table = "comentario"
	
class CompanhiaAerea(models.Model):
	nome = models.CharField(max_length=255)
	
	class Meta:
		db_table = "companhiaaerea"
