<script setup lang="ts">
const {  getCategs } = useCategs();

await getCategs();
</script>
<template>

     <AppHeader layout="auth"/>



     <main>

          <LazyWhatsApp />
          <slot />
     </main>


     <AppFooter />
</template>
<style lang="scss" scoped></style>