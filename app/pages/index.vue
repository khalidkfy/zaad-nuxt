<script setup lang="ts">
const { t, locale } = useI18n();
const config = useRuntimeConfig();

definePageMeta({
  // prerender: true, // statically generated at build time
});

const baseUrl = config.public.baseUrl;

const { getPage1, categoryProducts, bestSales } = usePages();
await getPage1();

const localizedPrefix = locale.value === "en" ? "/en" : "";

const bestSellerProducts = bestSales.value?.data;

const bestSellerSchema = bestSellerProducts?.length
  ? {
      "@type": "ItemList",
      "@id": `${baseUrl}#best-sellers`,
      name: locale.value === "en" ? "Best Selling Products" : "المنتجات الأكثر مبيعاً",
      itemListElement: bestSellerProducts.map((product: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}${localizedPrefix}/products/item/${product.id}`,
      })),
    }
  : null;

useSeo({
  title: t("meta.default.title"),
  jsonld: [bestSellerSchema].filter(Boolean),
});
</script>
<template>
  <!-- Slider -->
  <!-- <ClientOnly> -->
  <HomeSliders class="mt-4" />
  <!-- </ClientOnly> -->

  <!-- Features -->
  <LazyHomeFeatures />

  <!-- Best sales section -->
  <LazyHomeBestSales />

  <!-- Active Stores -->
  <LazyHomeActiveStores />

  <!-- Offers -->
  <LazyHomeOffers />

  <!-- CategoryProducts  -->
  <!-- <LazyHomeCategoryProducts flexDirection="row-reverse" /> -->

  <!-- Images Section -->
  <LazyHomePromotionsSection />

  <!-- CategoryProducts  -->
  <template v-for="(section, i) in categoryProducts" :key="i">
    <LazyHomeCategoryProducts
      :flexDirection="i % 4 === 2 || i % 4 === 3 ? 'row-reverse' : ''"
      :categoryProducts="section"
    />
  </template>

  <!-- Contact Actions -->
  <LazyHomeContactActions />
</template>
