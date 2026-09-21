Práticas de Extreme Programming (XP) aplicadas no projeto ESM Forum



O projeto ESM Forum é desenvolvido individualmente, portanto algumas práticas de XP, originalmente pensadas para times, precisaram ser adaptadas à realidade de um único desenvolvedor. No entanto, isso não significa abandonar os princípios da metodologia, significa apenas reinterpretá-los dentro do contexto possível.



A primeira prática aplicada foi o Planejamento Incremental. O projeto foi dividido em três partes com prazos definidos (Semana 3, Semana 6 e Semana 9), portanto cada entrega ficou menor e mais gerenciável do que tentar resolver tudo de uma vez. Dentro da Parte 2, as histórias foram priorizadas: Votação primeiro, depois Tags, depois Busca por palavra-chave, enquanto Perfil de usuário e Notificações ficaram para o final. Porém, essa priorização só se tornou visível de fato depois da criação do board no GitHub Projects, que organiza as histórias em colunas de status.



Em relação a Entregas Pequenas (Small Releases), a ideia é que cada funcionalidade seja entregue de forma independente e testável, e não acumulada até o fim do projeto. Portanto, a Votação deve ser implementada e validada isoladamente antes de se avançar para as Tags, e assim sucessivamente.



Sobre Design Simples, a prática apareceu já na fase de configuração do ambiente: ao encontrar o erro de compilação do módulo better-sqlite3, a solução escolhida foi a mais direta possível, rodar npm rebuild better-sqlite3, em vez de reestruturar o projeto ou trocar de banco de dados. No entanto, soluções simples como essa exigem atenção, pois podem mascarar problemas maiores se usadas sem entendimento do que está de fato acontecendo.



A Refatoração ainda não ocorreu de forma extensa, porém está prevista para a Parte 3 do projeto, quando os princípios SOLID e os padrões de projeto forem aplicados sobre a funcionalidade de Votação. Nesse momento, o código que já funciona deverá ser reorganizado internamente, sem alterar o comportamento visível para o usuário.



Quanto a Testes, o processo até agora foi de validação manual, verificar visualmente se o backend e o frontend estavam se comunicando corretamente ao abrir a aplicação no navegador. Porém, à medida que a Votação for implementada, testes mais estruturados (unitários, por exemplo) deverão ser incorporados, já que XP recomenda testar de forma constante e não apenas ao final.



A Integração Contínua também apareceu de forma concreta: assim que o arquivo INSTALACAO.md foi finalizado, ele foi commitado e enviado ao repositório remoto (git push), em vez de permanecer apenas na máquina local acumulando alterações. Portanto, o repositório se mantém sempre próximo do estado real do trabalho.



Já os Padrões de Código, que em um time garantem uniformidade entre diferentes desenvolvedores, no contexto individual servem para manter consistência entre o próprio código ao longo de todo o projeto, nomenclatura, indentação e organização de arquivos, por exemplo. No entanto, exige disciplina extra, já que não há um segundo desenvolvedor para apontar desvios do padrão.



Por fim, o Pair Programming, prática mais difícil de reproduzir sozinho, foi parcialmente simulado com o uso de ferramentas de apoio (como assistentes de IA) para revisar decisões técnicas e resolver problemas durante a configuração do ambiente. Porém, essa adaptação não substitui totalmente o valor de um segundo olhar humano, e por isso, sempre que possível, buscar feedback do professor ou de colegas continua sendo importante.

