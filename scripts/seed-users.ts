import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log('🌱 Iniciando seed de usuários...');

    const users = [
      {
        email: 'joao.silva@email.com',
        name: 'João Silva',
        password: '123456',
      },
      {
        email: 'maria.santos@email.com',
        name: 'Maria Santos',
        password: '123456',
      },
      {
        email: 'pedro.oliveira@email.com',
        name: 'Pedro Oliveira',
        password: '123456',
      },
      {
        email: 'ana.costa@email.com',
        name: 'Ana Costa',
        password: '123456',
      },
      {
        email: 'carlos.ferreira@email.com',
        name: 'Carlos Ferreira',
        password: '123456',
      },
    ];

    for (const userData of users) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const user = await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
          },
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
