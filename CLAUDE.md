# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Rodar tudo (web + api)
pnpm dev

# Rodar individualmente
pnpm dev:web
pnpm dev:api

# Build de produção
pnpm build

# Lint
pnpm lint
```

No test suite is configured.

## Architecture

Monorepo **Turborepo + pnpm** com dois apps e dois packages:

- `apps/web` — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- `apps/api` — Hono 4 sobre Node 24, API REST para operações autenticadas
- `packages/shared` — tipos TypeScript gerados pelo Supabase (`Database`)
- `packages/supabase` — configurações e migrações do banco

### Route Groups (`apps/web/app/`)

| Grupo | Rotas | Propósito |
|---|---|---|
| `(site)` | `/home` | Landing page pública |
| `(auth)` | `/login`, `/register` | Autenticação via Supabase |
| `(onboarding)` | `/welcome`, `/steps` | Fluxo pós-cadastro |
| `(dashboard)` | `/dashboard/**` | App principal |

A raiz `app/page.tsx` redireciona para `/home`.

### Next.js Route Handlers (`apps/web/app/api/`)

| Rota | Método | Descrição |
|---|---|---|
| `/api/auth/register` | `POST` | Cria usuário via Admin SDK (sem confirmação de e-mail) |
| `/api/auth/logout` | `POST` | Encerra sessão e redireciona para `/login` |
| `/api/auth/me` | `GET` | Retorna usuário + perfil autenticado |
| `/api/profile/invalidate-cache` | `POST` | Invalida o cache Redis do perfil do usuário |

### Hono API (`apps/api/src/`)

Todas as rotas sob `/api/*` exigem JWT no header `Authorization: Bearer <token>`.

| Rota | Método | Descrição |
|---|---|---|
| `/api/users/me` | `GET` | Retorna perfil do usuário autenticado |
| `/api/users/me` | `PATCH` | Atualiza `full_name`, `crm`, `specialty`, `avatar_url` |
| `/health` | `GET` | Health check |

### Key Patterns

- **`cn()` utility** — Todo `className` usa `cn()` de `lib/utils.ts` (clsx + tailwind-merge).
- **State management** — Apenas React Context: `UserProfileContext` (nome + avatar do usuário) e `DarkModeContext` (tema). Sem Zustand/Redux.
- **Localization** — Strings de UI em `locales/pt-br.ts` via helpers em `lib/i18n.ts`. App 100% em pt-BR.
- **SEO** — Config centralizada em `config/seo.config.ts`. Páginas usam `generateMetadata` ou `metadata` estático.
- **Service layer** — `lib/services/uploadService.ts` tem stubs prontos para integração futura com a API.
- **Settings page** — Layout em abas; cada aba é um componente em `app/(dashboard)/dashboard/settings/_components/`.

### Dashboard Layout (Server + Client split)

O layout do dashboard (`app/(dashboard)/layout.tsx`) é um **Server Component** que busca o perfil do usuário antes de renderizar — eliminando o flash de "?" na TopBar.

Fluxo de dados:
```
DashboardLayout (Server Component)
  → getCachedProfile(userId)   ← Redis (~5ms) ou Supabase (~300ms)
  → passa initialFullName + initialAvatarUrl
DashboardShell (Client Component)   ← app/(dashboard)/_components/DashboardShell.tsx
  → UserProfileProvider(initialFullName, initialAvatarUrl)
  → TopBar, Sidebar, children
```

O cache Redis tem TTL de 1 hora. Ao salvar o perfil no settings, `ContaTab` chama `POST /api/profile/invalidate-cache` para forçar refresh no próximo carregamento.

### Redis Cache (Upstash)

- `lib/redis.ts` — cliente singleton; desabilitado se `UPSTASH_REDIS_REST_URL` não estiver definido
- `lib/profile-cache.ts` — `getCachedProfile`, `setCachedProfile`, `invalidateCachedProfile`
- Chave: `profile:{userId}` — TTL 1 hora
- Fallback silencioso: se Redis estiver indisponível, o app busca direto no Supabase

### Supabase

- `lib/supabase/client.ts` — cliente browser (`@supabase/ssr`)
- `lib/supabase/server.ts` — cliente server-side via cookies (`@supabase/ssr`)
- `lib/supabase/admin.ts` — cliente admin com `service_role` (só server-side)
- Os tipos gerados ficam em `packages/shared/src/` — rodar `supabase gen types` após migrações

### Styling

Tailwind CSS v4 com variáveis CSS customizadas em `app/globals.css`. Cor primária da marca: laranja (`#f97316`). Dark mode gerenciado pelo `DarkModeContext` via className no elemento raiz (client-side only).
