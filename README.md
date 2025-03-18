A aplicação Cabeleleila Leila foi desenvolvida utilizando Nodejs, MySQL, Angular e Ionic. Para a conexão com o Banco de Dados o Prisma foi escolhido como ORM.

Para executar o projeto é necessário baixar ou clonar o projeto, criar um arquivo .env dentro do diretório 'Backend' com as seguintes informações:

```
DATABASE_URL="mysql://usuario:senha@localhost:3306/cabeleleila"
ACCESS_JWT="AvaliacaoDSIN"
```
E então, ainda em '/Backend', executar `npm i` e `npm run db:reset`, com isso a profissional Leila é criada, com email 'leila@gmail.com' e senha 'leila123'.
Por fim, vá ao diretório '/Frontend' e execute `ionic serve`, é provável que abra uma aba no seu navegador padrão com a aplicação em execução.
Caso isso não aconteça, vá até o link padrão 'http://localhost:8100'.
