# Sistema de Autenticação JWT

Este projeto implementa um sistema completo de autenticação usando JWT (JSON Web Tokens) com NestJS.

## 🚀 Funcionalidades

- ✅ Registro de usuários com senha criptografada (bcrypt)
- ✅ Login com validação de credenciais
- ✅ Autenticação JWT com expiração de 24h
- ✅ Proteção de rotas com Guards
- ✅ Decorator personalizado para acessar usuário autenticado
- ✅ Validação de dados com class-validator
- ✅ Migração do banco de dados com Prisma

## 📁 Estrutura do Módulo de Autenticação

```
src/auth/
├── auth.module.ts              # Módulo principal
├── auth.service.ts             # Lógica de negócio
├── auth.controller.ts          # Rotas da API
├── dto/
│   ├── login.dto.ts           # Validação de login
│   └── register.dto.ts        # Validação de registro
├── guards/
│   ├── jwt-auth.guard.ts      # Guard para rotas protegidas
│   └── local-auth.guard.ts    # Guard para autenticação local
├── strategies/
│   ├── jwt.strategy.ts        # Estratégia JWT
│   └── local.strategy.ts      # Estratégia local
└── decorators/
    └── current-user.decorator.ts # Decorator para usuário atual
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
JWT_SECRET=sua-chave-secreta-muito-segura-aqui
DATABASE_URL="file:./dev.db"
```

### Instalação de Dependências

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local bcryptjs @types/bcryptjs @types/passport-jwt @types/passport-local
```

### Migração do Banco

```bash
npx prisma migrate dev --name add-auth-fields
npx prisma generate
```

### Seed de Usuários

```bash
npm run seed:users
```

## 🛣️ Rotas da API

### Autenticação

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/auth/register` | Registrar novo usuário | ❌ |
| POST | `/auth/login` | Fazer login | ❌ |
| GET | `/auth/profile` | Obter perfil do usuário | ✅ |

### Usuários (Protegidas)

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/users` | Listar todos os usuários | ✅ |

## 🔐 Como Usar

### 1. Registrar um Usuário

```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456"
}
```

### 2. Fazer Login

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "joao@example.com",
    "name": "João Silva"
  }
}
```

### 3. Acessar Rotas Protegidas

```http
GET http://localhost:3000/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

## 🧪 Testes com client.http

O arquivo `client.http` está configurado com variáveis dinâmicas que capturam automaticamente o token JWT das respostas.

### Como Usar:

1. Execute a requisição de login
2. O token será automaticamente capturado na variável `@authToken`
3. As próximas requisições usarão automaticamente esse token

### Exemplo de Fluxo:

```http
### Login
# @name login
POST {{baseUrl}}/auth/login
Content-Type: {{contentType}}

{
  "email": "joao@example.com",
  "password": "123456"
}

### Token capturado automaticamente
@authToken = {{login.response.body.access_token}}

### Usar token em requisições protegidas
GET {{baseUrl}}/auth/profile
Authorization: Bearer {{authToken}}
```

## 🛡️ Proteção de Rotas

### Usando Guards

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // Protege todas as rotas do controller
export class UsersController {
  // ...
}
```

### Usando Decorator para Usuário Atual

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Get('profile')
getProfile(@CurrentUser() user) {
  return this.authService.getProfile(user.id);
}
```

## 🔒 Segurança

- Senhas são criptografadas com bcrypt (salt rounds: 10)
- Tokens JWT expiram em 24 horas
- Validação de dados com class-validator
- Verificação de usuário ativo
- Proteção contra usuários duplicados

## 🚀 Executando o Projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📝 Logs

O sistema inclui logs detalhados para debug:
- Validação de usuário
- Geração de tokens JWT
- Validação de payload JWT

## 🔧 Personalização

### Alterar Tempo de Expiração do Token

Em `src/auth/auth.module.ts`:

```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET || 'sua-chave-secreta-aqui',
  signOptions: { expiresIn: '7d' }, // 7 dias
}),
```

### Adicionar Novos Campos ao Usuário

1. Atualizar o schema do Prisma
2. Criar nova migração
3. Atualizar os tipos TypeScript
4. Atualizar DTOs se necessário
