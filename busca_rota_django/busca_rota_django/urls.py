# busca_rota_django/busca_rota_django/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.http import HttpResponse

def home(request):
    return HttpResponse("Bem-vindo à API!")

schema_view = get_schema_view(
   openapi.Info(
      title="API Busca-Rota",
      default_version='v1',
      description="Esta API mostra as URLs para se adquirir determinados dados do banco de dados do projeto Busca-Rota",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
	path('', home),
	path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

