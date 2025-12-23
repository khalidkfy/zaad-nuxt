<script setup lang="ts">
   useSeo({})
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
   .page-content {
      margin-top: 40px;
      h1 {
         color: #4A4A4A;
         font-weight: 700;
         font-size: 24px;
      }
   }
</style>
