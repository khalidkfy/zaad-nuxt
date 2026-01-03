<script setup lang="ts">
const route = useRoute();
const id = route.params.id;
const { t } = useI18n();
const { productDetails, getProductDetailsLoading, getProductDetails } =
  useProducts();

const {
  addToCart,
  addToCartLoading,
  deleteCartLoading,
  deleteFromCart,
  deleteSuccess,
  addSuccess,
} = useCart();

watch(deleteSuccess, (value) => {
  if (value) {
    isCartItem.value = false;
  }
});
watch(addSuccess, (value) => {
  if (value) {
    isCartItem.value = true;
  }
});

await getProductDetails(id);

useSeo({
  description:
    productDetails.value?.seo.description ||
    productDetails.value?.short_description,
  title: productDetails.value?.seo.title || productDetails.value?.title,
});

const galleryImages = computed(() => {
  const baseAlt = productDetails.value?.title;

  const allImages = [
    productDetails.value?.src,
    ...(productDetails.value?.images || []),
  ];

  return allImages.map((src, index) => ({
    src,
    alt: `${baseAlt} - ${t("general.img")} ${index + 1}`,
    width: 400,
    height: 400,
  }));
});

const qty = ref(productDetails?.value?.cart_count);
const isCartItem = ref(productDetails?.value?.cart_item);
const addQty = () => {
  if (qty.value == productDetails?.value?.quantity) return;
  qty.value += 1;
};
const subQty = () => {
  if (qty.value == 1) return;
  qty.value -= 1;
};

