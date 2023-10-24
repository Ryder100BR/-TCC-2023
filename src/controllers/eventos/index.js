const yup = require('yup');

// Defina um esquema de validação com Yup
const eventoSchema = yup.object().shape({
  id: yup.string().required('O ID do evento é obrigatório'),
  nome: yup.string().required('O nome do evento é obrigatório'),
  data: yup.date().required('A data do evento é obrigatória'),
  local: yup.string().required('O local do evento é obrigatório'),
});

// Simule uma lista de eventos (substitua isso com a sua lógica de armazenamento real)
const eventos = [];

// Controlador para adicionar um evento
const adicionarEvento = async (req, res) => {
  try {
    const { id, nome, data, local } = req.body;

    // Valide os dados do evento usando o esquema de validação
    await eventoSchema.validate({ id, nome, data, local });

    // Adicione o evento à lista (ou salve-o em seu armazenamento real)
    eventos.push({ id, nome, data, local });

    res.status(201).json({ mensagem: 'Evento adicionado com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Exemplo de uso do controlador para adicionar um evento
const req = {
  body: {
    id: '1',
    nome: 'Evento de Exemplo',
    data: '2023-09-20',
    local: 'Local de Exemplo',
  },
};


adicionarEvento(req, { status: () => {}, json: console.log });