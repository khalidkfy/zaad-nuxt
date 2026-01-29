<script setup lang="ts">
const {t} = useI18n();
useSeo({
  title: t("meta.setMeta", { meta: t("meta.pages.privacy.title") }),
  description:t("meta.pages.privacy.desc")
});
const { getPrivacyPage, privacyPage } = usePages();
await getPrivacyPage();
definePageMeta({
  prerender: true,
});
</script>
<template>
  <div class="page-content">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1>{{ $t("links.privacyPolicy") }}</h1>
          <div v-html="privacyPage?.resource?.html"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
::marker {
  content: unset;
}
.page-content {
  margin-top: 40px;
  h1 {
    color: #4a4a4a;
    font-weight: 700;
    font-size: 24px;
  }
}
</style>
