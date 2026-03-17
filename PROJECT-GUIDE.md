# Guia do Projeto

Este documento orienta como colaborar com a IA neste repositório, descrevendo a stack técnica, a estrutura atual e os comandos-chave para desenvolvimento, verificação e pré-produção.

## Stack técnica e versões

- **Node.js**: 24.x (definido em `package.json > engines`).
- **pnpm/npm**: qualquer gerenciador compatível com Node 24 e `package-lock.json`; usamos `npm` nas instruções.
- **Next.js** 16.1.6 (app router).
- **React** 19.2.3 / **React DOM** 19.2.3.
- **TypeScript** 5.x.
- **Tailwind CSS** 4.x com `@tailwindcss/postcss` 4.x para processamento de utilitários.
- **ESLint** 9 + `eslint-config-next` 16.1.6 para linting conforme boas práticas Next.
- **Utilitários**: `clsx` 2.1.1, `lucide-react` 0.574.0, `react-icons` 5.5.0, `tailwind-merge` 3.4.1.

> Ao iniciar a sessão de pair programming, confirme a versão do Node (por exemplo, com `node -v`) e rode `npm install` se os módulos não estiverem presentes.

## Estrutura principal de arquivos

- `/app/`: pasta do Next.js App Router; contém rotas, layouts e páginas como `app/page.tsx`.
- `/components/`: componentes reutilizáveis compartilhados entre rotas/pages.
- `/lib/`: helpers, hooks ou constantes globais; mantenha funções genéricas aqui.
- `/public/`: assets públicos (imagens, fontes, ícones). A Next serve direto daqui.
- `/next.config.ts`: configurações do Next (verifique adaptações antes de alterar).
- `/tsconfig.json`: ajustes do TypeScript; sincronize qualquer mudança grande com a IA.
- `/package.json`, `/package-lock.json`: scripts e dependências. Não edite manualmente o lock; use `npm install` para atualizar.
- `/eslint.config.mjs` & `/postcss.config.mjs`: regras de lint e PostCSS/Tailwind.

## Comandos principais

- `npm run dev` — inicia o servidor de desenvolvimento (recarregamento automático).
- `npm run build` — gera o build de produção; obrigatório antes do deploy e útil para detectar erros de exportação.
- `npm run start` — inicia o app já buildado (para testes locais pós-build).
- `npm run lint` — roda o ESLint sobre o código (dev e pré-deploy).

> Dica em pair: revise mudanças de lint antes de commitar; combine ações como `npm run lint` seguido de `npm run build` para garantir estabilidade.

## Pré-deploy e checklist

1. `npm run lint` — resolva avisos/falhas (estilo, imports não usados, etc.).
2. `npm run build` — confirme que o bundle passa (especialmente importantes quando tocar rotas dinâmicas ou env vars).
3. Se estiver validando antes do deploy manual, rode `npm run start` (geralmente útil no ambiente Linux/macOS local) e abra `http://localhost:3000`.
4. Verifique assets no `/public/` e qualquer arquivo estático que precise versão/assíncrono.
5. Confirme a versão do Node usada (24.x) no ambiente de deploy (ex: Vercel ou outro host compatível).

## Fluxo sugerido para pair programming

1. **Contexto rápido**: descreva à IA a tarefa (ex: ajuste UI no `app/page.tsx`, adicionar novo componente em `components/`).
2. **Troca de arquivos**: combine quem edita qual arquivo para evitar conflitos; a IA pode sugerir mudanças, você edita e testa localmente.
3. **Teste incremental**: sempre que possível, rode `npm run dev`/`npm run lint` após mudanças pontuais.
4. **Revisão final**: antes de encerrar a sessão, resuma as ações (o que foi alterado, o que precisa de follow-up) e confirme que os comandos de pré-deploy foram executados.
5. **Checklist de deploy**: execute a seção “Pré-deploy” acima para validar status.

## Dicas extras

- Use `app/layout.tsx` (se existir) para temas globais; a IA pode ajudar a revisar layout/SEO.
- Mantenha `components/` pequena e reutilizável; peça à IA para refatorar partes repetidas.
- Ao introduzir novas dependências, confirme compatibilidade com React 19/Next 16 e atualize `package-lock.json` via `npm install`.

## Referência da landing page principal (`/home`)

### Visão geral e ancoragens

