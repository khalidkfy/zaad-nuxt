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
  robots?: string;
  type?: "website" | "article" | "product" | "collection";
  noindex?: boolean;
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

  const baseUrl = config.public.baseUrl ?? `https://www.zaad.om`;

  const isSearch = typeof route.query.search === "string" && route.query.search.length > 0;

  const cleanPath = route.path; // removes query automatically

  const path = isSearch ? cleanPath : route.fullPath;

  // normalize accidental double locale
  const normalizedPath = path.replace(/^\/(en|ar)\/\1/, "/$1");

  const canonicalUrl = `${baseUrl}${normalizedPath}`;


  const baseGraph = [
    {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: "ZaadOman",
      url: baseUrl,
      logo: `${baseUrl}/assets/images/logo/zaad-logo.svg`,
      copyrightYear: "2025",
      copyrightHolder: {
        "@type": "Organization",
        name: "ZaadOman",
      },
      description: t("meta.default.desc"),
      contactPoint: {
        "@type": "ContactPoint",
        email: "rowwad.om2020@gmail.com", // support email
        contactType: "support center",
        areaServed: "Worldwide",
        availableLanguage: [
          { "@type": "Language", name: "English" },
          { "@type": "Language", name: "Arabic" },
        ],
      },
      sameAs: [
        "https://www.facebook.com/ZaadOman",
        "https://www.instagram.com/ZaadOman",
        "https://x.com/ZaadOman",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      name: "ZaadOman",
      inLanguage: locale.value,
      url: baseUrl,
      description: t("meta.default.desc"),
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}${locale.value === "en" ? "/en" : ""}/products?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
  ];

  const breadcrumbs = meta.breadcrumbs;

  if (breadcrumbs?.length) {
    baseGraph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumbs`,
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

  baseGraph.push({
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: meta.title || t("meta.default.title"),
    description: meta.description || t("meta.default.desc"),
    inLanguage: locale.value,
    isPartOf: {
      "@id": `${baseUrl}#website`,
    },

    publisher: {
      "@id": `${baseUrl}#organization`,
    },

    breadcrumb: meta.breadcrumbs?.length
      ? { "@id": `${canonicalUrl}#breadcrumbs` }
      : undefined,

    mainEntity: meta.type === "collection"
      ? { "@id": `${canonicalUrl}#collection` }
      : undefined,
  });

  const finalJsonLd = {
    "@context": "https://schema.org",
    "@graph": baseGraph,
  };



  // let path = route.fullPath.replace(/^\/(en|ar)/, "");
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
        content: "ZaadOman",
      },
      { name: "referrer", content: "no-referrer-when-downgrade" },
      meta.keywords
        ? { name: "keywords", content: meta.keywords }
        : { name: "keywords", content: t("meta.default.keywords") },
      // should ignoore for some pages like profile -> content: "noindex, nofollow"
      { name: "robots", content: meta.noindex ? "noindex, follow" : (meta.robots || "index, follow") }, { name: "application-name", content: "ZaadOman" },

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
        : { property: "og:image", content: `${baseUrl}/assets/images/logo/zaad-logo.svg` },
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
        content: canonicalUrl,
      },
      {
        property: "og:site_name",
        content: `ZaadOman`,
      },
      {
        property: "og:locale",
        content: currentOgLocale,
      },
      {
        property: "og:locale:alternate",
        content: allOgLocales,
      },


      // Twitter
      meta.twitter_card
        ? { name: "twitter:card", content: meta.twitter_card }
        : { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:description",
        content:
          meta.twitter_desc ||
          meta.description ||
          t("meta.default.desc"),
      },
      { name: "twitter:site", content: "@ZaadOman" },
      {
        name: "twitter:image",
        content: meta?.twitter_image ?? `${baseUrl}/assets/images/logo/zaad-logo.svg`
      },
    ].filter(Boolean),
    link: [
      // canonical
      {
        rel: "canonical",
        href: canonicalUrl,
      },
      // hreflangs
      { rel: "alternate", hreflang: "en", href: `${baseUrl}/en${cleanPath}` },
      { rel: "alternate", hreflang: "ar", href: `${baseUrl}${cleanPath}` },
      { rel: "alternate", hreflang: "x-default", href: `${baseUrl}${cleanPath}` },
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
