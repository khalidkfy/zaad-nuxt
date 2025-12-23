export interface Product {
  id: number;
  title: string;
  src: string;
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
  const productsRes = useState("products-items-list", () => [])
  const getProducts = async () => {
    try {
      productsRes.value = await $fetch("/api/products/list", {
        headers: {
          Lang: locale.value,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  return {
    getProducts,
    productsRes 
  };
};
