import type { PlanDefinition } from "@/types/content";

const basePlanFeatures = [
  "Acesso à comunidade",
  "Chat com IA para dúvidas e pesquisas",
  "Suporte",
  "Gestão dos laudos",
] as const;

const planDefinitions: PlanDefinition[] = [
  {
    id: "basic",
    title: "WBasic",
    price: "R$ 329,90",
    description: "40 laudos com IA",
    subtext: "12 horas economizadas (média)",
    buttonLabel: "Testar Grátis",
    buttonHref: "https://app.sswradio.com/inicio?signup=cadastro",
    buttonClasses: "bg-orange-600 text-white hover:bg-orange-700",
    tone: "light",
    features: basePlanFeatures,
  },
  {
    id: "pro",
    title: "WPro",
    price: "R$ 589,90",
    description: "100 laudos com IA",
    subtext: "30 horas economizadas (média)",
    buttonLabel: "Testar Grátis",
    buttonHref: "https://app.sswradio.com/inicio?signup=cadastro",
    buttonClasses: "bg-orange-500 text-white hover:bg-orange-600",
    badge: "Mais popular",
    tone: "dark",
    features: basePlanFeatures,
  },
  {
    id: "advanced",
    title: "WAdvanced",
    price: "R$ 1.129,90",
    description: "250 laudos com IA",
    subtext: "75 horas economizadas (média)",
    buttonLabel: "Testar Grátis",
    buttonHref: "https://app.sswradio.com/inicio?signup=cadastro",
    buttonClasses: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    tone: "light",
    features: basePlanFeatures,
  },
  {
    id: "custom",
    title: "Personalizado",
    price: "Sob consulta",
    description: "Volume ilimitado",
    subtext: "Economia proporcional ao volume contratado",
    buttonLabel: "Falar com o time",
    buttonHref: "/contact",
    buttonClasses: "bg-orange-600 text-white hover:bg-orange-700",
    tone: "light",
    features: [
      ...basePlanFeatures,
      "Onboarding e treinamento",
      "Múltiplos usuários",
    ],
  },
];

const slides = [
  {
    title: "Com imagens",
    image: "/laudo-image.png",
    alt: "Tela de laudo com imagens",
  },
  {
    title: "Sem imagens",
    image: "/laudo-nothImage.png",
    alt: "Tela de laudo sem imagens",
  },
];

const faqs = [
  {
    question: "A WRadio substitui o radiologista?",
    answer:
      "Não. Ela atua como suporte e segunda leitura. A análise e assinatura final são do médico.",
  },
  {
    question: "A WRadio dá diagnóstico definitivo?",
    answer:
      "Ela organiza hipóteses com base no que é fornecido (imagem e informações). A conclusão final é sempre do médico.",
  },
  {
    question: "Ela atende apenas radiologia?",
    answer:
      "O foco é radiologia e laudos, mas também apoia dúvidas clínicas e modalidades como ECG, ecocardiograma e densitometria.",
  },
  {
    question: "Como funcionam os créditos?",
    answer:
      "Os créditos são consumidos conforme o uso (laudos e chat). Os recursos são os mesmos em todos os planos.",
  },
  {
    question: "Tenho histórico dos meus laudos?",
    answer: "Sim. Você acessa um banco com histórico e métricas do seu uso.",
  },
];

const modalitiesList = [
  "Ressonância Magnética (RM)",
  "Ultrassonografia (US)",
  "Tomografia Computadorizada (TC)",
  "Radiografia (RX)",
];

const chatFeaturesContent = [
  {
    title: "Diagnóstico Diferencial",
    description:
      "Apoio em diagnósticos diferenciais complexos com base em achados de imagem e dados clínicos fornecidos.",
  },
  {
    title: "Correlação Clínico-Laboratorial",
    description:
      "Análise integrada entre os achados radiológicos, exames laboratoriais e o quadro clínico do paciente.",
  },
  {
    title: "Qual Exame Solicitar?",
    description:
      "Suporte na escolha da melhor modalidade e protocolo para cada suspeita clínica e próximos passos investigativos.",
  },
  {
    title: "Discussão Técnica",
    description:
      "Uso de linguagem médica técnica para discussão aprofundada de casos radiológicos e clínicos.",
  },
];

