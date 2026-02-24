<script setup lang="ts">
const { t } = useI18n();

const route = useRoute();
const id = route.params.id;

// const loadMore = async () => {
//   if (!productsStoreItems.value.next_page_url) return;

//   if (!hasMore.value) return;

//   currentPage.value += 1;

//   await getProductsStoreItems(id, true);
// };

const {
  getCategoryStoresLoading: loading,
  getCategoryStores,
  categoryStores: data,
} = useStores();

await getCategoryStores(id);

useSeo({
  description: t("meta.pages.categoryStores.desc", { categ: data.value?.localeTitle }),
  title: t("meta.setMeta", {
    meta: `${t("links.productsStores")} - ${data.value?.localeTitle}`,
  }),
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
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/stores/${id}`)">
          {{ data?.localeTitle }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <h1 class="h1-title">{{ data?.localeTitle }}</h1>

      <div class="stores">
        <div class="row">
          <div class="col-md-2 mb-3" v-for="store in data?.stores?.data">
            <StoreCard class="h-100 w-100" :store="store" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scss lang="scss">
.breadcrumbs {
  display: flex;

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

.stores {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(12px, 4vw, 40px);
}
</style>
