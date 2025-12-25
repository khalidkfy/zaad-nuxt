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
  const productsRes = useState<any>("products-items-list", () => ({
    filters: [],
    resources: [],
    next_page_url: null,
    prev_page_url: null,
  }))

  const getProducts = async (options: {
    categId: any, append?: boolean
  }) => {
    try {
      getProductsLoading.value = true

      const res = await $fetch("/api/products/list", {
        headers: {
          Lang: locale.value,
        },
        query: {
          category_id: options.categId || null,
        }
      });

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

  return {
    getProducts,
    productsRes,
    getProductsLoading
  };
};
