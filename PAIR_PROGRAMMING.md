Planejamento de Pair Programming — ESM Fórum



Contexto



Este projeto é desenvolvido individualmente, portanto a prática de pair programming não pode ser aplicada de forma literal, com dois desenvolvedores reais programando juntos. No entanto, o objetivo desta tarefa é demonstrar entendimento de como a prática funcionaria caso houvesse um par disponível, adaptando os conceitos à realidade de um projeto solo.



Estratégia para aplicar pair programming



Se houvesse um segundo desenvolvedor no projeto, a estratégia seria dividir o trabalho em sessões de pair programming focadas principalmente nos momentos de maior risco técnico ou de decisão arquitetural, como:



Definição da estrutura de dados para a nova funcionalidade de votação (tabela de votos, relacionamento com perguntas e usuários).

Aplicação dos princípios SOLID e escolha do padrão de projeto na Parte 3, já que decisões de design se beneficiam de uma segunda opinião imediata.

Revisão de código antes de qualquer merge para a branch principal, mesmo em tarefas menores.



Tarefas mais mecânicas e repetitivas (como ajustes visuais no frontend ou pequenas correções) poderiam ser feitas individualmente, reservando o pair programming para os pontos que exigem mais raciocínio conjunto, o que segue a recomendação de usar essa prática de forma direcionada, não indiscriminada.



Ferramentas que seriam utilizadas



VS Code Live Share: para compartilhamento de código em tempo real, permitindo que ambos os desenvolvedores editem e vejam o mesmo arquivo simultaneamente, com cursores independentes.

Discord (chamada de voz e compartilhamento de tela): para comunicação constante durante a sessão, já que pair programming remoto depende de um canal de voz aberto durante todo o processo.

GitHub (Pull Requests e Issues): mesmo durante sessões de pair programming, o trabalho seria registrado em Issues vinculadas ao board do GitHub Projects, mantendo rastreabilidade do que foi decidido em conjunto.



Rotação de papéis (Driver e Navigator)



A prática seguiria o modelo clássico de rotação:



Driver: a pessoa responsável por efetivamente escrever o código no momento, com foco na sintaxe e na implementação imediata do que foi discutido.

Navigator: a pessoa responsável por pensar na direção geral da solução, revisar o que está sendo escrito em tempo real, identificar possíveis erros ou melhorias, e manter a visão do problema como um todo.



A troca de papéis aconteceria a cada 20 a 25 minutos (técnica de rotação por tempo), evitando que uma única pessoa fique concentrada apenas na execução ou apenas na revisão por tempo demais, o que tende a reduzir o engajamento de ambos os lados.



Adaptação para o contexto individual



Na ausência de um par real, essa prática foi parcialmente simulada com o uso de ferramentas de apoio (como assistentes de IA) para revisar decisões técnicas durante o desenvolvimento, funcionando de forma próxima ao papel de "navigator", questionando decisões e sugerindo alternativas, enquanto o desenvolvedor mantém o papel de "driver", escrevendo e decidindo o código final. Essa adaptação não substitui o valor de um segundo desenvolvedor humano, mas ajuda a manter parte do benefício da prática: reduzir a chance de erros passarem despercebidos e manter a qualidade do código sob revisão constante.

