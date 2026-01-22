<script setup lang="ts">
const { getCategs } = useCategs();
const { getConstants, getFooter } = useConstants();

await getCategs();
await getConstants();
await getFooter();
</script>
<template>
  <AppHeader layout="auth" />

  <main>
    <LazyWhatsApp />
    <slot />
  </main>

  <AppFooter />
</template>
<style lang="scss" scoped></style>
