<script setup lang="ts">
const { cartCount, getCartCount } = useCart();
const props = defineProps({
  showText: {
    type: Boolean,
    default: true,
  },
});
await getCartCount();
</script>
<template>
  <NuxtLink
    area-label="Cart"
    :href="$localePath('shopping-cart')"
    class="cart-header"
  >
    <img
      loading="lazy"
      class="me-2"
      width="28"
      height="28"
      alt="location"
      src="/assets/images/cart.svg"
    />
    <div class="cart">
      <span class="cart-badge">{{ cartCount }}</span>
      <span v-if="showText">{{ $t("cart.title") }}</span>
    </div>
  </NuxtLink>
</template>
<style scoped lang="scss">
.cart-header {
  display: flex;
  align-items: center;

  .cart {
    display: flex;
    flex-direction: column;
    color: #4a4a4a;
    font-size: 12px;
    font-weight: 600;
    margin-top: 3px;

    .cart-badge {
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
