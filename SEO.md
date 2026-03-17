# 🚀 Configuração de SEO - Wradio

Guia completo de SEO implementado no projeto.

---

## 📁 Estrutura de Arquivos

```
├── config/
│   └── seo.config.ts              # ⚙️ Configuração centralizada de SEO
├── app/
│   ├── layout.tsx                 # 🎨 Layout raiz com metadata e structured data
│   ├── sitemap.ts                 # 🗺️ Sitemap dinâmico
│   └── robots.ts                  # 🤖 Robots.txt
├── public/
│   ├── manifest.json              # 📱 PWA manifest
│   ├── SEO-ASSETS-GUIDE.md       # 📸 Guia de assets (favicons, OG image)
│   └── og-image-template.html     # 🎨 Template para gerar OG image
└── .env.example                   # 🔐 Variáveis de ambiente
```

---

## ⚡ Quick Start

### 1. Adicionar SEO em Nova Página

```typescript
// app/sua-pagina/page.tsx
import { Metadata } from "next";
import { createPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = createPageMetadata({
  title: "Título da Página",
  description: "Descrição (150-160 caracteres)",
  path: "/sua-pagina",
  keywords: ["palavra1", "palavra2"],
});

export default function SuaPagina() {
  return <div>Conteúdo</div>;
}
```

### 2. Adicionar Rota ao Sitemap

```typescript
// app/sitemap.ts
const routes = [
  // ... rotas existentes
  {
    url: `${SITE_URL}/nova-pagina`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
];
```

### 3. Adicionar Schema.org Customizado

```typescript
export default function ProdutoPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Nome do Produto",
    description: "Descrição",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Conteúdo */}
    </>
  );
}
```

---

## 🔧 Configuração Inicial

### 1. Adicionar Imagens (IMPORTANTE!)

Veja instruções detalhadas em: **`public/SEO-ASSETS-GUIDE.md`**

Adicione em `/public/`:
```
favicon.ico           → 32x32px
icon-16x16.png        → 16x16px
icon-32x32.png        → 32x32px
apple-touch-icon.png  → 180x180px
icon-192x192.png      → 192x192px (PWA)
icon-512x512.png      → 512x512px (PWA)
og-image.png          → 1200x630px ⭐ IMPORTANTE
logo.png              → 512x512px+
```

**Geradores rápidos:**
- OG image: Abra `public/og-image-template.html` no navegador
- Favicons: https://realfavicongenerator.net/
- PWA icons: https://www.pwabuilder.com/imageGenerator

### 2. Configurar Variáveis

**Em `config/seo.config.ts`:**
```typescript
export const SITE_URL = "https://seudominio.com.br"; // ⚠️ ATUALIZAR
export const SOCIAL_LINKS = {
  twitter: "@seutwitter",    // ⚠️ ATUALIZAR
  linkedin: "company/sua",    // ⚠️ ATUALIZAR
  instagram: "@seuinsta",     // ⚠️ ATUALIZAR
};
```

**Em `.env.local` (desenvolvimento):**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Em produção (Vercel/Netlify):**
```env
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
```

### 3. Google Search Console (Após Deploy)

#### Passo 1: Adicionar Propriedade
1. Acesse: https://search.google.com/search-console
2. Clique em "Adicionar Propriedade"
3. Escolha "Prefixo do URL" e digite seu domínio

#### Passo 2: Verificar Propriedade
Escolha um método:

**Método 1: Tag HTML (Recomendado)**
1. Copie o código fornecido (ex: `abc123xyz456`)
2. Adicione em `config/seo.config.ts`:
   ```typescript
   verification: {
     google: "abc123xyz456", // Cole aqui
   }
   ```
3. Faça deploy
4. Clique em "Verificar"

**Método 2: Arquivo HTML**
1. Baixe o arquivo (ex: `google123.html`)
2. Coloque em `/public/`
3. Faça deploy
4. Clique em "Verificar"

**Método 3: DNS (Para domínio completo)**
1. Copie o registro TXT
2. Adicione no painel DNS do seu domínio
3. Aguarde propagação (15-30min)
4. Clique em "Verificar"

#### Passo 3: Enviar Sitemap
1. No painel do Search Console, vá em "Sitemaps"
2. Digite: `sitemap.xml`
3. Clique em "Enviar"

#### Passo 4: Solicitar Indexação
1. Vá em "Inspeção de URL"
2. Digite a URL da home
3. Clique em "Solicitar indexação"