- `next/navigation` redireciona `/` para `/home`, que é o hub desta landing.
- O layout global (`app/layout.tsx`) injeta o `Navbar` acima da `main` e importa o `globals.css`, que ativa `scroll-behavior: smooth` e `scroll-padding-top: 5rem` — detalhes importantes para o comportamento das âncoras.
- Cada seção relevante define um `id` (`hero`, `services`, `wradio`, `doctor-comparison`, `plans`, `faq`) para que os links internos do nav e o comportamento de rolagem suave funcionem de forma previsível em desktop e mobile.
- O corpo da página (`app/(pages)/home/page.tsx`) sequencia os componentes: `HeroSection`, `ReportStepsSection`, `ReportExpressSection`, `FounderSection`, `ModalitiesSection`, `DoctorComparisonSection`, `PlansSection`, `HelpChatSection`, `FaqSection` e `Footer`.

### Navbar (desktop e mobile)

- Desktop: logo fixo na esquerda; três links (`a Wradio`, `IA`, `Planos`) navegando por âncoras em `/home`. `Testar grátis` aponta para `https://app.sswradio.com/?signup=cadastro`; `Entrar` leva a `https://app.sswradio.com/?signup=login`. Botões usam classes com estados hover para reforçar o CTA.
- Mobile (largura < md): menu hambúrguer que expande um painel absoluto de altura `calc(100dvh - 80px)` com fundo branco. O painel replica os três links internos e inclui dois CTA grandes empilhados (mesmes URLs de cadastro/login). Cada link fecha o menu ao clicar. O toggle usa ícones `Menu`/`X` e mantém foco visual.
- Tanto desktop quanto mobile usam `Link` do Next para evitar recarga completa; as ações externas (cadastro/login) usam URLs completas porque mapeiam para a aplicação SaaS.

### HeroSection

- Tela inicial em altura mínima de 95vh; fundo diferente por breakpoint: `Image` `/1.png` no desktop (componente `md:block`), `/IMG_3582.JPG` no mobile, incluindo gradiente inferior para garantir leitura do texto.
- Mensagem principal reforça a promessa (“Agora seu laudo pode ser feito com IA”) com `h1` responsivo e texto explicativo.
- CTA único “Crie sua conta grátis” (classe `rounded-3xl`, fundo preto no mobile e laranja no desktop) aponta para `https://app.sswradio.com/?signup=cadastro`. O botão centralizado em mobile e alinhado à esquerda em desktop; o estado `hover:bg-orange-600` reforça a interação.
- O hero não possui outros links; serve como âncora de conversão e mostra o logotipo alternativo em telas menores (`Image` icone branco).

### ReportStepsSection (seção “Faça laudos em 4 minutos”)

- Explica o fluxo em quatro passos numerados, com destaque de “com imagem/sem imagem” no primeiro cartão. Não há links, mas a estrutura usa uma barra de progresso abstrata (linha gradient) e bullets enumerados.
- Responsivo: os passos ficam em uma grade de quatro colunas no desktop; em telas menores, o layout empilha automaticamente e os círculos numerados redimensionam de 10 para 14 px.
- Serve como reforço de usabilidade/tempo e prepara a passada de rolagem para os CTAs subsequentes.

### ReportExpressSection (slider de capturas de tela)

- Caixa com fundo preto, título e subtítulo descrevendo “Laudo Express”.
- Slider controlado por estado (`useState`) com dois painéis (`Com imagens` e `Sem imagens`). Botões de topo (botão arrendodado) mudam o `activeSlide`; indicadores circulares na base refletem o slide ativo.
- Desktop exibe setas laterais (`ChevronLeft`, `ChevronRight`) que aparecem ao passar o mouse graças à classe `opacity-0 group-hover:opacity-100`; mobile esconde essas setas (classe `hidden sm:block`), incentivando gesto de swipe.
- Há suporte a toque: `onTouchStart/onTouchMove/onTouchEnd` calculam o deslizamento com `minSwipeDistance = 50` para alternar slides, garantindo usabilidade em telas sensíveis ao toque.
- O conteúdo do slider é renderizado em um `div` com `transform: translateX(-activeSlide * 100%)` para mostrar apenas o slide ativo.
- O texto abaixo enfatiza consistência radiológica e transformação rápida; não há links.

### FounderSection (autoridade da marca)

- Layout em duas colunas (texto à esquerda, bloco visual à direita em desktops; empilhado em mobile). O texto principal enfatiza confiança, com um parágrafo detalhado escondido em telas pequenas (`hidden lg:block`) e replicado em uma versão menor abaixo da imagem para mobile.
- À direita, há uma imagem circular do Dr. Wagner Ribeiro e um card vídeo (`video` autoplay, loop, muted) com botão play estilizado (SVG) que sugere mensagem em vídeo. A interação é visual/hover (escala com `group-hover:scale-105`) mas não abre modal.
- Citação final e badge de compromisso reforçam o tom.

