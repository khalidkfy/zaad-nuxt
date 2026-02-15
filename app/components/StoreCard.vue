<script setup lang="ts">
const props = defineProps({
  store: {
    required: true,
  },
});

const fallback = "/assets/images/logo/zaad-logo.svg"; // put in /public/images

const imageSrc = ref(props.store?.logo || fallback);
const onError = () => {
  imageSrc.value = fallback;
};
</script>
<template>
  <NuxtLink :href="$localePath(`/stores/products/${store?.id}`)" class="store-card">
    <NuxtImg
      loading="lazy"
      width="50"
      height="50"
      :title="store?.name"
      :alt="store?.name"
      :src="imageSrc"
      @error="onError"
    ></NuxtImg>
    <span>{{ store.name }}</span>
  </NuxtLink>
</template>
<style lang="scss" scoped>
.store-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: #f9f9f9;
  padding: 12px 15px;
  border-radius: 8px;
  transition: var(--trans);
  min-width: 100px;
  text-decoration: none;

  @media (max-width: 768px) {
    min-width: 90px;
    padding: 10px;
  }

  @media (max-width: 576px) {
    min-width: 85px;
    padding: 8px;
  }

  span {
    color: #4a4a4a;
    font-size: 13px;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 12px;
    }
  }

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 6px;

    @media (max-width: 768px) {
      width: 35px;
      height: 35px;
    }
  }

  &:hover {
    background: #fff;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}
</style>