const activeTab = ref("desc");
const changeTab = (tab: string) => {
  activeTab.value = tab;
};
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/products`)">
          {{ $t("links.products") }}
        </NuxtLink>
        <div>/</div>
        <NuxtLink
          active-class="active"
          :href="$localePath(`/products/item/${id}`)"
        >
          {{ productDetails?.title }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4 details">
    <div class="container">
      <div class="row">
        <div class="col-md-7">
          <ProductGallery :product="productDetails" :images="galleryImages" />
        </div>
        <div class="col-md-5">
          <div class="info">
            <div>
              <NuxtLink
                class="categ"
                :href="$localePath(`/products/${productDetails?.category_id}`)"
                >{{
                  productDetails?.category?.title ||
                  productDetails?.category?.name
                }}</NuxtLink
              >
              <h1>{{ productDetails?.title }}</h1>
              <div class="mt-2 store">
                <span>{{ $t("general.by") }}</span>
                <NuxtLink
                  class="store"
                  :href="
                    $localePath(`/stores/products/${productDetails?.store?.id}`)
                  "
                  >{{ productDetails?.store?.name }}</NuxtLink
                >
              </div>
              <ProductRate class="my-4" />
              <div class="price">
                {{
                  $t("general.curr_value", {
                    value: productDetails?.regular_price,
                  })
                }}
              </div>
              <div>
                <div class="qty">
                  <div
                    :class="{ disabled: qty == 1 }"
                    @click.prevent="subQty()"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_142_912)">
                        <path
                          d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
                          :stroke="qty == 1 ? '#444C4E' : 'black'"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 12H15"
                          :stroke="qty == 1 ? '#444C4E' : 'black'"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_142_912">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span>{{ qty }}</span>
                  <div
                    :class="{ disabled: qty == productDetails?.quantity }"
                    @click.prevent="addQty()"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_142_907)">
                        <path
                          d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 12H15"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M12 9V15"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_142_907">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div class="remain">
                  {{ $t("general.remaining") }} {{ productDetails?.quantity }}
                </div>
              </div>
            </div>
            <div>
              <div class="terms">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clip-path="url(#clip0_117_1009)">
                    <path
                      d="M8 6H8.00667"
                      stroke="#F78400"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.33301 8H7.99967V10.6667H8.66634"
                      stroke="#F78400"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <path
                    d="M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8Z"
                    stroke="#F78400"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <defs>
                    <clipPath id="clip0_117_1009">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <div>
                  <p>{{ $t("general.termsWarn") }}</p>
                  <NuxtLink :href="$localePath('/terms-and-conditions')">{{
                    $t("links.terms")
                  }}</NuxtLink>
                </div>
              </div>
              <div class="mt-4 btns">
                <button v-if="isCartItem" class="btn-zaad">
                  {{ $t("general.buyNow") }}
                </button>
                <button
                  :disabled="addToCartLoading"
                  @click.prevent="addToCart(productDetails?.id, qty)"
                  class="btn-cart"
                  v-if="!isCartItem"
                >
                  <svg
                    v-if="!addToCartLoading"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                  >
                    <path
                      d="M15.3955 17.4792C16.0858 17.4792 16.6455 16.9195 16.6455 16.2292C16.6455 15.5389 16.0858 14.9792 15.3955 14.9792C14.7052 14.9792 14.1455 15.5389 14.1455 16.2292C14.1455 16.9195 14.7052 17.4792 15.3955 17.4792Z"
                      fill="#4A4A4A"
                      stroke="#4A4A4A"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.0625 17.4792C7.75283 17.4792 8.3125 16.9195 8.3125 16.2292C8.3125 15.5389 7.75283 14.9792 7.0625 14.9792C6.37214 14.9792 5.8125 15.5389 5.8125 16.2292C5.8125 16.9195 6.37214 17.4792 7.0625 17.4792Z"
                      fill="#4A4A4A"
                      stroke="#4A4A4A"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.3125 2.47917H17.4792L15.8125 11.6458H4.97917L3.3125 2.47917ZM3.3125 2.47917C3.17361 1.92361 2.47917 0.8125 0.8125 0.8125"
                      stroke="#4A4A4A"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.8118 11.6459H4.97852H3.50416C2.01723 11.6459 1.22852 12.2969 1.22852 13.3125C1.22852 14.3282 2.01723 14.9792 3.50416 14.9792H15.3952"
                      stroke="#4A4A4A"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span
                    v-else
                    class="spinner-border text-dark spinner-border-sm ms-2"
                  ></span>
                  {{ $t("cart.add") }}
                </button>
                <button
                  :disabled="addToCartLoading"
                  @click.prevent="
                    deleteFromCart({ item_id: productDetails?.id })
                  "
                  class="btn-cart remove"
                  v-else
                >
                  <svg
                    v-if="!deleteCartLoading"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                  >
                    <path
                      d="M15.3955 17.4792C16.0858 17.4792 16.6455 16.9195 16.6455 16.2292C16.6455 15.5389 16.0858 14.9792 15.3955 14.9792C14.7052 14.9792 14.1455 15.5389 14.1455 16.2292C14.1455 16.9195 14.7052 17.4792 15.3955 17.4792Z"
                      fill="#fff"
                      stroke="#fff"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.0625 17.4792C7.75283 17.4792 8.3125 16.9195 8.3125 16.2292C8.3125 15.5389 7.75283 14.9792 7.0625 14.9792C6.37214 14.9792 5.8125 15.5389 5.8125 16.2292C5.8125 16.9195 6.37214 17.4792 7.0625 17.4792Z"
                      fill="#fff"
                      stroke="#fff"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.3125 2.47917H17.4792L15.8125 11.6458H4.97917L3.3125 2.47917ZM3.3125 2.47917C3.17361 1.92361 2.47917 0.8125 0.8125 0.8125"
                      stroke="#fff"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.8118 11.6459H4.97852H3.50416C2.01723 11.6459 1.22852 12.2969 1.22852 13.3125C1.22852 14.3282 2.01723 14.9792 3.50416 14.9792H15.3952"
                      stroke="#fff"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span
                    v-else
                    class="spinner-border text-dark spinner-border-sm ms-2"
                  ></span>
                  {{ $t("cart.remove") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-7">
          <div class="product-tabs">
            <div
              @click.prevent="changeTab('rates')"
              :class="{ active: activeTab === 'rates' }"
              class="tab"
            >
              {{ $t("general.rates") }}
            </div>
            <div
              @click.prevent="changeTab('desc')"
              :class="{ active: activeTab === 'desc' }"
              class="tab"
            >
              {{ $t("general.desc") }}
            </div>
          </div>
          <hr />

          <div class="product-tab-content">
            <transition name="fade-slide" mode="out-in">
              <div :key="activeTab">
                <div v-if="activeTab === 'rates'">
                  
                </div>
                <div v-else>
                  <div v-html="productDetails?.description"></div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scss lang="scss">
.product-tabs {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  .tab {
    font-size: 18px;
    cursor: pointer;
    font-weight: 400;
    color: #888888;
    transition: var(--trans);
    &:hover {
      color: var(--main-color);
    }
    &.active {
      font-weight: 500;
      color: var(--main-color);
    }
  }
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

hr {
  // color: #EBEBEB;
  border: 1px solid #ebebeb;
}
.breadcrumbs {
  display: flex;

  a {
    font-size: 14px;
    color: #888888;
    transition: var(--trans);
    font-weight: 500;

    &:hover {
      color: #4a4a4a;
    }

    &.active {
      color: #4a4a4a;
      font-weight: 600;
    }
  }

  div {
    color: #888888;
    margin: 0 7px;
  }
}
.details {
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  a.categ {
    font-size: 14px;
    font-weight: 400;
    color: #4a4a4a;
    margin-bottom: 10px;
    display: inline-block;
    transition: var(--trans);
    &:hover {
      color: #888888;
    }
  }
  .store {
    span {
      font-size: 14px;
      font-weight: 500;
      color: #444c4e;
    }
  }
  a.store {
    font-size: 14px;
    font-weight: 500;
    padding: 0 7px;
    transition: var(--trans);
    color: var(--main-color);
    &:hover {
      text-decoration: underline;
    }
  }
  h1 {
    font-size: 24px;
    font-weight: 500;
    color: #1e1e1e;
  }
  .price {
    font-weight: 700;
    font-size: 24px;
    margin-top: 20px;
  }
  .qty {
    margin-top: 20px;
    display: inline-flex;
    background-color: rgba(210, 210, 210, 0.1019607843);
    gap: 8px;
    padding: 11px 15px;
    border: 1px solid #e6e6e6;
    border-radius: 13px;
    user-select: none;

    > div {
      cursor: pointer;
      transition: var(--trans);
      &.disabled {
        cursor: no-drop;
        svg {
          path {
            stroke: #444c4e;
          }
        }
      }
    }
    > span {
      font-weight: 700;
    }
  }
  .remain {
    display: inline-block;
    margin: 0 10px;
    font-size: 12px;
    font-weight: 400;
    color: #444c4e;
  }
  .terms {
    display: flex;
    align-items: center;
    color: #4a4a4a;
    gap: 8px;
    font-weight: 600;
    font-size: 12px;
    > div {
      display: flex;
      gap: 4px;
      p {
        margin: 0;
      }

      a {
        color: var(--main-color);
        transition: var(--trans);
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .btns {
    display: flex;
    gap: 12px;
    button {
      border-radius: 16px;
      width: 50%;
      padding: 15px;
      &.btn-cart {
        background-color: #fff;
        color: #4a4a4a;
        transition: var(--trans);
        font-size: 16px;
        font-weight: 400;
        border: 1px solid #cecece;
        outline: none;
        &.remove {
          background-color: #dc3545;
          color: #fff;
          &:hover {
            background-color: #bb2d3b;
            color: #fff;
          }
          svg {
          }
        }
        &:hover {
          background-color: #cecece;
          color: #000;
          svg {
            width: 20px;
            height: 20px;
          }
        }
        svg {
          margin-inline-end: 8px;
          transition: var(--trans);
        }
      }
    }
  }
}
</style>
