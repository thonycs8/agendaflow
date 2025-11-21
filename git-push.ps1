# Script para fazer commit e push do projeto
# Execute este script na raiz do projeto

$ErrorActionPreference = "Stop"

# Navegar para o diretório do projeto
$projectPath = "D:\Missão Design\Programação\agendaflow"
Set-Location $projectPath

Write-Host "📁 Diretório: $projectPath" -ForegroundColor Cyan

# Verificar se já existe repositório Git
if (Test-Path ".git") {
    Write-Host "✅ Repositório Git já existe" -ForegroundColor Green
} else {
    Write-Host "🔧 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
}

# Configurar remote
Write-Host "🔗 Configurando remote..." -ForegroundColor Yellow
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin https://github.com/thonycs8/agendaflow.git

# Criar branch
Write-Host "🌿 Criando branch feat/mvp-refactor..." -ForegroundColor Yellow
git checkout -b feat/mvp-refactor -ErrorAction SilentlyContinue

# Adicionar arquivos
Write-Host "➕ Adicionando arquivos..." -ForegroundColor Yellow
git add .

# Verificar status
Write-Host "`n📊 Status:" -ForegroundColor Cyan
git status --short | Select-Object -First 20

# Fazer commit
Write-Host "`n💾 Fazendo commit..." -ForegroundColor Yellow
$commitMessage = @"
feat: MVP refactor - Backend Node.js + Express + Prisma

- Adiciona backend completo com Node.js, Express e TypeScript
- Implementa Prisma ORM com schema completo
- Cria sistema de autenticação JWT
- Adiciona endpoints: auth, orgs, locations, services, staff, appointments
- Implementa verificação de conflitos em agendamentos
- Adiciona sistema de horários e disponibilidade
- Implementa notificações (email + WhatsApp webhook)
- Adiciona billing skeleton com Stripe
- Cria job scheduler para lembretes
- Adiciona Docker e docker-compose
- Implementa testes (Jest + Cypress)
- Configura CI/CD com GitHub Actions
- Adiciona onboarding wizard no frontend
- Cria documentação completa (README_AUDIT.md, CHANGELOG_MVP.md)
"@

git commit -m $commitMessage

# Push
Write-Host "`n🚀 Fazendo push..." -ForegroundColor Yellow
git push -u origin feat/mvp-refactor

Write-Host "`n✅ Concluído! Verifique o repositório no GitHub." -ForegroundColor Green

