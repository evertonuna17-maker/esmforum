# Caso de Uso: Votar em Pergunta

Detalhamento da **História 1 (Sistema de Votação)**, escolhida entre as três histórias da Tarefa 1.

**Nome do Caso de Uso:** Votar em Pergunta

**Atores:** Usuário do fórum

**Pré-condições:**
- A pergunta a ser votada existe no banco de dados
- A listagem de perguntas está carregada na tela do usuário

**Fluxo Principal:**
1. Sistema exibe a lista de perguntas, cada uma com botões de upvote/downvote e o saldo de votos atual
2. Usuário clica no botão de upvote (ou downvote) de uma pergunta
3. Sistema (frontend) envia ao backend o id da pergunta, o id do usuário e o tipo de voto escolhido
4. Sistema (backend) verifica se já existe um voto desse usuário para essa pergunta
5. Como não existe voto anterior, sistema registra o novo voto no banco de dados
6. Sistema recalcula o saldo de votos da pergunta (upvotes − downvotes)
7. Sistema retorna o novo saldo ao frontend
8. Sistema atualiza o contador de votos exibido na tela, sem recarregar a página

**Fluxos Alternativos:**

**Fluxo Alternativo 1: Usuário já votou com o mesmo tipo (toggle off)**
4a. Sistema detecta que o usuário já possui um voto do mesmo tipo (ex.: já deu upvote e clicou em upvote de novo)
4b. Sistema remove o voto existente
4c. Retorna ao passo 6 do fluxo principal (saldo recalculado sem esse voto)

**Fluxo Alternativo 2: Usuário já votou com tipo diferente (trocar voto)**
4a. Sistema detecta que o usuário já possui um voto de tipo diferente do que foi clicado (ex.: tinha dado downvote e agora clicou em upvote)
4b. Sistema atualiza o voto existente para o novo tipo
4c. Retorna ao passo 6 do fluxo principal (saldo recalculado com o voto atualizado)

**Fluxo Alternativo 3: Falha de comunicação com o servidor**
3a. A requisição ao backend falha (erro de rede ou erro 500)
3b. Sistema mantém o saldo de votos anterior na tela (sem atualização otimista) e exibe uma mensagem de erro ao usuário
3c. Caso de uso é encerrado sem alteração no banco de dados

**Pós-condições:**
- O voto do usuário para aquela pergunta está registrado (ou removido) no banco de dados, refletindo exatamente um estado por par (usuário, pergunta): nenhum voto, upvote, ou downvote
- O saldo de votos exibido na tela corresponde ao estado atual do banco de dados
