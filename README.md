# Busca-Rota

## Sobre/About

O Busca-Rota é um site web que permite a seus usuários pesquisar rotas aéreas filtrando por preço, distância ou tempo. 

Busca-Rota is a website that allows its users to search for air routes by filtering by price, distance, or time.

## Ferramentas utilizadas/Used tools

- Docker

- React (com Vite)

- Django

- PostgreSQL (BD relacional)

- MongoDB (BD de documentos)

- Neo4J (BD de grafos)

- pgAdmin (cliente de banco de dados PostgreSQL)

- Swagger (para exibir as URLs da API)

- Figma (para desenhar a interface do site). Pode ser acessada em https://www.figma.com/design/5V03kHDpmly6HUDlb7EesI/MAC0439?node-id=0-1&t=RQk9BKGAHISiwMu8-1

## Linguagens utilizadas/Used programming languages

- JavaScript (para React/for React)

- Python (para Django/for Django)

- SQL (para PostgreSQL/for PostgreSQL)

- Cypher (para o Neo4J/for Neo4J)

## Como executar/How to run

O projeto foi containerizado com o uso do Docker. Para executar o projeto, é preciso instalar o Docker juntamente com o 
Docker Compose (v2) e após isso, no diretório raiz do projeto, executar:

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

---

The project was containerized using Docker. To run the project, you need to install Docker along with Docker Compose (v2) and then, in the project's root directory, run:

```
sudo docker compose up --build
```

To stop the container, use:

```
sudo docker compose down
```

And to remove the data from the databases, use:

```
sudo docker compose down -v
```

The relational database data is added only the first time the volume is created. To test again, you need to use the command above to delete the database and start Docker again.

The following ports are used:

- Back-end: 8000

- Front-end: 3000

- PostgreSQL: 5432

- MongoDB: 27017

- Neo4J: 7474

- pgAdmin: 8080

- Swagger: 8000/swagger

By accessing localhost:\<service port\>, we can use the service or view the databases. In the case of PostgreSQL, we use pgAdmin to view the tables and data.

To use pgAdmin, you must create a new server and fill it with the PostgreSQL database information:

- Host name/address: busca-rota-postgres-1

- Port: 5432

- Maintenance database: busca-rota-postgres

- Username: postgres

- Password: postgres

To access MongoDB data visually, you need to install MongoDB Compass.

## Senhas e usuários/Passwords and usernames

### pgAdmin:

- Usuário/Username: admin@teste.com
- Senha/Password: admin123

### Neo4J:

- Connect URL: bolt://localhost:7687
- Usuário/Username: neo4j
- Senha/Password: neo4jneo4j

## Testes/Tests

Podem ser executados com os seguintes comandos:

Can be executed with the following commands:

### Postgres

```
sudo docker compose exec -T postgres psql -U postgres -d busca-rota-postgres < testes_postgres.sql
```

### Neo4J

```
sudo docker exec -i busca-rota-neo4j-1 cypher-shell -u neo4j -p neo4jneo4j < testes_neo4j.cypher
```

## Uso do Postman/Postman usage

O Postman foi utilizado para verificar as saídas das APIs a partir de requisições do tipo get e post

Para utilizá-lo, você pode clicar em 'Send an API request' e escolher se a sua requisição é get ou post

Após isso, adicione a URL da API no campo correspondente. Para requisições get insira os parâmetros na própria URL,
enquanto para requisições post insira parâmetros em raw, no formato json, em que o nome do parâmetro é a chave e 
o seu valor é o valor, como no exemplo.

```
{
    "conteudo": "Adorei o aeroporto",
    "username": "eiji",
    "iata": "GRU"
}
```

Foi criado um documento em txt com algumas consultas a serem feitas no Postman, 
de modo que o comportamento das APIs possa ser mais facilmente visualizado.

---

Postman was used to verify the API outputs from GET and POST requests.

To use it, you can click on 'Send an API request' and choose whether your request is GET or POST.

After that, add the API URL in the corresponding field. For GET requests, insert the parameters in the URL itself,

while for POST requests, insert parameters in raw JSON format, where the parameter name is the key and its value is the value, as in the example.

```
{

"content": "I loved the airport",

"username": "eiji",

"iata": "GRU"

}
```

A text document was created with some queries to be made in Postman,
so that the behavior of the APIs can be more easily visualized.
