# ⚠️ Configuração Obrigatória na Netlify

O build está falhando porque o **Package directory** está apontando para `apps/api` em vez de `apps/web`.

## Correção necessária (1 minuto)

1. Acesse **Netlify** → seu site → **Site configuration**
2. Vá em **Build & deploy** → **Build settings**
3. Clique em **Edit settings** ou **Configure** (ao lado de "Build settings")
4. Encontre o campo **"Package directory"** (ou "Root directory")
5. **Altere de `apps/api` para `apps/web`**
6. Salve (**Save**)
7. Dispare um novo deploy

## Por quê?

| Diretório  | O que é                    | Deployar na Netlify?      |
|-----------|----------------------------|---------------------------|
| `apps/web`| Next.js (interface)        | ✅ Sim                    |
| `apps/api`| API Hono (backend)         | ❌ Não (use Railway etc.) |
