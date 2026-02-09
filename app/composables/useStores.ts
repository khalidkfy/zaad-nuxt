export const useStores = () => {
    //  TODO:: SERVICE STORE COMPOSABLE | PRODUCT STORE COMPOSABLE
    // products
    const { locale } = useI18n();

    const productsStores = ref([]);

    const getProductsStores = async () => {
        const { locale } = useI18n();

        try {

            const res = await $fetch("/api/stores/products", {
                headers: {
                    Lang: locale.value,
                },
                query: {

                }
            });

            productsStores.value = res?.data
            // hasMore.value = res?.next_page_url.length > 0;

            // if (options?.append) {
            //     productsRes.value.resources.push(...res.resources);
            // } else {
            //     productsRes.value = res;
            // }

        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    const productsStoreItems = ref([]);
    const getProductsStoreItemsLoading = ref(false);
    const hasMore = ref(false);
    const currentPage = ref(1)

    const getProductsStoreItems = async (store_id: any, append: boolean = false) => {
        getProductsStoreItemsLoading.value = true;
        try {

            const res = await $fetch("/api/stores/products/items", {
                headers: {
                    Lang: locale.value,
                },
                query: {
                    store_id,
                    per_page: 100,
                    page: currentPage.value ?? 1
                }
            });
            if (append) {
                productsStoreItems.value.items.push(...res.items);
            } else {
                productsStoreItems.value = res;
            }
            hasMore.value = res?.next_page_url.length > 0;


        } catch (error) {
            console.log(error);
        } finally {
            getProductsStoreItemsLoading.value = false;

        }
    }
    // services
    const servicesStores = ref([]);
    const getServicesStores = async () => {
        const { locale } = useI18n();

        try {

            const res = await $fetch("/api/stores/services", {
                headers: {
                    Lang: locale.value,
                },
                query: {

                }
            });

            servicesStores.value = res?.data


        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    const getCategoryStoresLoading = ref(true);
    const categoryStores = ref(null)
    const getCategoryStores = async (categId: any) => {
        try {
            getCategoryStoresLoading.value = true

            const res = await $fetch("/api/stores/products/category", {
                headers: {
                    Lang: locale.value,
                },
                query: {
                    categId: categId
                }
            });

           categoryStores.value = res?.data;
            


        } catch (error) {
            console.log(error);
        } finally {
            getCategoryStoresLoading.value = false;

        }
    }

    return {
        getProductsStores,
        productsStores,
        getServicesStores,
        servicesStores,
        productsStoreItems,
        getProductsStoreItems,
        getProductsStoreItemsLoading,
        hasMore,
        currentPage,
        getCategoryStoresLoading,
        getCategoryStores,
        categoryStores,
    }
};