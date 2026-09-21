Instalação e Configuração do Ambiente ESM Forum



Este documento descreve o passo a passo para configurar o ambiente de desenvolvimento do projeto ESM Forum (backend) e ESM Forum React (frontend) em uma máquina Windows.



Pré-requisitos



Git instalado

Acesso à internet para download de dependências



1\. Gerenciamento de versão do Node.js com NVM for Windows



O projeto requer uma versão específica do Node.js compatível com módulos nativos (como better-sqlite3). Para gerenciar múltiplas versões do Node no Windows, foi utilizado o NVM for Windows.



1.1. Instalação do NVM for Windows



Acesse a página de releases oficial: https://github.com/coreybutler/nvm-windows/releases

Baixe a versão estável v1.1.12, arquivo nvm-setup.exe (aproximadamente 5.5 MB)

Execute o instalador e siga os passos com as configurações padrão

Abra um novo terminal e confirme a instalação:



nvm version



Saída esperada: 1.1.12



1.2. Instalação e uso do Node.js 20



O Node.js 20 foi escolhido por ter melhor compatibilidade com dependências nativas do projeto, evitando erros de compilação do better-sqlite3 que ocorriam com versões mais recentes, como o Node 24.



nvm install 20

nvm use 20

node -v



Saída esperada: v20.20.2 (ou versão 20.x mais recente disponível)



2\. Backend  esmforum



2.1. Clonar/posicionar o repositório



O repositório foi clonado (via fork) para a pasta local do projeto, por exemplo:



C:\\Users\\usuario\\OneDrive\\Documentos\\projeto es\\esmforum



2.2. Instalar dependências



Dentro da pasta do backend:



cd "caminho\\para\\esmforum"

npm install



Nota: caso ocorra erro ao carregar o módulo better-sqlite3 (arquivo better\_sqlite3.node não encontrado) ao rodar o servidor, execute:



npm rebuild better-sqlite3



Isso força a recompilação do módulo nativo para a versão do Node em uso.



2.3. Rodar o servidor



npm start



Saída esperada: ESM Forum rodando em 5000



O backend estará disponível em http://localhost:5000.



3\. Frontend — esmforum-react



3.1. Instalar dependências



Em um novo terminal, mantendo o backend rodando:



cd "caminho\\para\\esmforum-react"

npm install



3.2. Rodar a aplicação



npm start



Isso abrirá automaticamente o navegador em http://localhost:3000, exibindo a interface do ESM Forum.



Resumo dos comandos



Verificar nvm: nvm version

Instalar Node 20: nvm install 20

Usar Node 20: nvm use 20

Instalar dependências do backend: npm install (na pasta esmforum)

Corrigir módulo nativo se necessário: npm rebuild better-sqlite3

Rodar backend: npm start (na pasta esmforum)

Instalar dependências do frontend: npm install (na pasta esmforum-react)

Rodar frontend: npm start (na pasta esmforum-react)

