<script setup lang="ts">
const { t, locale } = useI18n();

useSeo({
  title: t("whish.title"),
});

const { getItems } = useWhish();

await getItems();
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/whish-list`)">
          {{ $t("whish.title") }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.breadcrumbs {
  display: flex;

  a {
    font-size: 14px;
    color: #888888;
    transition: var(--trans);
    font-weight: 500;

    &:hover {
      color: #4a4a4a;
    }

    &.active {
      color: #4a4a4a;
      font-weight: 600;
    }
  }

  div {
    color: #888888;
    margin: 0 7px;
  }
}
</style>
