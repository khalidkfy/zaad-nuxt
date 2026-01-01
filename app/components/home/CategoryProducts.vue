<script setup lang="ts">
// const { products } = useProducts();
const props = defineProps({
  flexDirection: String,
  categoryProducts: Object,
});

const getCategId = (categ) => {
  const text = categ.action;
  const params = new URLSearchParams(text.split("?")[1]);
  const categoryId = params.get("category_id");
  return categoryId;
};
</script>
<template>
  <section aria-label="marketing-section" class="marketing-section mt-5 pt-5">
    <div class="container">
      <div
        :style="{ 'flex-direction': flexDirection ? flexDirection : '' }"
        class="row mt-2"
      >
        <div class="col-md-3">
          <NuxtImg
            class="img-fluid w-100 h-100"
            :alt="categoryProducts?.title"
            :src="categoryProducts?.items[0]?.src"
          />
        </div>
        <div class="col-md-9">
          <div class="section-header mt-2 mb-3">
            <h3>{{ categoryProducts?.title || $t("general.keepShopping") }}</h3>
            <NuxtLink :href="$localePath(`/products/${getCategId(categoryProducts)}`)">{{
              categoryProducts?.action_title
            }}</NuxtLink>
          </div>
          <div aria-label="Section Products " class="d-flex overflow-hidden">
            <BaseProductsCarousel
              :items="categoryProducts?.data"
              :showControls="true"
              :carouselId="`category-${categoryProducts?.slug}-carousel`"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
