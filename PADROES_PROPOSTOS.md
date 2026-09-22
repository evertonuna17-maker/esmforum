# Padrões de Projeto Propostos

Três padrões, um de cada categoria, propostos para funcionalidades do ESM Forum. Diagramas (imagem + fonte Mermaid) na pasta `diagramas/`.

---

## 1. Factory Method (Criacional) — Montagem da "view" completa de uma Pergunta

**Diagrama:** `diagramas/padrao_factory.svg` / `.mmd`

### a) Justificativa e Contexto

Hoje, montar a lista de perguntas para a tela envolve juntar dados de vários lugares: `modelo.listar_perguntas()` traz `texto` e `num_respostas`; o `VotoRepositorio` calcula `saldo_votos`; e, quando a funcionalidade de Tags existir, será preciso buscar as tags de cada pergunta também. Essa montagem já está começando a vazar para dentro de `server.js` (foi lá que coloquei o `saldo_votos` na Tarefa 2, justamente para não sobrecarregar ainda mais o `modelo.js`, mas isso significa que `server.js` está virando o lugar que "sabe" como montar uma pergunta completa).

O problema que esse padrão resolve: centralizar, em um único lugar, a lógica de "como construir uma Pergunta pronta para a tela, com todos os dados agregados", em vez de deixar cada rota de `server.js` remontar isso na mão.

### b) Proposta de Solução

Uma classe `PerguntaViewFactory` recebe (por injeção, no construtor — mesma ideia do DIP já usado no `VotoServico`) os repositórios de que precisa: `modelo`, `votoRepositorio`, `tagRepositorio`. Ela expõe `criarView(id_pergunta)` e `criarViewLista()`, que devolvem objetos `PerguntaView` já com `num_respostas`, `saldo_votos` e `tags` prontos. `server.js` passa a chamar só a factory, sem saber como o objeto é montado por dentro.

### c) Exemplo de Código (pseudo-código)

```js
class PerguntaViewFactory {
  constructor(modelo, votoRepositorio, tagRepositorio) {
    this.modelo = modelo;
    this.votoRepositorio = votoRepositorio;
    this.tagRepositorio = tagRepositorio;
  }

  criarViewLista() {
    const perguntas = this.modelo.listar_perguntas();
    return perguntas.map(p => this._montarView(p));
  }

  _montarView(pergunta) {
    return {
      id_pergunta: pergunta.id_pergunta,
      texto: pergunta.texto,
      num_respostas: pergunta.num_respostas,
      saldo_votos: this.votoRepositorio.calcularSaldo(pergunta.id_pergunta),
      tags: this.tagRepositorio.listarTagsDaPergunta(pergunta.id_pergunta),
    };
  }
}

// em server.js:
const perguntaViewFactory = new PerguntaViewFactory(modelo, votoRepositorio, tagRepositorio);
app.get('/', (req, res) => {
  res.json(perguntaViewFactory.criarViewLista());
});
```

---

## 2. Decorator (Estrutural) — Filtros compostos de Busca e Tags

**Diagrama:** `diagramas/padrao_decorator.svg` / `.mmd`

### a) Justificativa e Contexto

As Histórias 2 (Tags) e 3 (Busca) da Parte 2 pedem duas formas diferentes de filtrar a mesma listagem de perguntas: por tag e por palavra-chave. Se cada filtro virar um `if` dentro de uma função `listar_perguntas(filtros)`, essa função cresce a cada novo filtro que aparecer (e viola o OCP, já discutido na Iteração 1). Além disso, os dois filtros podem ser usados juntos (buscar por palavra-chave *dentro* de uma tag específica), o que um conjunto de `if`s isolados não resolve bem.

### b) Proposta de Solução

Uma interface comum `IListagemPerguntas` com um método `listar()`. `ListagemBase` é a implementação padrão (busca tudo do banco). `FiltroDecorator` é uma classe abstrata que também implementa `IListagemPerguntas`, mas guarda uma referência a outra `IListagemPerguntas` (`origem`) e delega para ela antes de aplicar seu próprio filtro. `FiltroPorTag` e `FiltroPorPalavraChave` são decoradores concretos. Como cada decorador aceita qualquer `IListagemPerguntas` como origem — inclusive outro decorador — dá para compor: `new FiltroPorPalavraChave(new FiltroPorTag(new ListagemBase(), 'javascript'), 'closure')`.

