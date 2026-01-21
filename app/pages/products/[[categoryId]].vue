<script setup lang="ts">
const { t, locale } = useI18n();
const { productsCategs } = useCategs();
const route = useRoute();

const category_id = computed(() => {
  return route.params.categoryId;
});
// definePageMeta({});
const activeCategory = productsCategs.value.find(
  (item: any) => item.id == category_id.value,
);

useSeo({
  title: category_id.value
    ? `${t("links.products")} | ${activeCategory?.name}`
    : t("links.products"),
});

const { getProducts, productsRes, getProductsLoading, currentPage, hasMore } =
  useProducts();

const query = route.query;

await getProducts({
  categId: category_id.value,
  append: false,
  search: query?.search ?? "",
});

const products = computed(() => productsRes.value.resources);

const loadMore = async () => {
  if (!productsRes.value.next_page_url) return;

  if (!hasMore.value) return;

  currentPage.value += 1;

  await getProducts({
    categId: category_id.value,
    append: true,
    search: query?.search || pageSearch.value || "",
  });
};

const handleWhishRemove = ({ item, value }) => {
  const product = productsRes.value.resources.find(
    (p: any) => p.id === item.id,
  );
  if (product) {
    product.favorite_item = value;
  }
};

const pageSearch = ref("");
const filterItems = async (search: string) => {
  pageSearch.value = search;
  await getProducts({
    categId: category_id.value,
    append: false,
    search: search,
  });
};
</script>

<template>
  <!-- TODO:: h1 tag -->
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/products`)">
          {{ $t("links.products") }}
        </NuxtLink>
        <template v-if="category_id && activeCategory">
          <div>/</div>
          <NuxtLink
            active-class="active"
            :href="$localePath(`/products/${category_id}`)"
          >
            {{ activeCategory?.name }}
          </NuxtLink></template
        >
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4">
          <ProductsCategsFilter
            @filter="filterItems"
            :activeCateg="category_id"
          />
        </div>
        <div class="col-md-9">
          <ProductsFilter :filters="productsRes?.filters" />
          <div class="items-container">
            <div v-if="getProductsLoading" class="overlay-loader">
              <span class="indicator-progress f-normal fs-20">
                {{ t("general.wait") }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </div>
            <div class="row">
              <template v-if="products?.length">
                <div
                  class="col-sm-3 col-6 mb-4"
                  v-for="(product, i) in products"
                  :key="i"
                >
                  <ProductCard
                    @removed="handleWhishRemove"
                    :product="product"
                  />
                </div>
              </template>
              <template v-else>
                <div class="no-items">
                  <div>{{ $t("items.noData") }}</div>
                  <NuxtLink
                    :href="$localePath('/stores/products')"
                    class="btn-zaad"
                    >{{ $t("links.productsStores") }}</NuxtLink
                  >
                </div>
              </template>
            </div>
            <div class="text-center mt-4" v-if="hasMore">
              <button
                class="btn-zaad"
                :disabled="getProductsLoading"
                @click="loadMore"
              >
                <span v-if="getProductsLoading">{{ $t("general.wait") }}</span>
                <span v-else>{{ $t("general.showMore") }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.no-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  align-items: center;
  position: sticky;
  top: 100px;
}
.items-container {
  position: relative;
  margin-top: 15px;
  .overlay-loader {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 999999;
    background-color: #fff;
    opacity: 0.9;
    text-align: center;
    > span {
      margin-top: 40px;
      display: inline-block;
      position: sticky;
      top: 50%;
    }
  }
}
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
</style>
