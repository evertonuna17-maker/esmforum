# Proposta de Organização Arquitetural

## a) Proposta de Separação em Camadas

### Camada de Apresentação (rotas da API)

**O que fica aqui:** só a tradução entre HTTP e o resto do sistema — ler `req.params`/`req.body`, chamar a camada de negócio, e devolver a resposta com o código HTTP certo (200, 404, 500). Nenhuma regra de negócio deveria estar aqui: hoje o próprio `server.js` já viola um pouco isso (ex.: monta o corpo da resposta de `GET /` chamando `votoRepositorio.calcularSaldo` diretamente, como identificado no `ARQUITETURA.md`).

**Responsabilidades específicas:**
- Extrair parâmetros da requisição e validar formato básico (ex.: `id_pergunta` é um número?)
- Chamar exatamente uma operação da camada de negócio por requisição
- Traduzir o resultado (ou o erro) em uma resposta HTTP

**Exemplo de módulos:** `PerguntaController`, `VotoController` (ver proposta de MVC abaixo)

**Como se comunica com as outras camadas:** só conhece a camada de Negócio (nunca deveria chamar a camada de Dados diretamente — esse é justamente o ponto a corrigir em relação ao código atual)

### Camada de Negócio (lógica de aplicação)

**O que fica aqui:** as regras do domínio — o que significa "votar em uma pergunta" (`VotoServico`), o que significa "cadastrar uma pergunta" (`modelo.js`). Não sabe nada de HTTP (não vê `req`/`res`) nem de SQL.

**Responsabilidades específicas:**
- Validar regras de negócio (ex.: tipo de voto válido, texto de pergunta não vazio)
- Decidir o fluxo de uma operação (ex.: a decisão inserir/atualizar/remover voto em `decidirAcao`)
- Orquestrar chamadas à camada de Dados quando uma operação envolve mais de uma tabela

**Exemplo de módulos:** `modelo.js`, `voto_servico.js`, `decisao_voto.js`, `tipos_voto.js`

**Como se comunica com as outras camadas:** recebe chamadas da Apresentação; depende apenas de abstrações da camada de Dados (como já acontece com `VotoServico`, que recebe o repositório por injeção — DIP)

### Camada de Dados (acesso ao banco)

**O que fica aqui:** exclusivamente SQL e a conversão entre linhas do banco e objetos simples. Não decide nada — só executa o que a camada de Negócio pediu.

**Responsabilidades específicas:**
- Montar e executar consultas SQL
- Devolver dados "crus" (sem regra de negócio aplicada)

**Exemplo de módulos:** `bd_utils.js`, `voto_repositorio.js`

**Como seria estruturado:** um repositório por entidade principal (`PerguntaRepositorio`, `RespostaRepositorio`, `VotoRepositorio`), todos dependendo apenas da abstração de conexão exposta por `bd_utils.js` — assim, uma futura troca de SQLite por outro banco afetaria só essa camada.

---

## b) Proposta de Aplicação do Padrão MVC

Aplicado a **2 funcionalidades**: Perguntas (existente) e Votação (implementada na Iteração 1). Como o ESM Forum é uma API que responde JSON (não uma aplicação com views HTML no servidor), a "View" aqui é adaptada para significar **o formatador da resposta JSON**, não uma página renderizada.

**Diagrama:** `diagramas/mvc_proposto.svg` / `.mmd`

### Models

- **Pergunta / Resposta:** encapsulariam os dados e as regras já existentes em `modelo.js` (`cadastrar_pergunta`, `get_pergunta`, `get_respostas`), mas como uma classe com estado, em vez de funções soltas sobre uma variável `bd` global
- **Voto:** o `VotoServico` e o `VotoRepositorio` já criados na Iteração 1 assumem esse papel — o Model já nasceu na forma proposta aqui, incluindo a operação `registrarVoto` e o cálculo de `calcularSaldo`

### Views

- **PerguntaViewFormatter:** decide como uma `Pergunta` (e sua lista) vira JSON — por exemplo, incluir ou não `saldo_votos` e `tags` dependendo do endpoint, formatar datas, esconder campos internos
- **VotoViewFormatter:** formata a resposta de `POST /perguntas/:id/votos` (hoje é só `{ saldo }`, mas poderia crescer para incluir `{ saldo, meu_voto_atual }` sem que o Controller ou o Model precisem mudar)

### Controllers

- **PerguntaController:** contém a lógica de controle das rotas `GET /`, `POST /perguntas`, `GET /respostas/:id_pergunta`, `POST /respostas` — hoje espalhada como funções anônimas dentro de `server.js`. O controller chama o Model, recebe o resultado, passa para a View correspondente formatar, e devolve a resposta
- **VotoController:** contém a lógica de controle da rota `POST /perguntas/:id_pergunta/votos` — chama `VotoServico.registrarVoto`, passa o resultado para `VotoViewFormatter`, devolve a resposta

### Exemplo de fluxo completo (requisição → resposta)

Para `POST /perguntas/:id_pergunta/votos`:

1. `server.js` recebe a requisição e repassa para `VotoController.votar(req, res)`
2. `VotoController` extrai `id_pergunta`, `id_usuario`, `tipo` do `req` e chama `VotoServico.registrarVoto(id_pergunta, id_usuario, tipo)` (Model)
3. `VotoServico` aplica a regra de negócio (já implementada na Iteração 1) e devolve o saldo atualizado
4. `VotoController` passa esse saldo para `VotoViewFormatter.formatarRespostaVoto(saldo)` (View), que devolve o objeto pronto para virar JSON
5. `VotoController` chama `res.json(...)` com o resultado formatado

```js
// controllers/voto_controller.js
class VotoController {
  constructor(votoServico, votoViewFormatter) {
    this.votoServico = votoServico;
    this.votoViewFormatter = votoViewFormatter;
  }

  votar(req, res) {
    try {
      const { id_pergunta } = req.params;
      const { id_usuario, tipo } = req.body;
      const saldo = this.votoServico.registrarVoto(id_pergunta, id_usuario, tipo);
      res.json(this.votoViewFormatter.formatarRespostaVoto(saldo));
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  }
}

// views/voto_view_formatter.js
class VotoViewFormatter {
  formatarRespostaVoto(saldo) {
    return { saldo };
  }
}

// server.js (composição)
const votoController = new VotoController(votoServico, new VotoViewFormatter());
app.post('/perguntas/:id_pergunta/votos', (req, res) => votoController.votar(req, res));
```
