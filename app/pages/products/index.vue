<script setup lang="ts">
useSeo({});
definePageMeta({});

const route = useRoute();

const category_id = computed(() => {
  return route.query.category_id;
});

const { getProducts, productsRes } = useProducts();
await getProducts();

let prodcuts = productsRes?.value?.resources ?? [];
watch(category_id, async () => {
  await getProducts();
});
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink
          active-class="active"
          :href="$localePath(`/products?category_id=${category_id}`)"
        >
          {{ $t("links.prodcuts") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <ProductsCategsFilter :activeCateg="category_id" />
        </div>
        <div class="col-md-9">
          <div class="row">
            <div
              class="col-md-3 mb-4"
              v-for="(product, i) in prodcuts"
              :key="i"
            >
              <ProductCard :product="product" />
            </div>
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
