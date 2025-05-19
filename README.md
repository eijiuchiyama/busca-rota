# Busca-Rota

## Sobre

O Busca-Rota é um site web que permite a seus usuários pesquisar rotas aéreas filtrando por preço, distância ou tempo. 

## Ferramentas utilizadas

Docker

React

Django

PostgreSQL (BD relacional)

MongoDB (BD de documentos)

Neo4J (BD de grafos)

## Linguagens utilizadas

JavaScript (para React)

Python (para Django)

SQL (para PostgreSQL)

Cypher (para o Neo4J)

## Como executar

O projeto foi containerizado com o uso do Docker. Para executar o projeto, é preciso instalar o Docker juntamente com o 
Docker Compose e após isso, no diretório raiz do projeto, executar:

```
sudo docker-compose up --build
```

Para parar o container, use:

```
sudo docker-compose down
```

São utilizadas as seguintes portas:

Back-end: 8000

Front-end: 3000

PostgreSQL: 5432

MongoDB: 27017

Neo4J: 7474