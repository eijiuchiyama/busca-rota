# busca_rota_django/api/urls.py
from django.urls import path
from .views import listar_todos_aeroportos, pega_aeroporto, listar_todas_companhias, pega_companhia, lista_caminhos, comentarios_relacionados, verifica_usuario, insere_usuario, historico_usuario, insere_trajeto, listar_usuarios_postgres, listar_usuarios_mongo, listar_comentarios, insere_comentario

urlpatterns = [
    path('todos_aeroportos/', listar_todos_aeroportos), #Funcionando
    path('aeroporto/', pega_aeroporto), #Funcionando
    path('todas_companhias/', listar_todas_companhias), #Funcionando
    path('companhia/', pega_companhia), #Funcionando
    path('caminhos/', lista_caminhos),
    path('comentarios_rel/', comentarios_relacionados), #
    path('verifica_usuario/', verifica_usuario), #Funcionando
    path('insere_usuario/', insere_usuario), #Funcionando
    path('historico_usuario/', historico_usuario), #Funcionando
    path('insere_trajeto/', insere_trajeto), #Funcionando
    path('todos_usuarios_postgres/', listar_usuarios_postgres), #Funcionando
    path('todos_usuarios_mongo/', listar_usuarios_mongo), #Funcionando
    path('todos_comentarios/', listar_comentarios), #Funcionando
    path('insere_comentario/', insere_comentario), #Funcionando
]