### ModalitiesSection

- Lista de 12 modalidades (RM, US, DXA, mamografia, ECG, etc.) dentro de um painel com linha vertical e pontos laranja. A seção não tem botões, apenas apresenta capacidades para raiar credibilidade.
- O painel centralizado mantém padding maior em desktop (`lg:p-16`) e usa `max-w-lg` para limitar largura no mobile, garantindo legibilidade.

### DoctorComparisonSection

- Componente centralizado: vídeo demonstrativo à esquerda e comparativo “Com Wradio vs Sem Wradio” à direita.
- Usa `video` autoplay/loop/muted, aproveitando `playsInline` para evitar abrir modal no mobile.
- Comparativos estão dispostos em grade 2x2 e separadores horizontais laranja, reforçando contrastes. Não há CTA direto, mas transmite o posicionamento.

### PlansSection

- Visão geral com CTA textual (“Escolha o plano ideal…”), setas e slider/carrossel para desktop, e grade completa para mobile.
- Mobile (`md:hidden`): mostra os quatro planos simultaneamente em cards empilhados com sombras, cada um com botão `Link` para `/signup` ou `/contact`. O texto de botão é “Testar Grátis” para planos com preço fixo e “Falar com o time” para o personalizado.
- Desktop (`hidden md:flex`): mantém estado `activePlanIndex` para destacar um dos três cards visíveis com escala (105%) e sombra reforçada. Há botões circulares com `ChevronLeft/ChevronRight` para alternar e um `sr-only` que anuncia o plano em destaque, garantindo acessibilidade.
- Cada card reutiliza `PlanCard`, que atualiza cores com base no `tone` (claro/escuro), inclui badge “Mais popular” no plano `WPro`, lista features com ícones `Check` e usa `Link` para CTA. Botões trocam entre `bg-orange-600` e `bg-orange-50` dependendo do plano.
- As features incluem “Acesso à comunidade”, “Chat com IA”, “Suporte”, “Gestão de laudos”; plano personalizado agrega “Onboarding e treinamento” e “Múltiplos usuários”.
- A seção usa um background laranja à esquerda no desktop (div absoluta) e uma imagem de fundo no mobile (mesmo arquivo `/IMG_3582.JPG`) com gradiente inferior.

### HelpChatSection (marquee animado)

- Título com destaque em laranja para “Chat de Dúvidas com IA”.
- Usa animação CSS (`@keyframes marquee`) para deslocar cards horizontalmente em loop. Duplicação dos cards garante continuidade (`aria-hidden="true"` no duplicado). A classe `pause-marquee:hover` congela o movimento ao passar o mouse.
- Cards descrevem features como “Diagnóstico Diferencial”, “Correlação Clínico-Laboratorial”, “Qual Exame Solicitar?” e “Discussão Técnica”. Cada card exibe um ícone `lucide-react`.
- A área tem gradientes nas laterais (divs absolutas) para suavizar a transição quando o conteúdo loop.

### FaqSection

- Lista de cinco perguntas frequentes em accordions que mudam altura com `max-h` para animação. Cada faixa é um botão que controla `aria-expanded` e rotaciona o ícone `ChevronDown`.
- O conteúdo aparece com transição `opacity`/`max-h`. O estilo escuro (bordas e fundo em tons de cinza) mantém contraste alto.
- A FAQ fica imediatamente abaixo do chat para responder dúvidas antes da CTA final.

### Footer

- Fundo preto, logo centralizado e texto de descrição. Ícones sociais: Instagram (`https://www.instagram.com/wradio.ai/`) e Email (placeholder `href="#"` com `aria-label`).
- Links “Termos de Uso” e “Política de Privacidade” também usam `href="#"` como placeholder e devem ser atualizados com URLs reais antes do deploy.
- O copyright usa `new Date().getFullYear()` para sempre refletir o ano corrente.

### Notas de usabilidade e comportamento compartilhado

- Toda a landing usa classes Tailwind modernas e `Image`/`video` otimizados pelo Next. O carregamento prévio (`priority`) é aplicado às imagens do hero e plano e ao vídeo do Founder.
- O layout usa `max-w-7xl` e `px-4/px-6` para manter espaçamento horizontal consistente, além de `rounded-[2rem]` nos cards para manter a linguagem visual.
- O único formulário/ação final é via `Link` para a aplicação SaaS. Se for necessário um formulário interno, o componente `Link` deve ser trocado por `form`/`button`.
- A rolagem suave do `globals.css` faz com que os links do navbar deslizam com `scroll-padding-top` de 5rem para não esconder o topo da seção.
