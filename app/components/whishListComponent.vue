<script setup lang="ts">
const { getFavCount, favCount } = useWhish();
const props = defineProps({
  showText:{
    type: Boolean,
    default: true,
  }
})
await getFavCount();
</script>
<template>
  <NuxtLink
    area-label="Whish"
    :href="$localePath('whish-list')"
    class="whish-header"
  >
    <NuxtImg
      class="me-2"
      width="28"
      height="28"
      alt="location"
      src="/assets/images/whish.svg"
    />
    <div class="whish">
      <span class="whish-badge">{{ favCount }}</span>
      <span v-if="showText">{{ $t("whish.title") }}</span>
    </div>
  </NuxtLink>
</template>
<style scoped lang="scss">
.whish-header {
  display: flex;
  align-items: center;

  .whish {
    display: flex;
    flex-direction: column;
    color: #4a4a4a;
    font-size: 12px;
    font-weight: 600;
    margin-top: 3px;

    .whish-badge {
      color: #ffffff;
      background-color: var(--main-color);
      text-align: center;
      border-radius: 33px;
      padding: 0 8px;
      width: 30px;
    }
  }
}
</style>
