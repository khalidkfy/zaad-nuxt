<script setup lang="ts">
const { t, locale } = useI18n();
const config = useRuntimeConfig();

definePageMeta({
    // prerender: true, // statically generated at build time
});


const baseUrl = config.public.baseUrl;

useSeo({
    title:t("meta.default.title")
});

const { getPage1, categoryProducts } = usePages();
await getPage1();


/**
 * 1️⃣ Organization Schema
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Your Store Name",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  sameAs: [
    "https://facebook.com/yourstore",
    "https://instagram.com/yourstore"
  ]
}

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
        <LazyHomeCategoryProducts  :flexDirection="(i % 4 === 2 || i % 4 === 3) ? 'row-reverse' : ''" :categoryProducts="section" />

    </template>

    <!-- Contact Actions -->
    <LazyHomeContactActions />

</template>
