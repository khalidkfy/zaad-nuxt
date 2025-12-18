<script setup lang="ts">
const {  getCategs } = useCategs();

await getCategs();
</script>
<template>

     <AppHeader />



     <main>

          <LazyAppCategories />

          <LazyWhatsApp />
          <slot />
     </main>


     <AppFooter />
</template>
<style lang="scss" scoped></style>