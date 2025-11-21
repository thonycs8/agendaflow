# Changelog - MVP Refactor

## [Unreleased] - 2024-12-XX

### Adicionado
- Backend Node.js + Express + TypeScript completo
- Prisma ORM com schema completo
- Sistema de autenticação JWT próprio
- Onboarding wizard (5 passos)
- Sistema de horários avançado (weekly, exceptions, vacation)
- Endpoint de disponibilidade com geração de slots
- Sistema de notificações (email via Nodemailer)
- Webhook WhatsApp para integração com Zapier/Make
- Billing skeleton com Stripe
- Job scheduler para lembretes (node-cron)
- Testes unitários (Jest) para controllers
- Testes E2E (Cypress) para onboarding
- Docker e docker-compose para desenvolvimento
- CI/CD com GitHub Actions
- Seed script para dados demo
- Documentação completa

### Modificado
- Estrutura de pastas: separação backend/frontend
- Frontend adaptado para usar API REST ao invés de Supabase
- Sistema de autenticação migrado para JWT

### Removido
- Dependência direta do Supabase (mantido temporariamente para migração)

### Segurança
- Validação server-side com Zod
- Hash de senhas com bcrypt
- JWT tokens para autenticação
- CORS configurado
- Helmet para headers de segurança

### Infraestrutura
- Docker Compose com PostgreSQL, Backend e Frontend
- Prisma migrations
- GitHub Actions para CI

### Documentação
- README_AUDIT.md com análise completa
- README.md atualizado com instruções
- .env.example com todas as variáveis
- Comentários no código sobre configuração de serviços externos
```

