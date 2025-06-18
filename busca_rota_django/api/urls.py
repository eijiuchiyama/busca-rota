# busca_rota_django/api/urls.py
from django.urls import path
from .views import listar_todos_aeroportos, pega_aeroporto, listar_todas_companhias, pega_companhia, comentarios_relacionados, verifica_usuario, insere_usuario, historico_usuario, insere_trajeto

urlpatterns = [
    path('todos_aeroportos/', listar_todos_aeroportos),
    path('aeroporto/', pega_aeroporto),
    path('todas_companhias/', listar_todas_companhias),
    path('companhia/', pega_companhia),
    path('comentarios_rel/', comentarios_relacionados),
    path('verifica_usuario/', verifica_usuario),
    path('insere_usuario/', insere_usuario),
    path('historico_usuario/', historico_usuario),
    path('insere_trajeto/', insere_trajeto),
]

