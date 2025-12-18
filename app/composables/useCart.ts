export const useCart = () => {
  const { locale } = useI18n();

  const cartCount = ref(0);
  const getCartCount = async () => {
    try {
      const data = await $fetch("/api/cart/count", {
        headers: {
          Lang: locale.value,
        },
      });

      if (data?.cart_count) cartCount.value = data?.cart_count
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return {
    getCartCount,
    cartCount,
  };
};
