// voto_repositorio.js
// Única responsabilidade: acesso a dados da tabela "votos".
// Não decide regra de negócio nenhuma (não decide se deve inserir, atualizar ou remover);
// apenas executa a operação que for pedida.
class VotoRepositorio {
  // Recebe "bd" no construtor em vez de importar bd_utils.js diretamente:
  // depende de uma abstração (qualquer objeto com query/queryAll/exec),
  // não de uma implementação concreta específica. Isso é Dependency Inversion.
  constructor(bd) {
    this.bd = bd;
  }

  buscarVotoDoUsuario(id_pergunta, id_usuario) {
    return this.bd.query(
      'select * from votos where id_pergunta = ? and id_usuario = ?',
      [id_pergunta, id_usuario]
    );
  }

  inserir(id_pergunta, id_usuario, tipo) {
    return this.bd.exec(
      'insert into votos (id_pergunta, id_usuario, tipo) values (?, ?, ?)',
      [id_pergunta, id_usuario, tipo]
    );
  }

  atualizarTipo(id_pergunta, id_usuario, tipo) {
    return this.bd.exec(
      'update votos set tipo = ? where id_pergunta = ? and id_usuario = ?',
      [tipo, id_pergunta, id_usuario]
    );
  }

  remover(id_pergunta, id_usuario) {
    return this.bd.exec(
      'delete from votos where id_pergunta = ? and id_usuario = ?',
      [id_pergunta, id_usuario]
    );
  }

  calcularSaldo(id_pergunta) {
    const upvotes = this.bd.query(
      "select count(*) as total from votos where id_pergunta = ? and tipo = 'upvote'",
      [id_pergunta]
    ).total;
    const downvotes = this.bd.query(
      "select count(*) as total from votos where id_pergunta = ? and tipo = 'downvote'",
      [id_pergunta]
    ).total;
    return upvotes - downvotes;
  }
}

module.exports = VotoRepositorio;
