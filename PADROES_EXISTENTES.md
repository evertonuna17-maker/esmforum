# Padrões de Projeto Já Presentes — ESM Forum

Análise sobre o estado atual do código (incluindo o módulo `votos/` criado na Iteração 1).

---

## 1. Repository (parcial)

**Onde está aplicado:** `modelo.js` (para perguntas e respostas) e, de forma mais explícita, `votos/voto_repositorio.js` (para votos).

Nenhum outro arquivo do projeto executa SQL diretamente contra o banco: `server.js` nunca chama `bd.query`/`bd.exec` sozinho, ele sempre passa por `modelo.js` ou por `VotoRepositorio`. Isso é exatamente a ideia central do Repository: esconder os detalhes de acesso a dados atrás de um conjunto de operações com nomes de domínio (`get_pergunta`, `listar_perguntas`, `buscarVotoDoUsuario`), em vez de espalhar SQL pelo código que só precisa "pedir dados".

**Completo ou poderia ser melhorado?** Em `modelo.js` a implementação é parcial: é um conjunto de funções soltas, não uma classe/objeto que possa ser instanciado com dependências diferentes. Já `voto_repositorio.js` é uma implementação mais completa do padrão: é uma classe, recebe a conexão de banco por injeção no construtor, e pode ser trocada por outra implementação (inclusive uma falsa, como no `voto_servico.test.js`) sem que quem a usa perceba a diferença.

---

## 2. Singleton (implícito)

**Onde está aplicado:** `bd/bd_utils.js`.

```js
var bd = new Database('./bd/esmforum.db');
```

Essa linha roda uma única vez, no momento em que o módulo é carregado pela primeira vez. O Node.js armazena em cache o resultado de cada `require`, então todo arquivo que faz `require('./bd/bd_utils.js')` recebe a mesma instância de `bd` — nunca uma conexão nova. Na prática, isso já entrega a garantia central do Singleton (uma única instância compartilhada em toda a aplicação), mesmo sem nenhum código explícito de controle de instância única.

**Completo ou poderia ser melhorado?** É um Singleton "de fábrica" do próprio sistema de módulos do Node, não uma implementação intencional do padrão (não há um método `getInstance()`, nem proteção para impedir que alguém crie uma segunda conexão manualmente com `new Database(...)` em outro lugar do código, como aliás a própria função `reconfig` de `bd_utils.js` permite fazer).

---

## 3. Facade (parcial)

**Onde está aplicado:** `bd/bd_utils.js`.

A biblioteca `better-sqlite3` expõe uma API rica (prepared statements, transações, pragmas, etc.), mas `bd_utils.js` expõe só três funções simples: `query`, `queryAll` e `exec`. Todo o resto do projeto conhece apenas essas três operações — ninguém no código de domínio (`modelo.js`, `voto_repositorio.js`) precisa saber que por baixo existe um `.prepare(...).get(...)` do `better-sqlite3`. Isso é uma Facade: uma interface simplificada escondendo uma biblioteca mais complexa.

**Completo ou poderia ser melhorado?** É parcial porque a Facade aqui só simplifica (esconde a API do `better-sqlite3`), mas não isola totalmente o projeto da biblioteca escolhida: os comandos SQL que passam por `query`/`exec` ainda são texto puro em sintaxe do SQLite, escritos em `modelo.js` e em `voto_repositorio.js`. Uma Facade mais completa também abstrairia a linguagem de consulta, não só a chamada da biblioteca.
