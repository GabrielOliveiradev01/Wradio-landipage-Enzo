# Guia de Assets de SEO

Este arquivo lista todas as imagens e ícones necessários para uma configuração completa de SEO.

## Ícones Necessários (favicon e PWA)

Adicione os seguintes arquivos na pasta `/public`:

### Favicons
- `favicon.ico` - 32x32px ou 64x64px
- `icon-16x16.png` - 16x16px
- `icon-32x32.png` - 32x32px

### Apple Touch Icons
- `apple-touch-icon.png` - 180x180px

### PWA Icons
- `icon-192x192.png` - 192x192px
- `icon-512x512.png` - 512x512px

## Open Graph e Social Media

### Imagem Principal de Open Graph
- `og-image.png` - 1200x630px
  - Esta imagem será exibida quando seu site for compartilhado no Facebook, LinkedIn, WhatsApp, etc.
  - Use uma imagem clara com o logo e/ou texto descritivo
  - Evite texto muito pequeno (mínimo 40-60px)

### Logo
- `logo.png` - Recomendado 512x512px ou maior
  - Usado no Schema.org e em rich snippets do Google

## Como Gerar os Ícones

### Opção 1: Ferramentas Online
1. **Favicon Generator**: https://realfavicongenerator.net/
   - Upload uma imagem quadrada (mínimo 512x512px)
   - Baixe o pacote completo de favicons

2. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
   - Upload uma imagem quadrada
   - Gera todos os tamanhos necessários

### Opção 2: Usando Design Tools
1. Crie uma imagem quadrada no Figma/Photoshop/Canva
2. Exporte nos tamanhos especificados acima
3. Use ferramentas como ImageMagick para redimensionar:
   ```bash
   convert logo.png -resize 192x192 icon-192x192.png
   convert logo.png -resize 512x512 icon-512x512.png
   ```

## Checklist de Imagens

Marque conforme for adicionando as imagens:

- [ ] favicon.ico
- [ ] icon-16x16.png
- [ ] icon-32x32.png
- [ ] apple-touch-icon.png
- [ ] icon-192x192.png
- [ ] icon-512x512.png
- [ ] og-image.png
- [ ] logo.png

## Dicas de Design

### Para Favicons e Ícones PWA:
- Use design simples e reconhecível
- Alto contraste
- Evite detalhes muito pequenos
- Teste em diferentes fundos (claro/escuro)

### Para Open Graph:
- Proporção 1.91:1 (1200x630px é o padrão)
- Área segura: deixe 50px de margem em todos os lados
- Texto legível mesmo em tamanhos pequenos
- Cores que reflitam a identidade da marca
- Inclua logo e/ou nome do produto

## Próximos Passos

Após adicionar todas as imagens:
1. Teste no navegador se os favicons aparecem
2. Use o validador de Open Graph: https://www.opengraph.xyz/
3. Teste compartilhamento no WhatsApp, LinkedIn, Facebook
4. Valide os ícones PWA com o Lighthouse do Chrome DevTools
