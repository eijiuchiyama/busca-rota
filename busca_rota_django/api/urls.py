# busca_rota_django/api/urls.py
from django.urls import path
from .views import listar_aeroportos

urlpatterns = [
    path('aeroportos/', listar_aeroportos),
]

