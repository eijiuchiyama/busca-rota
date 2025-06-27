# busca_rota_django/api/urls.py
from django.urls import path
from .views import listar_todos_aeroportos, pega_aeroporto, listar_todas_companhias, pega_companhia, comentarios_relacionados, verifica_usuario, insere_usuario, insere_rota, retorna_rotas, listar_usuarios_postgres, listar_usuarios_mongo, listar_comentarios, insere_comentario, pesquisa, atualiza_senha, verifica_admin, insere_usuario_admin, exclui_historico

urlpatterns = [
    path('todos_aeroportos/', listar_todos_aeroportos), #Funcionando
    path('aeroporto/', pega_aeroporto), #Funcionando
    path('todas_companhias/', listar_todas_companhias), #Funcionando
    path('companhia/', pega_companhia), #Funcionando
    path('insere_usuario/', insere_usuario), #Funcionando
    path('verifica_usuario/', verifica_usuario), #Funcionando
    path('todos_usuarios_postgres/', listar_usuarios_postgres), #Funcionando, usado para testes
    path('todos_usuarios_mongo/', listar_usuarios_mongo), #Funcionando, usado para testes
    path('insere_rota/', insere_rota), #Funcionando
    path('retorna_rotas/', retorna_rotas), #Funcionando
    path('insere_comentario/', insere_comentario), #Funcionando
    path('todos_comentarios/', listar_comentarios), #Funcionando, usado para testes
    path('comentarios_relacionados/', comentarios_relacionados), #Funcionando
    path('pesquisa/', pesquisa), #Funcionando
    path('atualiza_senha/', atualiza_senha), #Funcionando
    path('verifica_admin/', verifica_admin), #Funcionando
    path('insere_usuario_admin/', insere_usuario_admin) #Funcionando
    path('exclui_historico/', exclui_historico)
]

