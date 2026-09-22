// voto_servico.js
// Única responsabilidade: a regra de negócio do voto (o que fazer diante de um clique).
// Não sabe nada de SQL, não sabe nada de HTTP.
const { decidirAcao } = require('./decisao_voto.js');
const { tipoValido } = require('./tipos_voto.js');

class VotoServico {
  // Recebe o repositório por injeção de dependência: depende da abstração
  // "algo que sabe buscar/inserir/atualizar/remover voto e calcular saldo",
  // não de VotoRepositorio especificamente. Qualquer objeto com essa forma serve,
  // inclusive um repositório falso em memória usado em teste.
  constructor(votoRepositorio) {
    this.votoRepositorio = votoRepositorio;
  }

  registrarVoto(id_pergunta, id_usuario, tipo) {
    if (!tipoValido(tipo)) {
      throw new Error(`Tipo de voto invalido: ${tipo}`);
    }

    const votoExistente = this.votoRepositorio.buscarVotoDoUsuario(id_pergunta, id_usuario);
    const { acao } = decidirAcao(votoExistente, tipo);

    if (acao === 'inserir') {
      this.votoRepositorio.inserir(id_pergunta, id_usuario, tipo);
    } else if (acao === 'atualizar') {
      this.votoRepositorio.atualizarTipo(id_pergunta, id_usuario, tipo);
    } else if (acao === 'remover') {
      this.votoRepositorio.remover(id_pergunta, id_usuario);
    }

    return this.votoRepositorio.calcularSaldo(id_pergunta);
  }
}

module.exports = VotoServico;
