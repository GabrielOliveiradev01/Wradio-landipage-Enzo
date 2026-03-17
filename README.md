# Wradio

Plataforma de laudos radiológicos com IA. Monorepo Turborepo + pnpm com dois aplicativos: a interface web (Next.js) e a API (Hono/Node).

---

## Estrutura do monorepo

```
wradio/
├── apps/
│   ├── web/        # Next.js 16 — interface principal
│   └── api/        # Hono — API REST (Node 24)
└── packages/
    ├── shared/     # Tipos TypeScript compartilhados (Database do Supabase)
    └── supabase/   # Configurações e migrações do Supabase
```

## Pré-requisitos

- Node 24.x
- pnpm 9.x

## Instalação

```bash
pnpm install
```

## Variáveis de ambiente

Copie `.env.local` para `apps/web/` e preencha:

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role — só server-side |
| `NEXT_PUBLIC_API_URL` | URL da API Hono (padrão: `http://localhost:3001`) |
| `UPSTASH_REDIS_REST_URL` | URL da instância Upstash Redis (opcional) |
| `UPSTASH_REDIS_REST_TOKEN` | Token da instância Upstash Redis (opcional) |

> Sem as variáveis do Redis, o app funciona normalmente — o cache de perfil é simplesmente desabilitado.

## Comandos

```bash
# Rodar tudo em paralelo (web + api)
pnpm dev

# Rodar individualmente
pnpm dev:web
pnpm dev:api

# Build de produção
pnpm build

# Lint
pnpm lint
```

A interface web sobe em `http://localhost:3000` e a API em `http://localhost:3001`.

## Deploy

A aplicação web é projetada para deploy na **Vercel**. A API pode ser hospedada em qualquer runtime Node 24 compatível com Bun/Node HTTP.
