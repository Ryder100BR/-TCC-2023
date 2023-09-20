const yup = require('yup');

// Simule uma lista de pagamentos (substitua isso com a sua lógica de armazenamento real)
const pagamentos = [];

// Defina um esquema de validação com Yup
const pagamentoSchema = yup.object().shape({
  id: yup.string().required('O ID do pagamento é obrigatório'),
  id_aluno: yup.string().required('O ID do aluno é obrigatório'),
  id_evento: yup.string().required('O ID do evento é obrigatório'),
  data_vencimento: yup.date().required('A data de vencimento é obrigatória'),
  forma_pagamento: yup
    .string()
    .oneOf(['cartao_credito', 'transferencia_bancaria'], 'Forma de pagamento inválida')
    .required('A forma de pagamento é obrigatória'),
  numero_cartao: yup.string().when('forma_pagamento', {
    is: 'cartao_credito',
    then: yup.string().required('O número do cartão de crédito é obrigatório'),
  }),
  data_expiracao_cartao: yup.date().when('forma_pagamento', {
    is: 'cartao_credito',
    then: yup.date().required('A data de expiração do cartão de crédito é obrigatória'),
  }),
  codigo_seguranca_cartao: yup.string().when('forma_pagamento', {
    is: 'cartao_credito',
    then: yup.string().required('O código de segurança do cartão de crédito é obrigatório'),
  }),
  numero_conta_bancaria: yup.string().when('forma_pagamento', {
    is: 'transferencia_bancaria',
    then: yup.string().required('O número da conta bancária é obrigatório'),
  }),
  nome_titular_conta_bancaria: yup.string().when('forma_pagamento', {
    is: 'transferencia_bancaria',
    then: yup.string().required('O nome do titular da conta bancária é obrigatório'),
  }),
  cpf_titular_conta_bancaria: yup.string().when('forma_pagamento', {
    is: 'transferencia_bancaria',
    then: yup.string().required('O CPF do titular da conta bancária é obrigatório'),
  }),
  nome_banco: yup.string().when('forma_pagamento', {
    is: 'transferencia_bancaria',
    then: yup.string().required('O nome do banco é obrigatório'),
  }),
  agencia_bancaria: yup.string().when('forma_pagamento', {
    is: 'transferencia_bancaria',
    then: yup.string().required('A agência bancária é obrigatória'),
  }),
  unique_idx_aluno_evento: yup
    .string()
    .test('unique_idx_aluno_evento', 'Este pagamento já existe para o aluno e evento especificados', function (value) {
      // Verifique se o valor do índice único já existe na lista de pagamentos
      const [idAluno, idEvento] = value.split(',');

      const exists = pagamentos.some((pagamento) => {
        const [pagamentoIdAluno, pagamentoIdEvento] = pagamento.unique_idx_aluno_evento.split(',');
        return pagamentoIdAluno === idAluno && pagamentoIdEvento === idEvento;
      });

      return !exists;
    }),
});

// Controlador para adicionar um pagamento
const adicionarPagamento = async (req, res) => {
  try {
    const {
      id,
      id_aluno,
      id_evento,
      data_vencimento,
      forma_pagamento,
      numero_cartao,
      data_expiracao_cartao,
      codigo_seguranca_cartao,
      numero_conta_bancaria,
      nome_titular_conta_bancaria,
      cpf_titular_conta_bancaria,
      nome_banco,
      agencia_bancaria,
      unique_idx_aluno_evento,
    } = req.body;

    // Valide os dados do pagamento usando o esquema de validação
    await pagamentoSchema.validate({
      id,
      id_aluno,
      id_evento,
      data_vencimento,
      forma_pagamento,
      numero_cartao,
      data_expiracao_cartao,
      codigo_seguranca_cartao,
      numero_conta_bancaria,
      nome_titular_conta_bancaria,
      cpf_titular_conta_bancaria,
      nome_banco,
      agencia_bancaria,
      unique_idx_aluno_evento,
    });

    // Adicione o pagamento à lista (ou salve-o em seu armazenamento real)
    pagamentos.push({
      id,
      id_aluno,
      id_evento,
      data_vencimento,
      forma_pagamento,
      numero_cartao,
      data_expiracao_cartao,
      codigo_seguranca_cartao,
      numero_conta_bancaria,
      nome_titular_conta_bancaria,
      cpf_titular_conta_bancaria,
      nome_banco,
      agencia_bancaria,
      unique_idx_aluno_evento,
      valor: 'R$45.99', // Valor fixo
    });

    res.status(201).json({ mensagem: 'Pagamento adicionado com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: error.message }); 
  }
};

const req = {
  body: {
    id: '1',
    id_aluno: '1',
    id_evento: '1',
    data_vencimento: '2023-09-30',
    forma_pagamento: 'cartao_credito',
    numero_cartao: '1234 5678 9012 3456',
    data_expiracao_cartao: '12/25',
    codigo_seguranca_cartao: '123',
    numero_conta_bancaria: '1234567890',
    nome_titular_conta_bancaria: 'Nome Titular',
    cpf_titular_conta_bancaria: '123.456.789-01',
    nome_banco: 'Banco XYZ',
    agencia_bancaria: '1234',
    unique_idx_aluno_evento: '1,1',
  },
};

adicionarPagamento(req, { status: () => {}, json: console.log });


