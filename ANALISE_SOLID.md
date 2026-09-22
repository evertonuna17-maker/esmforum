# Análise SOLID — Código Existente (ESM Forum)

Análise feita sobre o código real do backend antes da implementação da Tarefa 2: `server.js`, `modelo.js` e `bd/bd_utils.js` (o projeto não possui pasta `routes/`, como já constatado na Parte 1).

---

## a) Pontos Positivos

### 1. Single Responsibility Principle — `bd/bd_utils.js`

```js
function query(query, params) {
  return bd.prepare(query).get(params);
}

function queryAll(query, params) {
  return bd.prepare(query).all(params);
}

function exec(statement, params) {
  return bd.prepare(statement).run(params);
}
```

Este módulo tem uma única razão para mudar: **como o projeto conversa com o SQLite**. Ele não sabe o que é uma "pergunta" ou uma "resposta" — só sabe executar SQL genérico. Se um dia o projeto trocasse de SQLite para outro banco, só esse arquivo mudaria.

### 2. Single Responsibility Principle — funções de `modelo.js`

```js
function get_pergunta(id_pergunta) {
  return bd.query('select * from perguntas where id_pergunta = ?', [id_pergunta]);
}

function get_respostas(id_pergunta) {
  return bd.queryAll('select * from respostas where id_pergunta = ?', [id_pergunta]);
}
```

Cada função busca exatamente um tipo de dado. `get_pergunta` só muda se a forma de buscar uma pergunta mudar; `get_respostas` só muda se a forma de buscar respostas mudar. Não há uma função genérica tentando fazer as duas coisas.

### 3. Dependency Inversion Principle (parcial) — mecanismo de troca de banco em `modelo.js`

```js
var bd = require('./bd/bd_utils.js');

function reconfig_bd(mock_bd) {
  bd = mock_bd;
}
```

`modelo.js` não está 100% travado a uma única instância de banco: ele expõe uma forma de substituir `bd` por qualquer objeto que implemente `query`/`queryAll`/`exec`. Isso é uma inversão de dependência ainda que informal (não há injeção via construtor, é uma variável de módulo reatribuída) — mas já demonstra que o projeto reconhece o valor de depender de uma abstração, não de uma implementação fixa. Essa mesma ideia foi usada de forma mais explícita no `VotoRepositorio` da Tarefa 2 (injeção via construtor).

---

## b) Oportunidades de Melhoria

### 1. Dependency Inversion Principle violado — `require` direto em `modelo.js`

```js
var bd = require('./bd/bd_utils.js');
```

Apesar do mecanismo `reconfig_bd` (ponto positivo acima), a dependência inicial de `modelo.js` é direta e concreta: o módulo importa `bd_utils.js` especificamente, no topo do arquivo, antes mesmo de qualquer código rodar. Qualquer módulo que faça `require('./modelo.js')` (como `server.js`) já herda essa amarração transitiva a uma implementação concreta de banco. A troca por um mock só é possível via uma variável mutável reatribuída depois — não existe injeção de dependência real (por construtor ou parâmetro) que tornasse essa troca explícita.

**Como poderia ser melhorado:** `modelo.js` poderia expor uma função de fábrica que recebe `bd` como parâmetro (ex.: `function criarModelo(bd) { return { listar_perguntas, ... } }`), em vez de depender de uma variável global de módulo. Essa é exatamente a abordagem usada no novo `VotoServico`/`VotoRepositorio` da Tarefa 2, que recebem a dependência via construtor.

### 2. Single Responsibility Principle violado — `listar_perguntas()` em `modelo.js`

```js
function listar_perguntas() {
  const perguntas = bd.queryAll('select * from perguntas', []);
  perguntas.forEach(pergunta => pergunta['num_respostas'] = get_num_respostas(pergunta['id_pergunta']));
  return perguntas;
}
```

Essa função tem duas responsabilidades, não uma: (1) buscar a lista de perguntas, e (2) decidir como cada pergunta deve ser enriquecida com dados agregados (`num_respostas`). Ela tem, portanto, dois motivos para mudar: se a forma de listar perguntas mudar, ou se a forma de calcular `num_respostas` mudar. O problema fica mais visível quando se soma um segundo campo agregado: o `saldo_votos` (Tarefa 2) não foi colocado dentro de `listar_perguntas` propositalmente — foi composto de fora, em `server.js`, para não fazer essa função crescer ainda mais responsabilidades.

**Como poderia ser melhorado:** extrair a etapa de enriquecimento para fora de `listar_perguntas`, deixando essa função responsável só pela busca crua, e delegando a composição dos campos agregados (respostas, votos, e futuros campos) para quem monta a resposta da API — que é justamente o caminho adotado na Tarefa 2 para o saldo de votos.
