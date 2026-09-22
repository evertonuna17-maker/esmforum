# Histórias de Usuário — ESM Forum

Funcionalidades escolhidas (de acordo com as 5 solicitadas pelo cliente na Parte 1): **Sistema de Votação**, **Categorização por Tags** e **Busca por Palavra-chave**.

---

## História 1: Sistema de Votação em Perguntas

**Como** participante do fórum,
**Eu quero** sinalizar se uma pergunta é útil ou não por meio de upvote/downvote,
**Para** que as perguntas mais relevantes fiquem em evidência para quem está buscando ajuda.

**Critérios de Aceitação:**
- [ ] Cada pergunta exibe controles de upvote e downvote junto com o saldo líquido de votos
- [ ] O saldo exibido é recalculado assim que o voto é confirmado, sem necessidade de recarregar a página
- [ ] É possível substituir um voto já dado (trocar de upvote para downvote ou vice-versa)
- [ ] Não é permitido acumular mais de um voto do mesmo usuário na mesma pergunta
- [ ] Selecionar novamente o voto já ativo desfaz esse voto (comportamento de alternância)

---

## História 2: Categorização de Perguntas por Tags

**Como** usuário do fórum,
**Eu quero** associar tags a uma pergunta ao criá-la e filtrar perguntas por tag,
**Para** organizar o conteúdo do fórum por assunto e encontrar perguntas relacionadas mais facilmente.

**Critérios de Aceitação:**
- [ ] Ao criar uma pergunta, o usuário pode informar uma ou mais tags (texto livre, separadas por vírgula)
- [ ] As tags de cada pergunta são exibidas na listagem de perguntas
- [ ] O usuário pode clicar em uma tag para ver apenas as perguntas que a possuem
- [ ] Uma tag já existente é reaproveitada (não duplicada) quando usada em outra pergunta
- [ ] Uma pergunta pode ter zero, uma ou várias tags

---

## História 3: Busca de Perguntas por Palavra-chave

**Como** usuário do fórum,
**Eu quero** buscar perguntas digitando uma palavra-chave,
**Para** encontrar rapidamente perguntas sobre um assunto específico sem precisar percorrer toda a listagem.

**Critérios de Aceitação:**
- [ ] Existe um campo de busca visível na tela principal de perguntas
- [ ] Ao digitar um termo e confirmar a busca, apenas perguntas cujo texto contenha o termo são exibidas
- [ ] A busca não é sensível a maiúsculas/minúsculas
- [ ] Limpar o campo de busca volta a exibir todas as perguntas
- [ ] Uma busca sem resultados exibe uma mensagem informando que nenhuma pergunta foi encontrada

---

## Priorização

1. **Sistema de Votação** — maior valor percebido para a comunidade (identifica o conteúdo mais relevante desde já) e é a base sobre a qual as demais interações passam a fazer sentido; também é a funcionalidade escolhida para aprofundamento (caso de uso, diagramas e implementação SOLID nas próximas tarefas), então priorizá-la garante que o time entenda a fundo a regra de negócio mais crítica primeiro.
2. **Busca por Palavra-chave** — depende só do campo `texto` que já existe em `perguntas`, tem escopo pequeno e entrega valor imediato de usabilidade (achar conteúdo existente), sem exigir novas tabelas.
3. **Categorização por Tags** — maior escopo entre as três (exige nova entidade e relação N:N entre pergunta e tag), por isso vem por último: o time já terá absorvido os padrões de código das duas primeiras histórias antes de lidar com a modelagem mais complexa desta.
