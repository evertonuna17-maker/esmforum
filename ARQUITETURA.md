# Análise Arquitetural — ESM Forum

## a) Identificação da Arquitetura

**Estilo arquitetural principal: Cliente-Servidor**, com o frontend (`esmforum-react`) e o backend (`esmforum`) publicados como dois repositórios/processos independentes, que só se conversam por HTTP. O frontend é uma SPA React que roda inteiramente no navegador; o backend é um servidor Express que expõe endpoints JSON.

Dentro do backend, existe uma **separação em camadas informal** (não é um framework com camadas nomeadas, mas o código já se organiza assim na prática):

- **Apresentação:** as rotas definidas em `server.js` (`app.get`, `app.post`) — são o ponto de entrada das requisições HTTP, responsáveis por ler `req.params`/`req.body`, chamar a camada de negócio e devolver a resposta (`res.json`/`res.send`) ou o erro (`res.status(500)`)
- **Negócio:** `modelo.js` (perguntas e respostas) e `votos/voto_servico.js` (regra de votação) — contêm as decisões sobre o que fazer com os dados, sem saber nada de HTTP
- **Dados:** `bd/bd_utils.js` (acesso genérico ao SQLite) e `votos/voto_repositorio.js` (acesso específico à tabela `votos`) — só sabem executar SQL, não conhecem regra de negócio nem HTTP

**Inconsistência já observada:** essa separação não é seguida 100% à risca. Na rota `GET /` de `server.js`, o handler chama `votoRepositorio.calcularSaldo(...)` diretamente — ou seja, a camada de apresentação está pulando a camada de negócio (`VotoServico`) e falando direto com a camada de dados nesse ponto específico. Isso é discutido com mais detalhe na Tarefa 6.

**Comunicação frontend-backend:** o frontend faz chamadas `fetch()` para `http://localhost:5000`, trocando JSON puro sobre HTTP (sem GraphQL, sem WebSocket). Não há autenticação (nenhum token é enviado); o backend libera CORS de forma ampla (`Access-Control-Allow-Origin: *`, configurado como middleware em `server.js`). Os endpoints seguem convenções REST-like, mas não são estritamente RESTful (ex.: `POST /respostas` recebe `id_pergunta` no corpo em vez de usar `/perguntas/:id/respostas` como a nova rota de votos faz).

## b) Diagrama Arquitetural

Ver `diagramas/arquitetura_atual.svg` (fonte: `diagramas/arquitetura_atual.mmd`).
