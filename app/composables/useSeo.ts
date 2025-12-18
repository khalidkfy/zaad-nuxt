export interface SeoMeta {
  title?: string;
  description?: string;
  canonical?: string;
  og_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  og_image_width?: string;
  og_image_height?: string;
  twitter_card?: string;
  twitter_site?: string;
  twitter_creator?: string;
  jsonld?: Record<string, any> | Record<string, any>[]; // one or multiple
  breadcrumbs?: { label: string; url: string }[];
  keywords?: string;
  twitter_desc?: string;
  twitter_image?: string;
}

export const useSeo = (meta: SeoMeta) => {
  const route = useRoute();
  const { locale, t } = useI18n();
  const ogLocaleMap: Record<string, string> = {
    en: "en_US",
    ar: "ar_AR",
  };
  const currentOgLocale = ogLocaleMap[locale.value] || "en_US";
  const allOgLocales = Object.values(ogLocaleMap).filter(
    (l) => l !== currentOgLocale
  );

  const config = useRuntimeConfig();
  // const baseUrl = "zaad.com";
  const baseUrl = config.public.baseUrl ?? "zaad.com";

  const baseGraph = [
    {
      "@type": "Organization",
      "@id": "https://www.zaad.com/#organization",
      name: "Zaad",
      url: "https://www.zaad.com",
      logo: "https://www.zaad.com/assets/images/svg/Logo-for-desktop.svg",
      copyrightYear: "2025",
      copyrightHolder: {
        "@type": "Organization",
        name: "zaad",
      },
      description:
        "zaad description",
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@zaad.com",
        contactType: "support center",
        areaServed: "Worldwide",
        availableLanguage: [
          { "@type": "Language", name: "English" },
          { "@type": "Language", name: "Arabic" },
        ],
      },
      sameAs: [
        "https://www.facebook.com/zaad/",
        "https://www.instagram.com/zaad/",
        "https://x.com/zaad",
        "https://www.youtube.com/channel/zaad",
        "https://www.linkedin.com/company/zaadapp",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.zaad.com/#website",
      name: "zaad  ",
      url: "https://www.zaad.com",
      description:
        " ",
    },
  ];

  const breadcrumbs = meta.breadcrumbs;

  if (breadcrumbs?.length) {
    baseGraph.push({
      "@type": "BreadcrumbList",
      "@id": `https://www.zaad.com${route.path}#breadcrumbs`,
      itemListElement: breadcrumbs.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: crumb.label,
        item: crumb.url,
      })),
    });
  }

  if (meta.jsonld) {
    if (Array.isArray(meta.jsonld)) {
      baseGraph.push(...meta.jsonld);
    } else {
      baseGraph.push(meta.jsonld);
    }
  }

  const finalJsonLd = {
    "@context": "https://schema.org",
    "@graph": baseGraph,
  };

  let path = route.fullPath.replace(/^\/(en|ar)/, "");
  useHead({
    title: meta.title || t("meta.default.title"),
    meta: [
      // Basic
      {
        name: "description",
        content: meta.description || t("meta.default.desc"),
      },
      {
        name: "theme-color",
        content: "#004A98",
        media: "(prefers-color-scheme: dark)",
      },
      {
        name: "theme-color",
        content: "#004A98",
        media: "(prefers-color-scheme: dark)",
      },
      {
        name: "msvalidate.01",
        content: "EF022A48B7D836C010F933D493ADD18C",
      },
      {
        name: "mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Zaad",
      },
      { name: "referrer", content: "no-referrer-when-downgrade" },
      meta.keywords
        ? { name: "keywords", content: meta.keywords }
        : { name: "keywords", content: meta.keywords },
      // should ignoore for some pages like profile -> content: "noindex, nofollow"
      { name: "robots", content: "index, follow" },
      { name: "application-name", content: "Zaad" },

      // Open Graph
      {
        property: "og:title",
        content: meta.og_title || meta.title || t("meta.default.title"),
      },
      {
        property: "og:description",
        content:
          meta.og_description ||
          meta.description ||
          t("meta.default.desc"),
      },
      // handle per page og:image, og:image:width, og:image:height
      meta.og_image
        ? { property: "og:image", content: meta.og_image }
        : "https://zaad.com/assets/images/logos/logo.png",
      meta.og_image
        ? { property: "og:image:width", content: meta.og_image_width }
        : { property: "og:image:width", content: 1200 },
      meta.og_image
        ? { property: "og:image:height", content: meta.og_image_height }
        : { property: "og:image:height", content: 630 },
      { property: "og:type", content: meta.og_type || "website" },

      // NEED TO HANDLE PER PAGE og:url
      {
        property: "og:url",
        content: `${baseUrl}${route.fullPath}`,
      },
      {
        property: "og:site_name",
        content: `Zaad`,
      },
      {
        property: "og:locale",
        content: currentOgLocale,
      },
      {
        property: "og:locale:alternate",
        content: allOgLocales,
      },
      {
        property: "og:type",
        content: "website",
      },

      // Twitter
      meta.twitter_card
        ? { name: "twitter:card", content: meta.twitter_card }
        : { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:description", content: meta.twitter_desc },
      { name: "twitter:site", content: "@Zaad" },
      {
        name: "twitter:image",
        content: meta?.twitter_image ?? ''
      },
    ].filter(Boolean),
    link: [
      // canonical
      {
        rel: "canonical",
        href: `${baseUrl}${locale.value == "en" ? "" : "/ar"}${path}`,
      },
      // hreflangs
      { rel: "alternate", hreflang: "en", href: `${baseUrl}${path}` },
      { rel: "alternate", hreflang: "ar", href: `${baseUrl}/ar${path}` },
      { rel: "alternate", hreflang: "x-default", href: `${baseUrl}${path}` },
    ].filter(Boolean),
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(finalJsonLd),
        tagPosition: "head",
        key: "ldjson",
      },
    ],
  });
};
