export const useCategs = () => {
  const { locale } = useI18n();

  const categs = useState("app-categs", () => []);

  const PRODUCT_CATEG_SLUG = "products";
  const SERVIVES_SLUG = "service";
  const productsCategs = computed(() => {
    if (!categs.value || !categs.value?.data?.length) return [];
    let product = categs.value.data.find(
      (item) => item.slug === PRODUCT_CATEG_SLUG
    );
    return product ? product.childrens : [];
  });

  const servicesCategs = computed(() => {
    if (!categs.value || !categs.value?.data?.length) return [];
    let product = categs.value.data.find(
      (item) => item.slug === SERVIVES_SLUG
    );
    return product ? product.childrens : [];
  });
  const getCategs = async () => {
    try {
      categs.value = await $fetch("/api/categs/get-categs", {
        headers: {
          Lang: locale.value,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return {
    categs,
    getCategs,
    productsCategs,
    servicesCategs
  };
};
