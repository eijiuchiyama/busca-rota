#!/bin/bash

# Executa as migrações
python manage.py makemigrations
python manage.py migrate --fake

# Depois roda o comando original (servidor Django)
exec "$@"
