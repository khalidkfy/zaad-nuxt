<script setup lang="ts">
const {t} = useI18n();

useSeo({
  title: t("meta.setMeta", { meta: t("meta.pages.return.title") }),
  description: t("meta.pages.return.desc"),
});
const { getReturnPage, returnPage } = usePages();
await getReturnPage();
definePageMeta({
  prerender: true,
});
</script>
<template>
  <div class="page-content">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1>{{ $t("links.returnPolicy") }}</h1>
          <div v-html="returnPage?.resource?.html"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.page-content {
  margin-top: 40px;

  h1 {
    color: #4a4a4a;
    font-weight: 700;
    font-size: 24px;
  }
}

::marker {
  content: unset;
}
</style>
