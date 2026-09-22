create table perguntas (
  id_pergunta       integer      unique  not null  primary key  autoincrement,
  texto             text         not null,
  id_usuario        integer      not null
);
  
create table respostas (
  id_resposta       integer      unique  not null  primary key  autoincrement,
  id_pergunta       integer      not null,
  texto             text         not null
);

create table votos (
  id_voto           integer      unique  not null  primary key  autoincrement,
  id_pergunta       integer      not null,
  id_usuario        integer      not null,
  tipo              text         not null,
  unique(id_pergunta, id_usuario)
);
