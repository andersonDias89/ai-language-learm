import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log('🌱 Iniciando seed de usuários...');

    const users = [
      {
        email: 'joao.silva@email.com',
        name: 'João Silva',
      },
      {
        email: 'maria.santos@email.com',
        name: 'Maria Santos',
      },
      {
        email: 'pedro.oliveira@email.com',
        name: 'Pedro Oliveira',
      },
      {
        email: 'ana.costa@email.com',
        name: 'Ana Costa',
      },
      {
        email: 'carlos.ferreira@email.com',
        name: 'Carlos Ferreira',
      },
    ];

    for (const userData of users) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = await prisma.user.create({
          data: userData,
        });
        console.log(`✅ Usuário criado: ${user.name} (${user.email})`);
      } else {
        console.log(`⚠️  Usuário já existe: ${userData.name} (${userData.email})`);
      }
    }

    console.log('🎉 Seed de usuários concluído!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
