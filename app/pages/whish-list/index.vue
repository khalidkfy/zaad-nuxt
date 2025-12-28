<script setup lang="ts">
const { t, locale } = useI18n();

useSeo({
  title: t("whish.title"),
});

const { getItems, whishItems, getItemsLoading } = useWhish();

await getItems();
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/whish-list`)">
          {{ $t("whish.title") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div v-if="!getItemsLoading" class="row">
        <div
          class="col-sm-3 col-6 mb-4"
          v-for="(product, i) in whishItems"
          :key="i"
        >
          <ProductCard @removed="getItems()" styleFor="whish" :product="product" />
        </div>
      </div>
      <div v-else class="loader-container">
        <div class="content-loader"></div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.loader-container {
  margin: 50px;
  display: flex;
  justify-content: center;
  height: 100px;
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
