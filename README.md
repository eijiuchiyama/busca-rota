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

pgAdmin (cliente de banco de dados PostgreSQL)

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

E para remover os dados dos bancos de dados, use:

```
sudo docker-compose down -v
```

Os dados do banco de dados relacional são adicionados apenas na primeira primeira vez que o volume é criado. Para testar novamente, é 
preciso utilizar o comando acima.

São utilizadas as seguintes portas:

Back-end: 8000

Front-end: 3000

PostgreSQL: 5432

MongoDB: 27017

Neo4J: 7474

pgAdmin: 8080