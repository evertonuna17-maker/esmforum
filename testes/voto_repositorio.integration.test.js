// Teste de integração: usa o VotoRepositorio de verdade contra um SQLite real.
// Serve para confirmar que o SQL está correto (o teste de voto_servico.test.js
// já garante que a REGRA DE NEGÓCIO está correta, usando um repositório falso).
const bd = require('../bd/bd_utils.js');
const VotoRepositorio = require('../votos/voto_repositorio.js');
const VotoServico = require('../votos/voto_servico.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  bd.exec('delete from votos', []);
});

test('registrar um upvote de verdade no banco gera saldo 1', () => {
  const servico = new VotoServico(new VotoRepositorio(bd));
  const saldo = servico.registrarVoto(42, 1, 'upvote');
  expect(saldo).toBe(1);
});

test('toggle off remove a linha da tabela votos no banco real', () => {
  const repositorio = new VotoRepositorio(bd);
  const servico = new VotoServico(repositorio);
  servico.registrarVoto(42, 1, 'upvote');
  servico.registrarVoto(42, 1, 'upvote');
  const voto = repositorio.buscarVotoDoUsuario(42, 1);
  expect(voto).toBeUndefined();
});
