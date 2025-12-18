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
  return {
    getFavCount,
    favCount,
  };
};
