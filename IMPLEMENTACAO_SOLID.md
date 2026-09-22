# Implementação com SOLID — Sistema de Votação

**Funcionalidade implementada:** Sistema de Votação em Perguntas (upvote/downvote), a funcionalidade principal escolhida desde a Parte 2 (história de usuário + caso de uso já detalhados).

**Código:** backend em `votos/decisao_voto.js`, `votos/tipos_voto.js`, `votos/voto_repositorio.js`, `votos/voto_servico.js`, integrado em `server.js`; testes em `testes/voto_servico.test.js` e `testes/voto_repositorio.integration.test.js`; nova tabela `votos` em `bd/schema.sql`; frontend em `esmforum-react/src/pages/Pergunta.js`.

---

## Como cada princípio foi aplicado

### Single Responsibility Principle (SRP)

A funcionalidade foi dividida em 4 módulos, cada um com **uma única razão para mudar**:

| Módulo | Responsabilidade única |
|---|---|
| `decisao_voto.js` | Decidir qual ação tomar (inserir/atualizar/remover) dado um voto existente e um voto solicitado |
| `tipos_voto.js` | Saber quais tipos de voto são válidos |
| `voto_repositorio.js` | Acesso a dados da tabela `votos` (SQL) |
| `voto_servico.js` | Orquestrar a regra de negócio: valida o tipo, pergunta a decisão, chama o repositório |

Se o SQL da tabela `votos` mudar, só `voto_repositorio.js` muda. Se a regra "clicar de novo remove o voto" mudar, só `decisao_voto.js` muda. Nenhuma dessas mudanças exige tocar nas outras três.

```js
// voto_servico.js — só orquestra, não sabe SQL nem decide sozinho a ação
registrarVoto(id_pergunta, id_usuario, tipo) {
  if (!tipoValido(tipo)) {
    throw new Error(`Tipo de voto invalido: ${tipo}`);
  }
  const votoExistente = this.votoRepositorio.buscarVotoDoUsuario(id_pergunta, id_usuario);
  const { acao } = decidirAcao(votoExistente, tipo);
  // ...
}
```

### Dependency Inversion Principle (DIP)

`VotoServico` não importa `VotoRepositorio` nem `bd_utils.js` diretamente. Ele recebe a dependência pronta no construtor:

```js
class VotoServico {
  constructor(votoRepositorio) {
    this.votoRepositorio = votoRepositorio; // depende da abstração, não da implementação concreta
  }
  ...
}
```

Quem decide qual implementação concreta usar é `server.js` (a camada mais externa), no momento da composição:

```js
const votoRepositorio = new VotoRepositorio(bd); // bd real (SQLite)
const votoServico = new VotoServico(votoRepositorio);
```

O benefício prático disso é testável e foi comprovado: `testes/voto_servico.test.js` cria um `VotoRepositorioFalso` (um array em memória, sem SQL nenhum) e injeta esse repositório falso no `VotoServico` real. A regra de negócio inteira é testada sem precisar de um banco de dados — algo que não era possível da mesma forma com o `modelo.js` original (que depende de `bd_utils.js` diretamente por `require`, conforme apontado no `ANALISE_SOLID.md`).

```js
// dentro do teste, nenhum SQLite é aberto:
const servico = new VotoServico(new VotoRepositorioFalso());
const saldo = servico.registrarVoto(1, 1, 'upvote');
expect(saldo).toBe(1);
```

### Open/Closed Principle (OCP)

A decisão de qual ação tomar está isolada em `decidirAcao`, e ela não contém nenhum `if (tipo === 'upvote')`/`else if (tipo === 'downvote')` hardcoded — ela só compara o tipo solicitado com o tipo do voto existente, seja lá qual for:

```js
function decidirAcao(votoExistente, tipoSolicitado) {
  if (!votoExistente) return { acao: 'inserir' };
  if (votoExistente.tipo === tipoSolicitado) return { acao: 'remover' };
  return { acao: 'atualizar' };
}
```

Isso significa que o sistema está **aberto para extensão**: se no futuro o fórum quisesse adicionar um terceiro tipo de reação (por exemplo, `"reportar"`), bastaria adicionar esse valor em `tipos_voto.js` — a lógica de decisão em `decisao_voto.js` e a orquestração em `voto_servico.js` **não precisariam ser modificadas**, porque já funcionam para qualquer valor de `tipo`. O sistema está **fechado para modificação** nesse ponto específico.

---

## Evidência de que o código funciona

Rodando a suíte de testes completa do projeto (testes já existentes da Parte 1 + os novos testes de votação):

```
PASS testes/listar_perguntas.test.js
PASS testes/voto_repositorio.integration.test.js
PASS testes/modelo.test.js
PASS testes/voto_servico.test.js

Test Suites: 4 passed, 4 total
Tests:       10 passed, 10 total
```

Os testes de `voto_servico.test.js` (5 testes) usam o repositório falso descrito acima. Os testes de `voto_repositorio.integration.test.js` (2 testes) rodam contra um SQLite real, confirmando que o SQL do repositório também está correto. Nenhum teste pré-existente quebrou.

O fluxo também foi validado manualmente via HTTP (servidor real rodando, requisições reais com `curl`): criar uma pergunta, dar upvote (saldo vai de 0 para 1) e clicar de novo no mesmo upvote (saldo volta para 0 — toggle off), tudo refletido corretamente tanto na resposta da rota de voto quanto na listagem `GET /`.

## O que foi adicionado em cada arquivo

- `bd/schema.sql`: nova tabela `votos` (com `unique(id_pergunta, id_usuario)`, garantindo no próprio banco que um usuário não acumula dois votos na mesma pergunta)
- `server.js`: nova rota `POST /perguntas/:id_pergunta/votos`; a rota `GET /` passou a incluir `saldo_votos` em cada pergunta
- `esmforum-react/src/pages/Pergunta.js`: botões de upvote/downvote e saldo exibidos na tabela de perguntas (usa `id_usuario` fixo em 1, seguindo a mesma convenção já usada em `cadastrar_pergunta` no backend, já que o sistema ainda não tem autenticação)
