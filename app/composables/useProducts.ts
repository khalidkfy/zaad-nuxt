export interface Product {
  id: number;
  title: string;
  src: string;
  logo: string;
  type: string;
  discount?: string;
  slug: string;
  categ: string;
  regular_price: number;
  sale_price: number;
  sold: number;
  quantity: number;
  cart_item: boolean;
  favorite_item: boolean;
  price: number;
  quantity_is_available: number;
  seller: object;
}


export const useProducts = () => {
  const { locale } = useI18n();


  const getProductsLoading = ref(false);
  const productsRes = ref({
    filters: [],
    resources: [],
    next_page_url: null,
    prev_page_url: null,
  });

  const currentPage = ref(1)

  const hasMore = ref(false);
  const getProducts = async (options: {
    categId: any, append?: boolean, search: any
  }, filters: any) => {
    try {
      getProductsLoading.value = true

      let reqQuery = {
        page: currentPage.value ?? 1,
      }
      if (!options?.append) {
        reqQuery.page = 1;
      }

      if (options.categId) {
        reqQuery.category_id = options.categId || null
      }


      if (filters) {
        reqQuery = {
          ...reqQuery,
          ...filters
        }
      }

      if (options?.search?.length) {
        reqQuery.search = options.search
      }
      const res = await $fetch("/api/products/list", {
        headers: {
          Lang: locale.value,
        },
        query: reqQuery
      });


      hasMore.value = res?.next_page_url.length > 0;

      if (options?.append) {
        productsRes.value.resources.push(...res.resources);
      } else {
        productsRes.value = res;
      }

    } catch (error) {
      console.log(error);
    } finally {
      getProductsLoading.value = false

    }
  }

  // Validate coupons
  const validateCouponLoading = ref(false);
  const validateCouponRes = ref(null);
  const validateCoupon = async (coupon: string, requestItems: any) => {
    try {
      validateCouponLoading.value = true
      validateCouponRes.value = null;

      const res = await $fetch("/api/products/validate-coupon", {
        method: "POST",
        body: {
          code: coupon,
          items: requestItems
        },
        headers: {
          Lang: locale.value,
        },
      });

      validateCouponRes.value = res;
    } catch (error) {
      console.log(error);
    } finally {
      validateCouponLoading.value = false

    }
  }

  const productDetails = ref(null);
  const productRates = ref(null);

  const getProductDetailsLoading = ref(false);
  const getProductDetails = async (id: any) => {
    try {
      getProductDetailsLoading.value = true

      const res = await $fetch("/api/products/details", {
        headers: {
          Lang: locale.value,
        },
        query: {
          item_id: id
        }
      });


      productDetails.value = res?.resource
      productRates.value = res?.rates


    } catch (error) {
      console.log(error);
    } finally {
      getProductDetailsLoading.value = false

    }
  }

  return {
    getProducts,
    productsRes,
    getProductsLoading,
    currentPage,
    hasMore,
    productDetails,
    getProductDetailsLoading,
    getProductDetails,
    validateCoupon,
    validateCouponRes,
    validateCouponLoading,
    productRates,
  };
};
