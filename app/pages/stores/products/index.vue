<script setup lang="ts">
const { t } = useI18n();

const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl ?? "https://www.zaad.om";
const localePath = useLocalePath();
const canonicalUrl = `${baseUrl}${localePath('/stores/products')}`;

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
const { getProductsStores, productsStores } = useStores();
await getProductsStores();


useSeo({
  title: t("meta.setMeta", { meta: t("links.productsStores") }),
  description: t("meta.pages.productsStores.desc"),

  type: "collection",

  jsonld: {
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#collection`,
    name: t("links.productsStores"),
    description: t("meta.pages.productsStores.desc"),

    hasPart: productsStores.value?.map((categ: any, index: number) => ({
      "@type": "ItemList",
      name: categ?.localeTitle,
       "@id": `${canonicalUrl}#${categ?.slug}`,

      itemListElement: categ?.stores?.slice(0, 6).map((store: any, i: number) => ({
        "@type": "ListItem",
        position: i + 1,
        name: store?.name,
        url: `${baseUrl}/stores/products/${store?.id}`,
      })),
    })),
  },
});
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/stores/products`)">
          {{ $t("links.productsStores") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div class="stores-content" aria-label="stores by category">
        <h1 class="h1-title">{{ $t("links.productsStores") }}</h1>

        <div class="row">
          <div class="col-lg-4 mb-4" v-for="(categ, i) in productsStores" :key="i">
            <div class="category">
              <div class="head">
                <h4>{{ categ?.localeTitle }}</h4>
                <NuxtLink :href="$localePath(`/stores/${categ?.slug}`)">
                  {{ $t("general.showMore") }}
                </NuxtLink>
              </div>
              <div class="content">
                <Swiper
                  :modules="[Navigation, Autoplay]"
                  :slides-per-view="3"
                  :slides-per-group="1"
                  :space-between="16"
                  :navigation="false"
                  :autoplay="{
                    delay: 3000,
                    disableOnInteraction: false,
                  }"
                  :loop="true"
                  :breakpoints="{
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    992: { slidesPerView: 3 },
                  }"
                  class="product-swiper"
                >
                  <SwiperSlide v-for="(store, i) in categ?.stores" :key="i">
                    <StoreCard :store="store" />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  flex-wrap: wrap;

  a {
    font-size: 14px;
    color: #888888;
    transition: var(--trans);
    font-weight: 500;

    &:hover {
      color: #4a4a4a;
    }

    &.active {
      color: #4a4a4a;
      font-weight: 600;
    }
  }

  div {
    color: #888888;
    margin: 0 7px;
  }
}
.h1-title {
  font-weight: 700;
  font-size: 24px;
  color: #4a4a4a;
  text-align: center;
  margin-bottom: 30px;
}
.stores-content {
  .category {
    background-color: #f9f9f9;
    padding: 20px 10px;
    border-radius: 16px;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h4 {
      color: #4a4a4a;
      font-size: 16px;
      font-weight: 600;
    }

    a {
      color: var(--main-color);
      font-weight: 600;
      font-size: 14px;
      transition: var(--trans);

      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
