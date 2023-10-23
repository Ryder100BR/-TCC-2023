const yup = require('yup');

// Simule uma lista de fotos (substitua isso com a sua lógica de armazenamento real)
const fotos = [];

// Defina um esquema de validação com Yup
const fotoSchema = yup.object().shape({
  id: yup.string().required('O ID da foto é obrigatório'),
  id_evento: yup.string().required('O ID do evento é obrigatório'),
  nome: yup.string().required('O nome da foto é obrigatório'),
  descricao: yup.string().required('A descrição da foto é obrigatória'),
  url: yup.string().url('A URL da foto deve ser uma URL válida').required('A URL da foto é obrigatória'),
});

// Controlador para adicionar uma foto
const adicionarFoto = async (req, res) => {
  try {
    const { id, id_evento, nome, descricao, url } = req.body;

    // Valide os dados da foto usando o esquema de validação
    await fotoSchema.validate({ id, id_evento, nome, descricao, url });

    // Adicione a foto à lista (ou salve-a em seu armazenamento real)
    fotos.push({ id, id_evento, nome, descricao, url });

    res.status(201).json({ mensagem: 'Foto adicionada com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Exemplo de uso do controlador para adicionar uma foto
const req = {
  body: {
    id: '1',
    id_evento: '1',
    nome: 'Foto do Evento',
    descricao: 'Esta é uma foto do nosso evento',
    url: 'https://example.com/foto.jpg',
  },
};

module.exports = new Fotos(); 

adicionarFoto(req, { status: () => {}, json: console.log });
