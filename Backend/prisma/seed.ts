import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  const leilaExiste = await prisma.usuario.findUnique({
    where: { email: 'leila@email.com' },
  });

  if (leilaExiste) {
    console.log('A Leila já existe');
  } else {
    const senhaEncriptada = await bcrypt.hash('leila123', 10);

    const leila = await prisma.usuario.create({
      data: {
        nome: 'Leila',
        email: 'leila@email.com',
        senha: senhaEncriptada,
        telefone: '11987654321', 
        tipo: 'PROFISSIONAL',
      },
    });

    console.log('Profissional Leila criada:', leila);
  }

  const clienteExistente = await prisma.usuario.findUnique({
    where: { email: 'cliente@email.com' },
  });

  if (!clienteExistente) {
    const senhaClienteEncriptada = await bcrypt.hash('cliente123', 10);

    const cliente = await prisma.usuario.create({
      data: {
        nome: 'João Silva',
        email: 'cliente@email.com',
        senha: senhaClienteEncriptada,
        telefone: '11987654322', 
        tipo: 'CLIENTE',
      },
    });

    console.log('Cliente João Silva criado:', cliente);
  }

  const servicos = [
    { nome: 'Corte de Cabelo', duracao: 1 },
    { nome: 'Luzes', duracao: 3 },
    { nome: 'Manicure', duracao: 1 },
    { nome: 'Pedicure', duracao: 1 },
  ];

  for (const servico of servicos) {
    const novoServico = await prisma.servico.create({
      data: {
        nome: servico.nome,
        horas: servico.duracao,
      },
    });
    console.log('Serviço criado:', novoServico);
    
  }
}

seed()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
