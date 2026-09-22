const VotoServico = require('../votos/voto_servico.js');

// Repositório falso em memória: substitui o VotoRepositorio real (que usa SQLite)
// só porque VotoServico depende de uma abstração, não da classe concreta (DIP).
class VotoRepositorioFalso {
  constructor() {
    this.votos = [];
  }

  buscarVotoDoUsuario(id_pergunta, id_usuario) {
    return this.votos.find(v => v.id_pergunta === id_pergunta && v.id_usuario === id_usuario);
  }

  inserir(id_pergunta, id_usuario, tipo) {
    this.votos.push({ id_pergunta, id_usuario, tipo });
  }

  atualizarTipo(id_pergunta, id_usuario, tipo) {
    const voto = this.buscarVotoDoUsuario(id_pergunta, id_usuario);
    voto.tipo = tipo;
  }

  remover(id_pergunta, id_usuario) {
    this.votos = this.votos.filter(v => !(v.id_pergunta === id_pergunta && v.id_usuario === id_usuario));
  }

  calcularSaldo(id_pergunta) {
    const doPergunta = this.votos.filter(v => v.id_pergunta === id_pergunta);
    const upvotes = doPergunta.filter(v => v.tipo === 'upvote').length;
    const downvotes = doPergunta.filter(v => v.tipo === 'downvote').length;
    return upvotes - downvotes;
  }
}

test('primeiro voto de um usuário é inserido e conta no saldo', () => {
  const servico = new VotoServico(new VotoRepositorioFalso());
  const saldo = servico.registrarVoto(1, 1, 'upvote');
  expect(saldo).toBe(1);
});

test('clicar de novo no mesmo tipo remove o voto (toggle off)', () => {
  const servico = new VotoServico(new VotoRepositorioFalso());
  servico.registrarVoto(1, 1, 'upvote');
  const saldo = servico.registrarVoto(1, 1, 'upvote');
  expect(saldo).toBe(0);
});

test('trocar de upvote para downvote atualiza o saldo corretamente', () => {
  const servico = new VotoServico(new VotoRepositorioFalso());
  servico.registrarVoto(1, 1, 'upvote');
  const saldo = servico.registrarVoto(1, 1, 'downvote');
  expect(saldo).toBe(-1);
});

test('tipo de voto inválido lança erro', () => {
  const servico = new VotoServico(new VotoRepositorioFalso());
  expect(() => servico.registrarVoto(1, 1, 'invalido')).toThrow();
});

test('votos de usuários diferentes na mesma pergunta se somam', () => {
  const servico = new VotoServico(new VotoRepositorioFalso());
  servico.registrarVoto(1, 1, 'upvote');
  const saldo = servico.registrarVoto(1, 2, 'downvote');
  expect(saldo).toBe(0);
});
