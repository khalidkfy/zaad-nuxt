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
  const products = [
    {
      id: 1,
      name: "HP - لابتوب بشاشة لمس عالية الدقة مقاس 15.6 بوصة - معالج Intel Core i7 - سعة 16 جيجابايت",
      img: "/assets/images/laptop.svg",
      slug: "laptop",
      discount: "",
      categ: "الكترونيات",
      price: 219,
      discountedPrice: 499,
      customOffer: "الجمعة البيضاء",
    },
    {
      id: 2,
      name: "HP - لابتوب بشاشة لمس عالية الدقة مقاس 15.6 بوصة - معالج Intel Core i7 - سعة 16 جيجابايت",
      img: "/assets/images/laptopcase.svg",
      slug: "laptop",
      discount: "",
      categ: "الكترونيات",
      price: 219,
      discountedPrice: 499,
      customOffer: "الجمعة البيضاء",
    },
    {
      id: 3,
      name: "HP - لابتوب بشاشة لمس عالية الدقة مقاس 15.6 بوصة - معالج Intel Core i7 - سعة 16 جيجابايت",
      img: "/assets/images/tablets.svg",
      slug: "laptop",
      discount: "",
      categ: "الكترونيات",
      price: 219,
      discountedPrice: 499,
    },
    {
      id: 4,
      name: "HP - لابتوب بشاشة لمس عالية الدقة مقاس 15.6 بوصة - معالج Intel Core i7 - سعة 16 جيجابايت",
      img: "/assets/images/headphone.svg",
      slug: "laptop",
      discount: "70",
      categ: "الكترونيات",
      price: 219,
      discountedPrice: 499,
      customOffer: "الجمعة البيضاء",
    },
    {
      id: 5,
      name: "HP - لابتوب بشاشة لمس عالية الدقة مقاس 15.6 بوصة - معالج Intel Core i7 - سعة 16 جيجابايت",
      img: "/assets/images/watch.png",
      slug: "laptop",
      discount: "70",
      categ: "الكترونيات",
      price: 219,
      discountedPrice: 499,
    },
    {
      id: 6,
      name: "HP - لابتوب بشاشة لمس عالية الدقة مقاس 15.6 بوصة - معالج Intel Core i7 - سعة 16 جيجابايت",
      img: "/assets/images/glasses.png",
      slug: "laptop",
      discount: "70",
      categ: "الكترونيات",
      price: 219,
      discountedPrice: 499,
      customOffer: "الجمعة البيضاء",
    },
  ];

  return {
    products,
  };
};
