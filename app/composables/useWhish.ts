export const useWhish = () => {
  const { t, locale } = useI18n();
  const toast = useToast();
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

      toast.success({
        title: t("submit.success"),
        message: `${t("whish.addSuccess")}`,
        rtl: locale.value === "ar",
      });


    } catch (error) {
      addToWhishErr.value = true;
     
      toast.warning({
        title: t("submit.error"),
        message: t("whish.addErr"),
        rtl: locale.value === "ar",
      });

    } finally {
      addToWhishLoading.value = false;
    }
  }

  const getItemsLoading = ref(true);
  const getItems = async () => {
    getItemsLoading.value = true;
    try {
      const data = await $fetch("/api/whish-list/items", {
        headers: {
          Lang: locale.value,
        },
      });



    } catch (error) {


    } finally {
      getItemsLoading.value = false;
    }
  }
  return {
    getFavCount,
    favCount,
    addToWhishLoading,
    addToWhishErr,
    addToWhish,
    getItems,
    getItemsLoading
  };
};
