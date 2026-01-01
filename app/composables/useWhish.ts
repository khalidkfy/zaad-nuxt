export const useWhish = () => {
  const { t, locale } = useI18n();
  const toast = useToast();
  const favCount = useState('favCount', () => 0);

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
      await getFavCount();


    } catch (error) {
      addToWhishErr.value = true;

      if (error?.data?.statusCode == 401) {
        toast.error({
          title: t("submit.error"),
          message: t("whish.authErr"),
          rtl: locale.value === "ar",
        });
        return;
      }

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
  const whishItems = ref([]);
  const getItems = async () => {
    getItemsLoading.value = true;
    try {
      const data = await $fetch("/api/whish-list/items", {
        headers: {
          Lang: locale.value,
        },
      });
      whishItems.value = data?.data;


    } catch (error) {


    } finally {
      getItemsLoading.value = false;
    }
  }


  const removeWhishLoading = ref(false);
  const removeWhishErr = ref(false);
  const removeFromWhish = async (item: any, mode = 'item') => {
    removeWhishErr.value = false;
    removeWhishLoading.value = true;

    let id;

    if (mode === 'item') {
      id = item?.item_id
    } else if (mode === 'product') {
      id = item?.id
    } else if (mode === 'product_id') {
      id = item?.product_id
    }
    try {
      const data = await $fetch("/api/whish-list/remove", {
        method: 'delete',
        headers: {
          Lang: locale.value,
        },
        body: {
          item_id: id
        }
      });

      toast.success({
        title: t("submit.success"),
        message: `${t("whish.removeSuccess")} - ${item.title}`,
        rtl: locale.value === "ar",
      });

      await getFavCount();
    } catch (error) {
      removeWhishErr.value = true;
      console.error(error.data);



    } finally {
      removeWhishLoading.value = false;
    }
  }
  return {
    getFavCount,
    favCount,
    addToWhishLoading,
    addToWhishErr,
    addToWhish,
    getItems,
    getItemsLoading,
    whishItems,
    removeFromWhish,
    removeWhishLoading,
    removeWhishErr,
  };
};
