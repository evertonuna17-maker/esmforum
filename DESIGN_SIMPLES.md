\# Análise de Design Simples (YAGNI) — ESM Fórum



\## Observação sobre a estrutura do código



O enunciado desta tarefa menciona os arquivos routes/perguntas.js e routes/respostas.js. No entanto, ao inspecionar o repositório real (fork de esmforum, base mtov/esmforum), constatou-se que essa versão do projeto não separa as rotas em arquivos próprios: toda a definição de rotas esta centralizada em server.js, enquanto a logica de acesso a dados esta isolada em modelo.js. Esta analise foi, portanto, realizada sobre esses dois arquivos, que são o equivalente funcional real do que o enunciado descreve.



\## Aspectos que já seguem Design Simples (YAGNI)



\### 1. Funções pequenas e de responsabilidade única



Cada função do modelo.js faz exatamente uma coisa, sem tentar prever casos de uso futuros que ainda nao existem:



function get\_pergunta(id\_pergunta) {

&#x20; return bd.query('select \* from perguntas where id\_pergunta = ?', \[id\_pergunta]);

}



function get\_respostas(id\_pergunta) {

&#x20; return bd.queryAll('select \* from respostas where id\_pergunta = ?', \[id\_pergunta]);

}



Não ha tentativa de generalizar essas funções em um método único e configurável (por exemplo, um get(tabela, filtros) genérico), o que seria over-engineering para as necessidades atuais do sistema.



\### 2. Ausência de camada de ORM



O acesso ao banco e feito com SQL direto via bd.query e bd.exec, sem introduzir um ORM completo (como Sequelize ou Prisma). Para um sistema pequeno e didático como o ESM Fórum, um ORM adicionaria complexidade e dependencias sem beneficio proporcional no momento, YAGNI aplicado corretamente.



\### 3. Mecanismo simples para testes, sem framework de injeção de dependência



var bd = require('./bd/bd\_utils.js');



function reconfig\_bd(mock\_bd) {

&#x20; bd = mock\_bd;

}



Em vez de estruturar um sistema de injeção de dependência (containers, interfaces formais, etc.), o projeto resolve a necessidade de testar com um banco "mockado" da forma mais simples possível: substituindo a variável bd diretamente. Isso atende a necessidade real (testabilidade) sem complexidade desnecessária.



\### 4. Sem validacao prematura de entrada



Nenhuma das funcoes de cadastro (cadastrar\_pergunta, cadastrar\_resposta) valida o conteudo do texto (tamanho minimo, caracteres proibidos, etc.). Embora isso possa parecer uma lacuna, tambem e uma aplicacao de YAGNI: regras de validacao so devem ser adicionadas quando houver uma necessidade real e especificada, nao de forma especulativa.



\## Oportunidades de simplificacao identificadas



\### 1. Duplicacao de tratamento de erro em server.js



As quatro rotas de server.js repetem a mesma estrutura de try/catch:



app.get('/', (req, res) => {

&#x20; try {

&#x20;   const perguntas = modelo.listar\_perguntas();

&#x20;   res.render('index', { perguntas: perguntas });

&#x20; }

&#x20; catch(erro) {

&#x20;   res.status(500).json(erro.message);

&#x20; }

});



Esse padrao se repete de forma identica em app.post('/perguntas'), app.get('/respostas') e app.post('/respostas'). Isso nao e um caso de over-engineering, mas sim uma duplicacao que poderia ser resolvida com um middleware de tratamento de erros do proprio Express, reduzindo repeticao sem adicionar complexidade.



Nota: o trecho abaixo NAO existe no codigo atual do projeto. E apenas uma sugestao de como essa duplicacao poderia ser resolvida, caso o time decida refatorar esse ponto futuramente:



app.use((erro, req, res, next) => {

&#x20; res.status(500).json(erro.message);

});



\### 2. Possivel ineficiencia em listar\_perguntas



function listar\_perguntas() {

&#x20; const perguntas = bd.queryAll('select \* from perguntas', \[]);

&#x20; perguntas.forEach(pergunta => pergunta\['num\_respostas'] = get\_num\_respostas(pergunta\['id\_pergunta']));

&#x20; return perguntas;

}



Para cada pergunta retornada, uma nova consulta ao banco e disparada (get\_num\_respostas), gerando um problema classico de N+1 queries. Para o volume de dados atual do projeto (didatico, poucas perguntas), isso nao chega a ser um problema real, e por isso, resolver isso agora seria antecipar uma otimizacao que ainda nao e necessaria (o oposto de YAGNI seria "otimizar prematuramente"). Fica registrado como ponto de atencao caso o volume de perguntas cresca significativamente no futuro.



\### 3. Valor fixo em cadastrar\_pergunta



function cadastrar\_pergunta(texto) {

&#x20; const params = \[texto, 1];

&#x20; const result = bd.exec('INSERT INTO perguntas (texto, id\_usuario) VALUES(?, ?) RETURNING id\_pergunta', params);

&#x20; return result.lastInsertRowid;

}



O id\_usuario esta fixado em 1, ja que o sistema ainda nao implementa autenticacao de usuarios. Isso e coerente com YAGNI (nao implementar autenticacao antes de ser necessario), mas e importante documentar essa limitacao, pois qualquer nova funcionalidade que dependa de usuarios reais (como a futura funcionalidade de perfil de usuario) precisara revisitar esse ponto.



\## Conclusao



O codigo do ESM Forum demonstra boa aderencia ao principio YAGNI: as funcoes sao simples, diretas, sem abstracoes especulativas ou generalizacoes desnecessarias. As oportunidades de simplificacao identificadas (duplicacao de tratamento de erro, N+1 queries) sao, em sua maioria, casos de duplicacao a resolver, nao casos de complexidade excessiva a remover, o que reforca que o design atual esta alinhado com os principios de simplicidade do XP.

