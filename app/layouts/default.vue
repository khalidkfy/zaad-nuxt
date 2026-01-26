<script setup lang="ts">
const { getCategs } = useCategs();
const { getConstants, getFooter } = useConstants();

await getCategs();
await getConstants();
await getFooter();
const { user, loggedIn, clear: logout } = useUserSession();
const { userAddresses, getProfileRes } = useProfile();

onMounted(() => {
  if (loggedIn.value && !userAddresses.value.length) {
    getProfileRes();
  }
});
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
