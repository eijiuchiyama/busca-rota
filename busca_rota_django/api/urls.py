# busca_rota_django/api/urls.py
from django.urls import path
from .views import listar_todos_aeroportos
from .views import pega_aeroporto

urlpatterns = [
    path('todos_aeroportos/', listar_todos_aeroportos),
    path('aeroporto/', pega_aeroporto),
]

