# AgendaFlow - SaaS de Agendamento

Sistema completo de agendamento para estabelecimentos comerciais.

## 🚀 Quick Start

### Pré-requisitos
- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)

### Rodar Localmente

1. Clone o repositório:
git clone https://github.com/thonycs8/agendaflow.git
cd agendaflow2. Configure as variáveis de ambiente:sh
cp .env.example .env
# Edite .env com suas configurações3. Inicie os serviços:ash
docker-compose up --build4. Execute as migrações:ash
docker-compose exec backend npm run prisma:migrate5. Seed do banco (opcional):sh
docker-compose exec backend npm run prisma:seed6. Acesse:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Prisma Studio: `docker-compose exec backend npm run prisma:studio`

## 📁 Estrutura do Projeto

```
agendaflow/
├── backend/          # API Node.js + Express + Prisma
├── frontend/         # React + Vite + TypeScript
├── docker-compose.yml
└── .env.example
```

## 🔧 Variáveis de Ambiente

Veja `.env.example` para lista completa.

**Obrigatórias:**
- `DATABASE_URL` - URL de conexão PostgreSQL
- `JWT_SECRET` - Secret para JWT tokens

**Opcionais (para features completas):**
- `STRIPE_SECRET_KEY` - Para billing
- `SMTP_*` - Para emails
- `TWILIO_*` - Para WhatsApp (ou use webhook)

## 🧪 Testes

### Backend
```bash
cd backend
npm test
```

### Frontend (E2E)
```bash
cd frontend
npm run cypress:open
```

## 📝 Checklist para Lançar Piloto

- [ ] Configurar variáveis de ambi
