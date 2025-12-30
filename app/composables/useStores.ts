export const useStores = () => {


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

            console.log(res);
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

            console.log(res);
            servicesStores.value = res?.data
        

        } catch (error) {
            console.log(error);
        } finally {

        }
    }



    return {
        getProductsStores,
        productsStores,
        getServicesStores,
        servicesStores
    }
};