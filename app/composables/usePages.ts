export const usePages = () => {
  const { locale } = useI18n();
  // index page
  const pageOne = useState("main-page-1", () => []);

  const carouselItems = computed(() => {
    if (!pageOne.value) return [];

    const sections = pageOne?.value.resource.sections;
    const mainCarousel = sections.find((item) => item.slug === "main-carousel");

    if (!mainCarousel) return [];

    return mainCarousel.items;
  });
  const bestSales = computed(() => {
    if (!pageOne.value) return {};

    const sections = pageOne?.value.resource.sections;
    const bestSalesSection = sections.find((item) => item.slug === "top-sales");

    if (!bestSalesSection) return {};

    return bestSalesSection;
  });
  const siteFacts = computed(() => {
    if (!pageOne.value) return {};

    const sections = pageOne?.value.resource.sections;
    const siteFactsSection = sections.find(
      (item) => item.slug === "site-facts"
    );

    if (!siteFactsSection) return {};

    return siteFactsSection.items;
  });
  const categoryProducts = computed(() => {
    if (!pageOne.value) return {};

    const sections = pageOne?.value.resource.sections;
    const categoryProductsSections = sections.filter(
      (item) => item.type === "category-products"
    );

    if (!categoryProductsSections) return {};

    return categoryProductsSections;
  });

  const topSellersSection = computed(() => {
    if (!pageOne.value) return {};

    const sections = pageOne?.value.resource.sections;
    const topSellers = sections.find(
      (item) => item.type === "stores" && item.slug === "top-sellers"
    );

    if (!topSellers) return {};

    return topSellers;
  });

  const dealsSection = computed(() => {
    if (!pageOne.value) return {};

    const sections = pageOne?.value.resource.sections;
    const deals = sections.find(
      (item: any) => item.type === "deals" && item.slug === "deals"
    );

    if (!deals) return {};

    return deals;
  });
  const promotionsSection = computed(() => {
    if (!pageOne.value) return {};

    const sections = pageOne?.value.resource.sections;
    const promotions = sections.find(
      (item: any) => item.type === "promotions" && item.slug === "promotions"
    );

    if (!promotions) return {};

    return promotions;
  });

  const getPage1 = async () => {
    try {
      pageOne.value = await $fetch("/api/pages/get-page-1", {
        headers: {
          Lang: locale.value,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  // index page
  // privacyPage
  const privacyPage = useState("privacy-page", () => []);
  const getPrivacyPage = async () => {
    try {
      privacyPage.value = await $fetch("/api/pages/privacy", {
        headers: {
          Lang: locale.value,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  // privacyPage
  // termsPage
  const termsPage = useState("terms-page", () => []);
  const sellerTerms = useState("sellerTerms", () => []);
  const getTermsPage = async () => {
    try {
      termsPage.value = await $fetch("/api/pages/terms", {
        headers: {
          Lang: locale.value,
        },
      });
      sellerTerms.value = await $fetch("/api/pages/seller-terms", {
        headers: {
          Lang: locale.value,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  // termsPage
  // returnPage
  const returnPage = useState("returnPage", () => []);
  const getReturnPage = async () => {
    try {
      returnPage.value = await $fetch("/api/pages/return-policy", {
        headers: {
          Lang: locale.value,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  // returnPage

  // about page
  const aboutPage = useState("aboutPage", () => []);
  const getAboutPage = async () => {
    try {
      aboutPage.value = await $fetch("/api/pages/about", {
        headers: {
          Lang: locale.value,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  // about page

  return {
    getPage1,
    pageOne,
    carouselItems,
    bestSales,
    getPrivacyPage,
    privacyPage,
    getTermsPage,
    termsPage,
    sellerTerms,
    returnPage,
    getReturnPage,
    siteFacts,
    categoryProducts,
    aboutPage,
    getAboutPage,
    topSellersSection,
    dealsSection,
    promotionsSection,
  };
};