const reportSteps = {
  titleLine1: "Faça laudos em 4",
  titleLine2: "minutos ou menos...",
  subtitleLine1: "Adaptamos um cronômetro para você",
  subtitleLine2: "observar seu tempo médio de laudo",
  steps: [
    {
      title: "Sem imagem",
      middle: "ou",
      subtitle: "Com imagem",
      emphasize: true,
    },
    {
      title: "Preencha os campos",
    },
    {
      title: "Aqui seu laudo já está pronto",
    },
    {
      title: "Edite e assine",
    },
  ],
};

const comparisons = [
  {
    with: "Diagnósticos mais rápidos e precisos.",
    without: "Processos manuais lentos e repetitivos.",
  },
  {
    with: "Fluxo de trabalho automatizado com IA.",
    without: "Maior risco de erros e retrabalho constante.",
  },
  {
    with: "Menos fadiga e maior rentabilidade.",
    without: "Sobrecarga de trabalho e estresse produtivo.",
  },
];

const ptBR = {
  metadata: {
    title: "Wradio",
    description: "Laudos inteligentes",
  },
  navbar: {
    navItems: [
      { name: "a Wradio", href: "/home#wradio" },
      { name: "IA", href: "/home#services" },
      { name: "Planos", href: "/home#plans" },
    ],
    ctaPrimary: "Testar grátis",
    ctaSecondary: "Entrar",
    ariaToggleMenu: "Alternar menu",
  },
  hero: {
    titleLine1: "Agora seu laudo pode ser feito com IA",
    subtitle:
      "Faça parte dos radiologistas que transformaram suas rotinas e otimizaram seus laudos com inteligência artificial.",
    cta: "Crie sua conta grátis",
  },
  reportSteps: {
    ...reportSteps,
  },
  reportExpress: {
    title: "Laudo Express",
    subtitle: "O laudo com IA mais rápido e assertivo do mercado",
    description:
      "Gere laudos com estrutura técnica e linguagem radiológica consistente, prontos para revisão e assinatura. Ideal para acelerar a etapa mais demorada,",
    highlight: "transformar achados em laudo final.",
    slides,
    sliderMinSwipeDistance: 50,
  },
  doctorComparison: {
    titleLine1: "A diferença entre um profissional",
    titleHighlight: "potencializado pela IA",
    titleLine2: "e o tradicional.",
    labelCom: "Com Wradio",
    labelSem: "Sem Wradio",
    comparisons,
  },
  faq: {
    titleMain: "Perguntas",
    titleHighlight: "Frequentes",
    description: "Tire suas dúvidas sobre o funcionamento da WRadio.",
    items: faqs,
  },
  helpChat: {
    titleLine1: "Chat de Dúvidas com IA",
    titleHighlight: "(Clínico e Radiológico)",
    description:
      "Um chat inteligente para apoiar suas decisões no dia a dia. Ideal para discussões técnicas rápidas e suporte clínico em tempo real.",
    features: chatFeaturesContent,
  },
  modalities: {
    titleBefore: "Confira todas as modalidades de imagem que nossa",
    titleHighlight: "IA",
    titleAfter: "consegue ler",
    list: modalitiesList,
  },
  plans: {
    title: "Escolha o plano ideal para a sua produtividade",
    description:
      "Transforme sua rotina de laudos com inteligência artificial. Sem taxas ocultas, cancele quando quiser.",
    planDefinitions,
  },
  founder: {
    badge: "Compromisso com a Excelência",
    headingLine1: "Confiança de quem",
    headingLine2: "vive a rotina radiológica",
    description:
      "Desenvolvido por radiologistas para radiologistas. Nossa missão é trazer segurança e agilidade para o seu dia a dia, utilizando o que há de mais moderno em inteligência artificial, sem nunca abrir mão da sobriedade e precisão técnica.",
    watchButton: "Assista à mensagem",
    quote: "A IA não substitui o radiologista, ela o potencializa.",
  },
  footer: {
    description:
      "Sua plataforma de inteligência artificial para radiologia e laudos.",
    terms: "Termos de Uso",
    privacy: "Política de Privacidade",
    ariaInstagram: "Instagram",
    ariaEmail: "Email",
  },
  aria: {
    previousPlan: "Plano anterior",
    nextPlan: "Próximo plano",
  },

  // ─── Auth ────────────────────────────────────────────────────────────────────
  auth: {
    login: {
      badge: "Acesso à plataforma",
      headingLine1: "Entre na",
      headingLine2: "sua conta.",
      subtitle: "Bem-vindo de volta. Acesse seus laudos e continue de onde parou.",
      emailLabel: "E-mail",
      emailPlaceholder: "seu@email.com",
      passwordLabel: "Senha",
      forgotPassword: "Esqueceu a senha?",
      loadingBtn: "Entrando...",
      submitBtn: "Entrar",
      noAccount: "Não tem uma conta?",
      registerLink: "Cadastre-se grátis",
      errorInvalidCredentials: "E-mail ou senha incorretos. Tente novamente.",
    },
    register: {
      badge: "Novo por aqui",
      headingLine1: "Crie sua",
      headingLine2: "conta médica.",
      subtitle: "Comece a usar o Wradio gratuitamente. Rápido e sem complicação.",
      nameLabel: "Nome completo",
      namePlaceholder: "Dr. Seu Nome",
      emailLabel: "E-mail",
      emailPlaceholder: "seu@email.com",
      passwordLabel: "Senha",
      passwordPlaceholder: "Mínimo 8 caracteres",
      confirmPasswordLabel: "Confirmar senha",
      confirmPasswordPlaceholder: "Repita sua senha",
      errorPasswordMismatch: "As senhas não coincidem.",
      loadingBtn: "Criando conta...",
      submitBtn: "Criar conta",
      errorDefault: "Erro ao criar conta.",
      hasAccount: "Já tem uma conta?",
      loginLink: "Entrar",
    },
  },

  // ─── Onboarding ──────────────────────────────────────────────────────────────
  onboarding: {
    welcome: {
      badge: "Configuração inicial",
      headingLine1: "Configure seu",
      headingLine2: "perfil médico.",
      subtitle:
        "6 perguntas rápidas para calibrar a plataforma de acordo com sua especialidade e rotina de laudos.",
      startBtn: "Começar agora",
      skipBtn: "Pular configuração por agora",
      journey: [
        { label: "Graduação", desc: "Sua formação" },
        { label: "Modalidades", desc: "O que você lauda" },
        { label: "Desafios", desc: "Sua dor hoje" },
        { label: "Atendimento", desc: "Onde você atua" },
        { label: "Tempo", desc: "Sua velocidade" },
        { label: "CRM", desc: "Sua validação" },
      ],
    },
    steps: {
      stepLabel: "Passo",
      stepOf: "de",
      backBtn: "Voltar",
      nextBtn: "Próximo",
      finishBtn: "Finalizar",
      crmStateLabel: "Estado",
      crmNumberLabel: "Número do CRM",
      crmInfo:
        "Seu CRM é utilizado para validar seu registro profissional e garantir acesso às funcionalidades exclusivas para médicos.",
      crmErrorDigitsOnly: "O número do CRM deve conter apenas dígitos.",
      crmErrorInvalidLength: "Número de CRM inválido. Verifique e tente novamente.",
      questions: [
        {
          title: "Qual é sua especialidade?",
          subtitle: "Pode selecionar mais de uma opção.",
          type: "multi" as const,
          options: [
            { id: "generalista", label: "Generalista" },
            { id: "radiologista", label: "Radiologista / Sub-especialista" },
            { id: "pos-radiologia", label: "Pós-graduação (Radiologia)" },
            { id: "pos-imaginologia", label: "Pós-graduação (Imaginologista)" },
            { id: "ultrassonografista", label: "Ultrassonografista" },
            { id: "outro", label: "Outro" },
          ],
        },
        {
          title: "Você lauda principalmente?",
          subtitle: "Pode escolher mais de uma modalidade.",
          type: "multi" as const,
          options: [
            { id: "rx", label: "Raio-X" },
            { id: "tc", label: "TC" },
            { id: "rm", label: "RM" },
            { id: "us", label: "Ultrassom" },
          ],
        },
        {
          title: "Seu maior problema hoje?",
          subtitle: "O que mais te desafia no dia a dia?",
          type: "single" as const,
          options: [
            { id: "tempo", label: "Tempo para laudar", sublabel: "Cada laudo consome muito tempo" },
            { id: "volume", label: "Volume de exames", sublabel: "Muitos exames pendentes" },
            { id: "padronizacao", label: "Padronização", sublabel: "Dificuldade em manter padrão" },
            { id: "faturamento", label: "Faturamento", sublabel: "Controle e gestão financeira" },
            { id: "equipe", label: "Falta de equipe", sublabel: "Poucos profissionais disponíveis" },
          ],
        },
        {
          title: "Você atende principalmente?",
          subtitle: "Onde você realiza a maior parte dos seus laudos?",
          type: "single" as const,
          options: [
            { id: "clinica", label: "Clínica" },
            { id: "hospital", label: "Hospital" },
            { id: "telelaudo", label: "Telelaudo" },
          ],
        },
        {
          title: "Qual seu tempo médio por laudo?",
          subtitle: "Desde a abertura do exame até a assinatura.",
          type: "single" as const,
          options: [
            { id: "10-15", label: "10 a 15 minutos" },
            { id: "15-20", label: "15 a 20 minutos" },
            { id: "20-25", label: "20 a 25 minutos" },
          ],
        },
        {
          title: "Validação de CRM",
          subtitle: "Insira seu CRM para confirmar seu registro profissional.",
          type: "crm" as const,
          options: [] as { id: string; label: string; sublabel?: string }[],
        },
      ],
    },
  },

  // ─── App (dashboard) ─────────────────────────────────────────────────────────
  app: {
    home: {
      badge: "Painel Principal",
      welcomePrefix: "Bem-vindo(a), Dr.(a)",
      subtitle: "Acompanhe seus laudos e métricas do dia.",
      reportExpressBtn: "Laudo Express",
      reportsTodayLabel: "Laudos Hoje",
      avgTimeLabel: "Tempo médio de laudo",
      savedTimeLabel: "Tempo Médio Economizado",
    },
    sidebar: {
      menuTitle: "Menu",
      toggleTheme: "Trocar tema",
      referral: "Indique e ganhe créditos",
      navPanel: "Painel",
      navChat: "Chat",
      navFeedback: "Feedback",
      navCommunity: "Comunidade",
      navSettings: "Configurações",
    },
    topbar: {
      toggleMenuTitle: "Abrir/fechar menu",
      reportExpressBtn: "Laudo Express",
      tokensLabel: "tokens",
      addTokensTitle: "Ver planos e adicionar tokens",
      profileTitle: "Perfil",
      settingsLink: "Configurações",
      signOutBtn: "Sair",
    },
    examsTable: {
      viewAll: "Ver todos",
      savedTab: "Salvos",
      todayLabel: "Hoje",
      scrollHint: "Deslize para ver mais →",
      emptyMessage: "Nenhum exame encontrado neste período.",
      periodLabel: "Período:",
      clearFilter: "Limpar filtro",
      colExams: "Exames",
      colStatus: "Status",
      colDate: "Data do Laudo",
      colActions: "Função",
      titleFavorite: "Favoritar",
      titleDownload: "Baixar",
      titleShare: "Compartilhar",
      titleSave: "Salvar",
      calendarClear: "Limpar",
      calendarSelectPeriod: "Selecionar período",
      weekdays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const,
      monthNames: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
      ] as const,
      filters: [
        "Hoje",
        "Últimos 7 Dias",
        "Últimos 30 Dias",
        "Este ano",
        "Destaques",
        "Não concluído",
        "Finalizado",
      ] as const,
    },
    chat: {
      badge: "Assistente IA",
      headingLine1: "Olá, como posso",
      headingLine2: "te ajudar hoje?",
      subtitle: "Especializado em radiologia. Analise laudos, tire dúvidas e muito mais.",
      startBtn: "Iniciar nova conversa",
      autoSaveHint: "Suas conversas são salvas automaticamente no histórico",
      quickPrompts: [
        {
          label: "Analisar laudo",
          sublabel: "Revisão de achados radiológicos",
          prompt: "Preciso de ajuda para analisar um laudo radiológico.",
        },
        {
          label: "Tirar dúvida clínica",
          sublabel: "Esclareça achados e condutas",
          prompt: "Tenho uma dúvida sobre um achado clínico.",
        },
        {
          label: "Laudos pendentes",
          sublabel: "Veja o que ainda precisa de revisão",
          prompt: "Quais laudos estão pendentes de revisão?",
        },
      ],
    },
    feedback: {
      badge: "Fale com a gente",
      heading: "Escreva sua experiência na Wradio",
      subtitle: "Todos os e-mails vão direto para a caixa do fundador.",
      founderName: "Fundador da Wradio",
      founderSubtitle: "Lê e responde cada mensagem pessoalmente",
      placeholder: "Escreva sua mensagem aqui...",
      loadingBtn: "Enviando...",
      submitBtn: "Enviar feedback",
      sendError: "Não foi possível enviar. Tente novamente.",
      successBadge: "Recebemos!",
      successHeading: "Obrigado pelo seu feedback",
      successSubtitle:
        "Sua mensagem foi enviada diretamente ao fundador. Fique atento(a) a possíveis respostas.",
      sendAnotherBtn: "Enviar outro feedback",
    },
    settings: {
      badge: "Wradio",
      heading: "Configurações",
      subtitle: "Gerencie sua conta, segurança, planos e privacidade.",
      tabAccount: "Conta",
      tabSecurity: "Segurança",
      tabPlans: "Planos",
      tabPrivacy: "Privacidade",
      account: {
        photoLabel: "Foto de perfil",
        photoHint: "JPG, PNG, GIF ou WebP. Máx 5 MB.",
        photoSizeError: "O arquivo deve ter no máximo 5 MB.",
        nameLabel: "Nome completo",
        emailLabel: "E-mail",
        phoneLabel: "Telefone",
        crmLabel: "CRM",
        errorNotAuth: "Não autenticado",
        emailConfirmMsg:
          "Confirmação enviada para o novo endereço. A alteração só terá efeito após confirmação.",
        saveError: "Erro ao salvar alterações.",
        uploadError: "Erro ao enviar foto.",
        prefsBadge: "Preferências",
        notificationsTitle: "Notificações",
        notifications: [
          { label: "Novos laudos disponíveis", defaultOn: true },
          { label: "Atualizações da plataforma", defaultOn: true },
          { label: "Ofertas e promoções", defaultOn: false },
        ],
        savingBtn: "Salvando...",
        savedBtn: "Salvo!",
        saveBtn: "Salvar alterações",
      },
      security: {
        accessBadge: "Acesso",
        changePassTitle: "Alterar senha",
        currentPassLabel: "Senha atual",
        newPassLabel: "Nova senha",
        confirmPassLabel: "Confirmar nova senha",
        errFillAll: "Preencha todos os campos.",
        errMismatch: "As senhas não coincidem.",
        errTooShort: "A nova senha deve ter pelo menos 8 caracteres.",
        errCurrentPass: "Senha atual incorreta.",
        errCannotVerify: "Não foi possível verificar sua senha. Tente novamente.",
        errUpdate: "Erro ao atualizar senha.",
        errUserNotFound: "Usuário não encontrado.",
        updatingBtn: "Atualizando...",
        updatedBtn: "Senha atualizada!",
        updateBtn: "Atualizar senha",
        twoFactorTitle: "Autenticação em dois fatores",
        twoFactorSubtitle: "Adicione uma camada extra de segurança à sua conta.",
        comingSoon: "Em breve",
        devicesBadge: "Dispositivos",
        activeSessionsTitle: "Sessões ativas",
        sessionCurrentBadge: "Atual",
        sessionTerminated: "Encerrada",
        revokingBtn: "Encerrando...",
        revokeOthersBtn: "Encerrar outras sessões",
        revokeHint:
          '"Encerrar outras sessões" desconecta todos os outros dispositivos simultaneamente.',
      },
      plans: {
        badge: "Assinatura",
        title: "Seu plano atual",
        subtitle: "Gerencie sua assinatura e compare os planos disponíveis.",
        highlightLabel: "Plano em destaque:",
      },
      privacy: {
        controlBadge: "Controle",
        prefsTitle: "Preferências de privacidade",
        dataBadge: "Dados",
        dataTitle: "Seus dados",
        dataSubtitle:
          "Você pode solicitar uma cópia dos seus dados ou excluir permanentemente sua conta e todos os dados associados.",
        exportBtn: "Exportar meus dados",
        comingSoon: "Em breve",
        deleteBtn: "Excluir minha conta",
        deleteWarning:
          "Essa ação é irreversível. Todos os seus dados serão permanentemente excluídos.",
        deleteConfirmBtn: "Confirmar exclusão",
        cancelBtn: "Cancelar",
        deletingBtn: "Excluindo...",
        deleteError: "Erro inesperado. Tente novamente.",
        legalBadge: "Legal",
        legalTitle: "Documentos legais",
        legalLinks: [
          { label: "Política de Privacidade", href: "#" },
          { label: "Termos de Uso", href: "#" },
          { label: "Política de Cookies", href: "#" },
        ],
        privacyToggles: [
          {
            label: "Análise de uso",
            description:
              "Permite coletar dados anônimos para melhorar a experiência da plataforma.",
            defaultOn: true,
          },
          {
            label: "Personalização",
            description: "Usa seu histórico para personalizar sugestões e resultados.",
            defaultOn: true,
          },
          {
            label: "Compartilhar com terceiros",
            description:
              "Autoriza o compartilhamento de dados anonimizados com parceiros.",
            defaultOn: false,
          },
        ],
      },
    },
    reportExpress: {
      title: "Laudo Express",
      indexSubtitle: "Inicie uma sessão de laudos cronometrada",
      reportsTodayLabel: "Laudos Hoje",
      thisMonthLabel: "Esse Mês",
      pendingReportsLabel: "Laudos Pendentes",
      timerVisibleLabel: "Cronômetro visível",
      timerVisibleSubtitle: "Exibe o tempo por laudo durante a sessão",
      startSessionBtn: "Iniciar sessão",
      session: {
        newReportTitle: "Novo Laudo",
        newReportSubtitle:
          "Preencha os campos obrigatórios para potencializar a assertividade do seu laudo",
        withImage: "Com imagem",
        withoutImage: "Sem imagem",
        examTypeLabel: "Tipo de exame",
        examTypePlaceholder: "Selecione o tipo de exame",
        examTypes: [
          "Tomografia Computadorizada",
          "Ressonância Magnética",
          "Ultrassonografia",
          "Radiografia",
        ] as const,
        descriptionLabel: "Descrição",
        descriptionPlaceholder: "Descreva aqui...",
        recordAudioLabel: "Gravar áudio",
        stopRecordingLabel: "Parar gravação",
        imagesLabel: "Imagens do exame",
        imageDropHint: "Clique ou arraste as imagens aqui",
        imageFormats: "PNG, JPG, DICOM",
        removeImageLabel: "Remover imagem",
        submitBtn: "Laudar Agora",
      },
    },
  },
};

export type PtBrDictionary = typeof ptBR;

export default ptBR;
