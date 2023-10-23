const yup = require('yup');

// Simule uma lista de convites (substitua isso com a sua lógica de armazenamento real)
const convites = [];

// Defina um esquema de validação com Yup
const conviteSchema = yup.object().shape({
  id: yup.string().required('O ID do convite é obrigatório'),
  id_aluno: yup.string().required('O ID do aluno é obrigatório'),
  id_evento: yup.string().required('O ID do evento é obrigatório'),
  situacao: yup.string().required('A situação do convite é obrigatória'),
  unique_idx_aluno_evento: yup
    .string()
    .test('unique_idx_aluno_evento', 'Este convite já existe para o aluno e evento especificados', function (value) {
      // Verifique se o valor do índice único já existe na lista de convites
      const [idAluno, idEvento] = value.split(',');

      const exists = convites.some((convite) => {
        const [conviteIdAluno, conviteIdEvento] = convite.unique_idx_aluno_evento.split(',');
        return conviteIdAluno === idAluno && conviteIdEvento === idEvento;
      });

      return !exists;
    }),
});

// Controlador para adicionar um convite
const adicionarConvite = async (req, res) => {
  try {
    const { id, id_aluno, id_evento, situacao, unique_idx_aluno_evento } = req.body;

    // Valide os dados do convite usando o esquema de validação
    await conviteSchema.validate({ id, id_aluno, id_evento, situacao, unique_idx_aluno_evento });

    // Adicione o convite à lista (ou salve-o em seu armazenamento real)
    convites.push({ id, id_aluno, id_evento, situacao, unique_idx_aluno_evento });

    res.status(201).json({ mensagem: 'Convite adicionado com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Exemplo de uso do controlador para adicionar um convite
const req = {
  body: {
    id: '1',
    id_aluno: '1',
    id_evento: '1',
    situacao: 'Pendente',
    unique_idx_aluno_evento: '1,1',
  },
}

module.exports = new Convites();

adicionarConvite(req, { status: () => {}, json: console.log });