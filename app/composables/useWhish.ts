export const useWhish = () => {
  const { locale } = useI18n();

  const favCount = ref(0);
  const getFavCount = async () => {
    try {
      const data = await $fetch("/api/whish-list/count", {
        headers: {
          Lang: locale.value,
        },
      });
      if (data?.data?.favorites_count) favCount.value = data?.data?.favorites_count
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const addToWhishLoading = ref(false);
  const addToWhishErr = ref(false);
  const addToWhish = async (itemId: any, quantity: any = 1) => {
    addToWhishErr.value = false;
    addToWhishLoading.value = true;
    try {
      const data = await $fetch("/api/whish-list/add", {
        method: 'POST',
        headers: {
          Lang: locale.value,
        },
        body: {
          item_id: itemId,
          quantity
        }
      });

      console.log(data, "whish dataasf");


    } catch (error) {
      addToWhishErr.value = true;
      console.error(error.data);
      toast.error({
        title: t("submit.error"),
        message: t("cart.authErr"),
        rtl: locale.value === "ar",
      });

    } finally {
      addToWhishLoading.value = false;
    }
  }
  return {
    getFavCount,
    favCount,
    addToWhishLoading,
    addToWhishErr,
    addToWhish,
  };
};