---

## 🧪 Testes e Validação

### Antes do Deploy

```bash
npm run build                # Build de produção
npm start                    # Rodar localmente

# Endpoints para testar:
# http://localhost:3000/sitemap.xml
# http://localhost:3000/robots.txt
# http://localhost:3000/manifest.json
```

### Após o Deploy

| Ferramenta | URL | O que Testar |
|------------|-----|--------------|
| **Lighthouse** | Chrome DevTools (F12) | Performance, SEO, PWA, Accessibility |
| **Rich Results** | https://search.google.com/test/rich-results | Schema.org structured data |
| **Open Graph** | https://www.opengraph.xyz/ | Preview de compartilhamento |
| **PageSpeed** | https://pagespeed.web.dev/ | Core Web Vitals |
| **Schema Validator** | https://validator.schema.org/ | JSON-LD |

### Testes de Compartilhamento
- WhatsApp: Envie link e veja preview
- Facebook: Use Facebook Debugger
- LinkedIn: Compartilhe e veja preview
- Twitter: Tweet o link

---

## 📊 O que está Configurado

### ✅ Metadata Base
- Títulos otimizados com template
- Descrições e keywords
- Canonical URLs
- Locale pt-BR

### ✅ Open Graph & Social
- Facebook, WhatsApp, LinkedIn
- Twitter Cards
- Imagens 1200x630px

### ✅ Structured Data (Schema.org)
- Organization
- Website com SearchAction
- JSON-LD implementado

### ✅ PWA Ready
- Web App Manifest
- Ícones multi-tamanho
- Theme colors

### ✅ Sitemap & Robots
- Sitemap XML dinâmico
- Robots.txt configurado
- Priorities e frequencies

### ✅ Segurança
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- X-DNS-Prefetch-Control

---

## 💡 Best Practices

### Títulos
- Max 60 caracteres
- Palavra-chave principal no início
- Único por página

### Descrições
- 150-160 caracteres
- Inclua call-to-action
- Palavra-chave secundária

### URLs
- Curtas e descritivas
- Apenas minúsculas
- Use hífens: `/laudos-radiologicos` ✅

### Keywords
- 5-10 por página
- Foque em long-tail
- Use ferramentas: Google Keyword Planner

### Imagens
- Alt text descritivo
- Formatos modernos: WebP
- Use Next.js Image component

---

## 🐛 Troubleshooting

### Build Falha
```bash
# Verifique se os imports estão corretos
npm install
npm run build
```

### Sitemap Não Aparece
- Build de produção executado?
- URL correta: `/sitemap.xml`
- Cache do CDN limpo?

### Open Graph Não Funciona
- Imagem existe em `/public/og-image.png`?
- Tamanho: 1200x630px?
- Teste em: https://www.opengraph.xyz/

### Página Não Indexa
- Google demora 3-7 dias
- Sitemap enviado no GSC?
- Robots.txt permite indexação?
- Use "Solicitar indexação" no GSC

### Erro de Verificação GSC
- Deploy executado após adicionar código?
- Aguarde 2-3 minutos após deploy
- Limpe cache do CDN
- Tente outro método de verificação

---

## 📈 Métricas Esperadas

### Lighthouse (Após adicionar imagens)
- 🎯 Performance: 90-100
- 🎯 SEO: 90-100
- 🎯 Best Practices: 90-100
- 🎯 Accessibility: 80-95

### Google Search Console (1-2 semanas)
- ✅ Sitemap processado
- ✅ Páginas indexadas
- ✅ Structured data sem erros
- ✅ Mobile-friendly
- ✅ Core Web Vitals: Good

---

## 📚 Recursos Úteis

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)

---

## ✅ Checklist Rápido

### Antes do Deploy
- [ ] Imagens adicionadas em `/public`
- [ ] `SITE_URL` atualizada em `config/seo.config.ts`
- [ ] Redes sociais configuradas
- [ ] Build teste bem-sucedido
- [ ] Variáveis de ambiente configuradas

### Após o Deploy
- [ ] Google Search Console configurado
- [ ] Sitemap enviado
- [ ] Código de verificação atualizado
- [ ] Lighthouse audit > 90
- [ ] Open Graph testado
- [ ] Compartilhamento testado

---

**Criado**: 2026-03-09
**Build Status**: ✅ Testado e funcionando
**Próximo Passo**: Adicionar imagens (veja `public/SEO-ASSETS-GUIDE.md`)
