Escolha do Processo de Gerenciamento — ESM Fórum



Processo escolhido: Kanban



Para o gerenciamento do desenvolvimento das 5 funcionalidades solicitadas pelo cliente, foi escolhido o modelo Kanban, com um board organizado em três colunas: To Do, In Progress e Done.



Justificativa da escolha



O Kanban foi escolhido em vez do Scrum pelos seguintes motivos, considerando as características deste projeto específico:



Projeto individual, sem cerimônias de equipe: o Scrum é fortemente baseado em papéis (Product Owner, Scrum Master, equipe de desenvolvimento) e cerimônias fixas (planning, daily, review, retrospectiva). Como este é um projeto desenvolvido por uma única pessoa, essas cerimônias perderiam grande parte do seu propósito original, já que não há negociação de prioridades entre múltiplos stakeholders nem alinhamento diário entre membros de equipe.



Fluxo contínuo é mais adequado que sprints fixos: o Scrum organiza o trabalho em sprints de duração fixa (geralmente 1 a 4 semanas), com um conjunto de itens comprometidos no início de cada sprint. O Kanban, por outro lado, permite que os itens fluam continuamente pelas colunas, sendo puxados conforme a capacidade disponível. Dado que o projeto tem um prazo final único e as 5 funcionalidades têm complexidades diferentes entre si, um fluxo contínuo permite mais flexibilidade do que dividir artificialmente o trabalho em sprints.



Visualização direta do estado do trabalho: o Kanban tem como princípio central visualizar o fluxo de trabalho e limitar o trabalho em progresso (WIP). Isso é particularmente útil neste projeto porque, sendo apenas um desenvolvedor, existe um risco real de começar várias funcionalidades ao mesmo tempo sem terminar nenhuma. O quadro Kanban torna esse risco visível e facilita focar em uma funcionalidade de cada vez.



Simplicidade de adoção: o Kanban não exige a definição de papéis formais nem a estimativa de esforço em pontos de história, o que reduz o overhead de gestão para um contexto de desenvolvimento individual, sem prejudicar a organização do trabalho.



Estrutura do board



O board foi estruturado com três colunas, representando o fluxo de trabalho Kanban:



To Do: funcionalidades ainda não iniciadas.

In Progress: funcionalidade sendo desenvolvida no momento.

Done: funcionalidades já implementadas e validadas.



As 5 funcionalidades solicitadas pelo cliente foram cadastradas como cards na coluna To Do e priorizadas na seguinte ordem:



Sistema de votação em perguntas (upvote/downvote)

Busca de perguntas por palavra-chave

Categorização de perguntas por tags

Perfil de usuário com histórico de perguntas e respostas

Notificação de novas respostas às perguntas



Essa priorização reflete o valor percebido para o cliente e a complexidade técnica de cada funcionalidade: votação, busca e tags são consideradas centrais para a experiência do fórum, enquanto perfil de usuário e notificações dependem de funcionalidades auxiliares (como autenticação) que ainda não existem no sistema, sendo por isso posicionadas com prioridade mais baixa.



Link do board: https://github.com/users/evertonuna17-maker/projects/2

