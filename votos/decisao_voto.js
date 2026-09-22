// decisao_voto.js
// Função pura que decide qual ação tomar diante de um voto existente (ou não).
// Não conhece banco de dados, não conhece HTTP: só recebe dados e devolve uma decisão.
// Funciona para QUALQUER valor de tipo (upvote, downvote, ou um tipo novo que venha
// a existir no futuro) sem precisar ser alterada — é o que sustenta o OCP aqui.
function decidirAcao(votoExistente, tipoSolicitado) {
  if (!votoExistente) {
    return { acao: 'inserir' };
  }
  if (votoExistente.tipo === tipoSolicitado) {
    return { acao: 'remover' }; // clicou de novo no mesmo voto: toggle off
  }
  return { acao: 'atualizar' }; // trocou de tipo de voto
}

module.exports = { decidirAcao };
