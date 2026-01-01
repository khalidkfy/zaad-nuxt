export const useCart = () => {
  const { t, locale } = useI18n();
  const toast = useToast();

  const cartCount = useState('cartCount', () => 0);
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

  const addToCartLoading = ref(false);
  const addToCartErr = ref(false);
  const addToCart = async (itemId: any, quantity: any = 1) => {
    addToCartErr.value = false;
    addToCartLoading.value = true;
    try {
      const data = await $fetch("/api/cart/add", {
        method: 'POST',
        headers: {
          Lang: locale.value,
        },
        body: {
          item_id: itemId,
          quantity
        }
      });

      if (data?.data.item_id && !data?.error.length) {
        toast.success({
          title: t("submit.success"),
          message: `${t("cart.addSuccess")} - ${data?.data.title}`,
          rtl: locale.value === "ar",
        });

        await getCartCount();
      }

    } catch (error) {
      addToCartErr.value = true;
      console.error(error.data);

      if (error?.data?.statusCode == 401) {
        toast.error({
          title: t("submit.error"),
          message: t("cart.authErr"),
          rtl: locale.value === "ar",
        });
        return;
      }
      toast.error({
        title: t("submit.error"),
        message: error?.data?.data?.error,
        rtl: locale.value === "ar",
      });

    } finally {
      addToCartLoading.value = false;
    }
  }

  const getCartItemsLoading = ref(true);
  const cartItems = ref([])
  const getCartItems = async () => {
    getCartItemsLoading.value = true;
    try {
      const data = await $fetch("/api/cart/items", {
        headers: {
          Lang: locale.value,
        },
      });
      console.log(data?.data, "data?.datadata?.data");

      if (data?.data?.cart?.length) {
        cartItems.value = data?.data?.cart;
      }
      console.log(data, "datadatadata");


    } catch (error) {
      addToCartErr.value = true;


    } finally {
      getCartItemsLoading.value = false;
    }
  }

  const deleteCartLoading = ref(false);
  const deleteCartErr = ref(false);
  const deleteFromCart = async (item: any) => {
    deleteCartErr.value = false;
    deleteCartLoading.value = true;
    try {
      const data = await $fetch("/api/cart/delete", {
        method: 'delete',
        headers: {
          Lang: locale.value,
        },
        body: {
          item_id: item?.item_id
        }
      });

      toast.success({
        title: t("submit.success"),
        message: `${t("cart.removeSuccess")} - ${item.title}`,
        rtl: locale.value === "ar",
      });
      await getCartCount();
      await getCartItems();

    } catch (error) {
      deleteCartErr.value = true;
      console.error(error.data);



    } finally {
      deleteCartLoading.value = false;
    }
  }

  return {
    getCartCount,
    cartCount,
    addToCart,
    addToCartLoading,
    addToCartErr,
    getCartItemsLoading,
    getCartItems,
    cartItems,
    deleteFromCart,
    deleteCartLoading,
    deleteCartErr
  };
};
