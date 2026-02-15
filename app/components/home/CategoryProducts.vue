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
        <div class="col-md-2 d-none d-md-block">
          <div class="category-side-image">
            <NuxtLink :href="$localePath(`/products/${getCategId(categoryProducts)}`)">
              <NuxtImg
                loading="lazy"
                :alt="categoryProducts?.title"
                :src="categoryProducts?.items[0]?.src"
              />
            </NuxtLink>
          </div>
        </div>
        <div class="col-12 col-md-10">
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
<style scoped lang="scss">
.category-side-image {
  height: 100%;
  overflow: hidden;
  > a {
    transition: var(--trans);
    &:hover {
      opacity: 0.8;
    }
  }
}

.category-side-image img {
  height: 100%;
  object-fit: cover;
  object-position: center; /* change to top if needed */
}
</style>
