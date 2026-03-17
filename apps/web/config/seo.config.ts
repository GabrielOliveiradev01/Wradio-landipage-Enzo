import type { Metadata } from "next";

// URL base do site - ATUALIZE com seu domínio quando tiver
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wradio.com.br";
export const SITE_NAME = "Wradio";
export const SITE_TITLE = "Wradio - Laudos Radiológicos Inteligentes";
export const SITE_DESCRIPTION = "Plataforma avançada de laudos radiológicos com inteligência artificial. Transforme seu fluxo de trabalho médico com tecnologia de ponta.";

// Palavras-chave principais para SEO
export const SITE_KEYWORDS = [
  "laudos radiológicos",
  "inteligência artificial médica",
  "radiologia",
  "diagnóstico por imagem",
  "telemedicina",
  "laudos médicos",
  "sistema de laudos",
  "IA em radiologia",
  "tecnologia médica",
  "wradio"
];

// Informações de contato e redes sociais
export const SOCIAL_LINKS = {
  twitter: "@wradio", // Atualize com seu handle
  linkedin: "company/wradio", // Atualize com sua página
  instagram: "@wradio", // Atualize com seu handle
};

// Configuração de Open Graph padrão
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
};

// Metadata base para SEO
export const seoConfig: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // Formato de URL canônica
  alternates: {
    canonical: "/",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
    creator: SOCIAL_LINKS.twitter,
  },

  // Icons e favicons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Manifest para PWA
  manifest: "/manifest.json",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verificação (adicione quando tiver os códigos)
  verification: {
    google: "seu-codigo-de-verificacao-aqui", // Atualizar após configurar Google Search Console
    // yandex: "seu-codigo-yandex",
    // bing: "seu-codigo-bing",
  },
};

// Função auxiliar para criar metadata de páginas específicas
export function createPageMetadata({
  title,
  description,
  path = "",
  keywords,
  ogImage,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;
  const ogImageUrl = ogImage || DEFAULT_OG_IMAGE.url;

  return {
    title,
    description: description || SITE_DESCRIPTION,
    keywords: keywords || SITE_KEYWORDS,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: description || SITE_DESCRIPTION,
      url,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || SITE_DESCRIPTION,
      images: [ogImageUrl],
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : undefined,
  };
}

// Schema.org JSON-LD para rich snippets
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    availableLanguage: ["Portuguese", "English"],
  },
  sameAs: [
    `https://twitter.com/${SOCIAL_LINKS.twitter}`,
    `https://www.linkedin.com/${SOCIAL_LINKS.linkedin}`,
    `https://www.instagram.com/${SOCIAL_LINKS.instagram}`,
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "pt-BR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/busca?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};