### c) Exemplo de Código (pseudo-código)

```js
class ListagemBase {
  listar() {
    return modelo.listar_perguntas();
  }
}

class FiltroDecorator {
  constructor(origem) {
    this.origem = origem; // outra IListagemPerguntas: base ou outro decorator
  }
}

class FiltroPorTag extends FiltroDecorator {
  constructor(origem, tag) {
    super(origem);
    this.tag = tag;
  }
  listar() {
    const perguntas = this.origem.listar();
    return perguntas.filter(p => p.tags && p.tags.includes(this.tag));
  }
}

class FiltroPorPalavraChave extends FiltroDecorator {
  constructor(origem, termo) {
    super(origem);
    this.termo = termo.toLowerCase();
  }
  listar() {
    const perguntas = this.origem.listar();
    return perguntas.filter(p => p.texto.toLowerCase().includes(this.termo));
  }
}

// uso combinado:
let listagem = new ListagemBase();
if (req.query.tag) listagem = new FiltroPorTag(listagem, req.query.tag);
if (req.query.busca) listagem = new FiltroPorPalavraChave(listagem, req.query.busca);
res.json(listagem.listar());
```

---

## 3. Observer (Comportamental) — Notificação de nova resposta

**Diagrama:** `diagramas/padrao_observer.svg` / `.mmd`

### a) Justificativa e Contexto

A funcionalidade "notificação de novas respostas às perguntas" (uma das 5 solicitadas pelo cliente na Parte 1, priorizada mais baixo no board) precisa que, quando alguém responde a uma pergunta, algo aconteça para o autor da pergunta (por exemplo, um registro que futuramente vira e-mail/push). O problema: se essa lógica for colocada dentro de `cadastrar_resposta()`, o modelo passa a conhecer detalhes de notificação (e-mail, log, etc.) — algo que não é responsabilidade dele (viola SRP) e que também trava o código a uma única forma de notificar (viola OCP: qualquer novo tipo de notificação exigiria editar `cadastrar_resposta` de novo).

### b) Proposta de Solução

`PerguntaSujeito` mantém uma lista de observadores (`IObservadorResposta`) e chama `notificarNovaResposta(pergunta, resposta)` sempre que uma resposta nova é cadastrada. Cada observador concreto decide o que fazer com esse evento — `NotificadorAutorDaPergunta` prepararia uma notificação para quem perguntou; `NotificadorLogAuditoria` apenas registraria o evento em log. Novos tipos de notificação são adicionados criando uma nova classe que implementa `IObservadorResposta` e inscrevendo-a — sem tocar em `PerguntaSujeito` nem no fluxo de `cadastrar_resposta`.

### c) Exemplo de Código (pseudo-código)

```js
class PerguntaSujeito {
  constructor() {
    this.observadores = [];
  }
  inscrever(observador) {
    this.observadores.push(observador);
  }
  notificarNovaResposta(pergunta, resposta) {
    this.observadores.forEach(obs => obs.notificar(pergunta, resposta));
  }
}

class NotificadorAutorDaPergunta {
  notificar(pergunta, resposta) {
    // ex.: enfileirar notificação para pergunta.id_usuario
    console.log(`Notificar autor da pergunta ${pergunta.id_pergunta}: nova resposta recebida`);
  }
}

class NotificadorLogAuditoria {
  notificar(pergunta, resposta) {
    console.log(`[log] resposta ${resposta.id_resposta} criada para pergunta ${pergunta.id_pergunta}`);
  }
}

// configuração, uma vez, na inicialização do servidor:
const perguntaSujeito = new PerguntaSujeito();
perguntaSujeito.inscrever(new NotificadorAutorDaPergunta());
perguntaSujeito.inscrever(new NotificadorLogAuditoria());

// dentro da rota POST /respostas, depois de cadastrar_resposta:
const id_resposta = modelo.cadastrar_resposta(id_pergunta, resposta);
const pergunta = modelo.get_pergunta(id_pergunta);
perguntaSujeito.notificarNovaResposta(pergunta, { id_resposta, texto: resposta });
```
