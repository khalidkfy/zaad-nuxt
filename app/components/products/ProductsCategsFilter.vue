<script setup lang="ts">
const { productsCategs } = useCategs();
const props = defineProps({
  activeCateg: {
    required: false,
  },
});
</script>
<template>
  <div class="products-categ-filter">
    <p class="title">{{ $t("categs.allCategs") }}</p>
    <div class="categs">
      <div v-for="(categ, i) in productsCategs" :key="i">
        <NuxtLink
          :class="{ active: activeCateg == categ.id }"
          :href="$localePath(`/products?category_id=${categ.id}`)"
        >
          <NuxtImg
            :src="
              activeCateg == categ.id
                ? '/assets/images/check.svg'
                : '/assets/images/nocheck.svg'
            "
            width="18"
            height="18"
            alt="check"
          />
          <span>{{ categ?.name }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.products-categ-filter {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 10px;
  position: sticky;
  top: 12px;
  p.title {
    color: #4a4a4a;
    font-weight: 500;
  }
  .categs {
    display: flex;
    flex-direction: column;
    gap: 10px;
    a {
      color: #4a4a4a;
      font-size: 14px;
      font-weight: 500;
      margin-inline-start: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      &.active {
        color: var(--main-color);
      }
    }
  }
}
</style>
