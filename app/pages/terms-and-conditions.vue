<script setup lang="ts">
useSeo({});
const { getTermsPage, termsPage, sellerTerms } = usePages();
await getTermsPage();
definePageMeta({
  prerender: true,
});
const activeTap = ref<string>("customers");
</script>
<template>
  <div class="page-content">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1>{{ $t("links.terms") }}</h1>
          <div class="users">
            <button
              @click.prevent="activeTap = 'customers'"
              type="button"
              :class="{ active: activeTap === 'customers' }"
              class="me-3"
            >
              {{ $t("general.customers") }}
            </button>
            <button
              @click.prevent="activeTap = 'seller'"
              type="button"
              :class="{ active: activeTap === 'seller' }"
            >
              {{ $t("general.seller") }}
            </button>
          </div>
          <div
            v-show="activeTap === 'customers'"
            v-html="termsPage?.resource?.html"
          ></div>
          <div
            v-show="activeTap === 'seller'"
            v-html="sellerTerms?.resource?.html"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-content {
  margin-top: 40px;

  h1 {
    color: #4a4a4a;
    font-weight: 700;
    font-size: 24px;
  }

  .users {
    margin: 20px 0;

    button {
      background-color: transparent;
      width: 108px;
      height: 40px;
      border: 1px solid #d1d1d1;
      border-radius: 8px;
      transition: var(--trans);
      color: #4a4a4a;

      &.active,
      &:hover {
        color: var(--main-color);
        border-color: var(--main-color);
      }
    }
  }
}
</style>
