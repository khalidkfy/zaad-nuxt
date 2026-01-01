<script setup lang="ts">
const { t, locale } = useI18n();
const { getCartItems, getCartItemsLoading, cartItems, deleteFromCart } =
  useCart();
useSeo({
  title: t("cart.title"),
});
definePageMeta({
  middleware: "authenticated",
});

const addQty = (product: any) => {
  product.quantity += 1;
};
const subQty = (product: any) => {
  if (product?.quantity == 1) return;
  product.quantity -= 1;
};
onMounted(async () => {
  await getCartItems();
  console.log(cartItems.value);
});

const getSellerTotal = (seller: { total: any; items: any }) => {
  let total = 0;

  const items = seller.items;

  items.forEach((item: { price: any }) => {
    total += Number(item.price * item.quantity);
  });

  return Number(total).toFixed(2);
};

const getTotalCart = () => {
  let total = 0;
  cartItems.value.forEach((item) => {
    total += Number(getSellerTotal(item));
  });
  return Number(total).toFixed(2);
};
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/shopping-cart`)">
          {{ $t("cart.title") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4 cart-page">
    <div class="container">
      <h1>{{ $t("cart.title") }}</h1>
      <div v-if="!getCartItemsLoading" class="row mt-4">
        <div class="col-md-8">
          <div class="cart-items">
            <div
              v-for="(cartItem, i) in cartItems"
              :key="i"
              class="seller-group"
            >
              <div class="d-flex mb-3 gap-3 align-items-center">
                <div class="seller-title">
                  {{
                    cartItem?.seller.store_name != "null"
                      ? cartItem?.seller.store_name
                      : cartItem?.seller.name
                  }}
                </div>
                <div class="seller-price">
                  {{
                    $t("general.curr_value", {
                      value: getSellerTotal(cartItem),
                    })
                  }}
                </div>
              </div>

              <div
                v-for="(product, i) in cartItem?.items"
                :key="i"
                class="product-row mb-2"
              >
                <div class="img">
                  <NuxtImg
                    width="100"
                    height="100"
                    :src="product?.image"
                    :alt="product?.title"
                  />
                </div>
                <div class="content">
                  <div>
                    <NuxtLink
                      :href="$localePath(`/products/item/${product?.item_id}`)"
                      class="info"
                    >
                      <div>{{ product?.title }}</div>
                    </NuxtLink>

                    <div class="d-flex align-items-center gap-4">
                      <div class="qty">
                        <div
                          :class="{ disabled: product?.quantity == 1 }"
                          @click.prevent="subQty(product)"
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
                                :stroke="
                                  product?.quantity == 1 ? '#444C4E' : 'black'
                                "
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M9 12H15"
                                :stroke="
                                  product?.quantity == 1 ? '#444C4E' : 'black'
                                "
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
                        <span>{{ product?.quantity }}</span>
                        <div @click.prevent="addQty(product)">
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

                      <div class="price">
                        {{
                          $t("general.curr_value", {
                            value: Number(
                              product?.quantity * product?.price
                            ).toFixed(2),
                          })
                        }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="d-flex flex-column justify-content-between gap-2"
                    data-bs-toggle="tooltip"
                    title="delete product"
                  >
                    <div class="product-price">
                      <span>{{ $t("general.price") }}</span>
                      {{
                        $t("general.curr_value", {
                          value: Number(product?.price).toFixed(2),
                        })
                      }}
                    </div>
                    <button
                      @click.prevent="deleteFromCart(product)"
                      class="delete-product"
                      aria-label="delete product"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <g clip-path="url(#clip0_176_858)">
                          <path
                            d="M3.33398 5.83331H16.6673"
                            stroke="#FF0000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.33398 9.16669V14.1667"
                            stroke="#FF0000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.666 9.16669V14.1667"
                            stroke="#FF0000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M4.16602 5.83331L4.99935 15.8333C4.99935 16.2753 5.17494 16.6993 5.4875 17.0118C5.80006 17.3244 6.22399 17.5 6.66602 17.5H13.3327C13.7747 17.5 14.1986 17.3244 14.5112 17.0118C14.8238 16.6993 14.9993 16.2753 14.9993 15.8333L15.8327 5.83331"
                            stroke="#FF0000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.5 5.83333V3.33333C7.5 3.11232 7.5878 2.90036 7.74408 2.74408C7.90036 2.5878 8.11232 2.5 8.33333 2.5H11.6667C11.8877 2.5 12.0996 2.5878 12.2559 2.74408C12.4122 2.90036 12.5 3.11232 12.5 3.33333V5.83333"
                            stroke="#FF0000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_176_858">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="summary">
            <div class="cart-summary">
              <div class="title">{{ $t("cart.summary") }}</div>
              <div class="prices">
                <div>
                  <span>{{ $t("cart.totalPrice") }}</span>
                  <span>{{ getTotalCart() }}</span>
                </div>
              </div>
              <button type="button" class="btn-zaad w-100 mt-4">
                {{ $t("cart.confirm") }}
              </button>
            </div>
            <div class="discount">
              <div class="title">{{ $t("cart.coupon") }}</div>
              <p>{{ $t("cart.couponP") }}</p>
              <div class="form-group">
                <label for="discount-code">{{ $t("cart.couponCode") }}</label>
                <input
                  type="text"
                  name="discount-code"
                  :placeholder="$t('cart.enterCoupon')"
                  id="discount-code"
                />
              </div>
              <button class="mt-4 w-100">{{ $t("general.confirm") }}</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="loader-container">
        <div class="content-loader"></div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.loader-container {
  margin: 50px;
  display: flex;
  justify-content: center;
  height: 100px;
}
.cart-page {
  .seller-title {
    font-size: 18px;
    font-weight: 700;
  }
  .seller-price {
    font-size: 24px;
    color: var(--main-color);
    font-weight: bold;
  }
  .cart-items {
    .seller-group {
      padding: 15px;
      border-radius: 12px;
      margin-bottom: 20px;
      h2 {
        font-size: 16px;
      }
      .product-row {
        display: flex;
        align-items: center;
        gap: 25px;
        .img {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 16px;
          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        }
        .delete-product {
          background: #fff;
          border: 1px solid #dedede;
          width: 40px;
          height: 40px;
          margin-inline-start: auto;
          border-radius: 8px;
          transition: var(--trans);
          &:hover {
            background-color: #dedede;
          }
        }
        .content {
          width: 67%;
          display: flex;
          justify-content: space-between;
          .product-price {
            font-weight: bold;
            font-size: 24px;
            span {
              color: #444c4e;
              font-size: 14px;
            }
          }
          .info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #000;
            transition: var(--trans);
            &:hover {
              text-decoration: underline;
            }
            div {
              font-size: 18px;
            }
            margin-bottom: 10px;
          }
          .qty {
            display: flex;
            background-color: rgba(210, 210, 210, 0.1019607843);
            gap: 8px;
            padding: 5px 5px;
            border: 1px solid #e6e6e6;
            border-radius: 13px;
            user-select: none;

            > div {
              cursor: pointer;
              transition: var(--trans);
              &.disabled {
                cursor: no-drop;
              }
            }
            > span {
              font-weight: 700;
            }
          }

          .price {
            color: var(--main-color);
            font-weight: 400;
            font-size: 24px;
            transition: var(--trans);
          }
        }
      }
    }
  }
  .summary {
    position: sticky;
    top: 25%;
    .cart-summary {
      background-color: #004a980d;
      border-radius: 24px;
      padding: 20px;

      .title {
        font-weight: 700;
        font-size: 18px;
      }
      .prices {
        margin-top: 13px;
        > div {
          display: flex;
          justify-content: space-between;
          span {
            font-weight: 400;
            &:last-child {
              font-weight: 700;
              font-size: 18px;
            }
          }
        }
      }
    }
    .discount {
      background-color: #f9f9f9;
      margin-top: 50px;
      border-radius: 24px;
      padding: 20px;
      .title {
        font-weight: bold;
      }
      p {
        color: #4a4a4a;
        font-size: 14px;
      }
      label {
        font-size: 14px;
        font-weight: 400;
        display: block;
        margin-bottom: 5px;
      }
      input {
        width: 100%;
        border: 1px solid #dfdfdf;
        padding: 10px;
        border-radius: 14px;
        outline: none;
        &::placeholder {
          color: #a9a9a9;
        }
        &:focus {
          border-color: var(--main-color);
        }
      }
      button {
        background-color: #ffffff;
        box-shadow: none;
        border: 1px solid #fff;
        padding: 10px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 700;
        transition: var(--trans);
        &:hover {
          background-color: #4a4a4a;
          color: #fff;
        }
      }
    }
  }
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
</style>
