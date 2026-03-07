<script setup lang="ts">
const { t } = useI18n();

const {
  productsStoreItems,
  getProductsStoreItems,
  getProductsStoreItemsLoading: loading,
  hasMore,
  currentPage,
} = useStores();
const route = useRoute();
const id = route.params.id;

await getProductsStoreItems(id);

console.log(productsStoreItems.value);

if (!productsStoreItems.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "not found",
  });
}
const title = computed(() => {
  return [
    productsStoreItems?.value?.seller?.store_name,
    productsStoreItems?.value?.seller?.store_category,
    t("meta.appName")
  ]
    .filter(Boolean) // removes null, undefined, empty string
    .join(" - ");
});
useSeo({
  description: `${t("links.productsStores")} - ${productsStoreItems?.value?.seller?.store_name}`,
  // title: `${productsStoreItems?.value?.seller?.store_name}`,
  title: `${title.value}`,
  og_image: productsStoreItems?.value?.seller?.store_logo,
});
const seller = computed(() => {
  return productsStoreItems?.value?.seller;
});
const products = computed(() => {
  return productsStoreItems?.value?.items;
});

const handleWhishRemove = ({ item, value }) => {
  const product = products.value.find((p: any) => p.id === item.id);
  if (product) {
    product.favorite_item = value;
  }
};

const loadMore = async () => {
  if (!productsStoreItems.value.next_page_url) return;

  if (!hasMore.value) return;

  currentPage.value += 1;

  await getProductsStoreItems(id, true);
};
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
        <NuxtLink active-class="active" :href="$localePath(`/stores/products/${id}`)">
          {{ seller?.store_name }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4">
          <div class="seller-card">
            <NuxtImg width="100" height="100" :src="seller?.store_logo"></NuxtImg>
            <h1>{{ seller?.store_name }}</h1>
            <p>{{ seller?.store_address }}</p>
            <NuxtLink active-class="active" class="main-color" :href="$localePath(`/stores/${seller?.category_slug}`)">
              {{ seller?.store_category }}
            </NuxtLink>
          </div>
        </div>
        <div class="col-md-9">
          <template v-if="products?.length">
            <div class="row">
              <div class="col-sm-3 col-6 mb-4" v-for="(product, i) in products" :key="i">
                <ProductCard @removed="handleWhishRemove" :product="product" />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row text-center">
              <div class="col">
                <div class="mb-4">{{ $t("items.noData") }}</div>
                <NuxtLink :href="$localePath('/stores/products')" class="btn-zaad">{{ $t("links.productsStores") }}
                </NuxtLink>
              </div>
            </div>
          </template>

          <div class="text-center mt-4" v-if="hasMore">
            <button class="btn-zaad" :disabled="loading" @click="loadMore">
              <span v-if="loading">{{ $t("general.wait") }}</span>
              <span v-else>{{ $t("general.showMore") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scss lang="scss">
.seller-card {
  background-color: #f9f9f9;
  padding: 20px;
  display: flex;
  align-items: center;
  position: sticky;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px;
  top: 26px;

  h1 {
    color: #262626;
    font-size: 24px;
    margin: 10px 0;
  }

  img {
    background-color: #fff;
    border-radius: 50%;
    padding: 5px;
  }
}

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
</style>
