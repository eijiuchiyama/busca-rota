# Busca-Rota

## Sobre

O Busca-Rota é um site web que permite a seus usuários pesquisar rotas aéreas filtrando por preço, distância ou tempo. 

## Ferramentas utilizadas

- Docker

- React (com Vite)

- Django

- PostgreSQL (BD relacional)

- MongoDB (BD de documentos)

- Neo4J (BD de grafos)

- pgAdmin (cliente de banco de dados PostgreSQL)

- Swagger (para exibir as URLs da API)

## Linguagens utilizadas

- JavaScript (para React)

- Python (para Django)

- SQL (para PostgreSQL)

- Cypher (para o Neo4J)

## Como executar

O projeto foi containerizado com o uso do Docker. Para executar o projeto, é preciso instalar o Docker juntamente com o 
Docker Compose e após isso, no diretório raiz do projeto, executar:

```
sudo docker compose up --build
```

Para parar o container, use:

```
sudo docker compose down
```

E para remover os dados dos bancos de dados, use:

```
sudo docker compose down -v
```

Os dados do banco de dados relacional são adicionados apenas na primeira primeira vez que o volume é criado. Para testar novamente, é 
preciso utilizar o comando acima para apagar o banco de dados e subir novamente o Docker.

São utilizadas as seguintes portas:

- Back-end: 8000

- Front-end: 3000

- PostgreSQL: 5432

- MongoDB: 27017

- Neo4J: 7474

- pgAdmin: 8080

- Swagger: 8000/swagger

Ao acessar localhost:\<porta do serviço\>, podemos utilizar o serviço ou ver os bancos de dados. No caso do PostgreSQL, usamos o pgAdmin para ver as tabelas e dados.
Para usar o pgAdmin, deve-se criar um novo server e preencher com os dados do banco de dados PostgreSQL:

- Host name/address: busca-rota-postgres-1

- Port: 5432

- Maintenance database: busca-rota-postgres

- Username: postgres

- Password: postgres

Para acessar os dados do MongoDB de forma visual é preciso instalar o MongoDB Compass.

## Senhas e usuários:

### pgAdmin:

- Usuário: admin@teste.com
- Senha: admin123

### Neo4J:

- Connect URL: bolt://localhost:7687
- Usuário: neo4j
- Senha: neo4jneo4j

## Testes

Podem ser executados com os seguintes comandos:

### Postgres

```
sudo docker compose exec -T postgres psql -U postgres -d busca-rota-postgres < testes_postgres.sql
```

### Neo4J

```
sudo docker exec -i busca-rota-neo4j-1 cypher-shell -u neo4j -p neo4jneo4j < testes_neo4j.cypher
```
