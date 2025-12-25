<script setup lang="ts">
const { t, locale } = useI18n();
const { productsCategs } = useCategs();
const route = useRoute();

const category_id = computed(() => {
  return route.params.categoryId;
});
// definePageMeta({});
const activeCategory = productsCategs.value.find(
  (item: any) => item.id == category_id.value
);

useSeo({
  title: category_id.value
    ? `${t("links.products")} - ${activeCategory?.name}`
    : t("links.products"),
});

console.log(productsCategs.value);

console.log(activeCategory, ".find");

const { getProducts, productsRes, getProductsLoading } = useProducts();
await getProducts({ categId: category_id.value });

const products = computed(() => productsRes.value.resources);
const hasMore = computed(() => !!productsRes.value.next_page_url);

const loadMore = async () => {
  if (!productsRes.value.next_page_url) return;

  await getProducts({
    categId: category_id.value,
    append: true,
  });
};
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink
          active-class="active"
          :href="$localePath(`/products/${category_id}`)"
        >
          {{ $t("links.products") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4">
          <ProductsCategsFilter :activeCateg="category_id" />
        </div>
        <div class="col-md-9">
          <div class="row">
            <div
              class="col-sm-3 col-6 mb-4"
              v-for="(product, i) in products"
              :key="i"
            >
              <ProductCard :product="product" />
            </div>
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
  </section>
</template>
<style scoped lang="scss">
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
