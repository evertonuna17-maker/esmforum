// tipos_voto.js
// Única responsabilidade: saber quais tipos de voto são aceitos pelo sistema.
const TIPOS_VALIDOS = new Set(['upvote', 'downvote']);

function tipoValido(tipo) {
  return TIPOS_VALIDOS.has(tipo);
}

module.exports = { tipoValido, TIPOS_VALIDOS };
