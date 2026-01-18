<script setup lang="ts">
const { t, locale } = useI18n();
useSeo({});
const { getAddresses, getAddressesloading, addresses } = useProfile();
const { validateCoupon, validateCouponRes, validateCouponLoading } =
  useProducts();

const pageLoading = computed(() => {
  return getAddressesloading.value || getCheckoutLoading.value;
});

const coupon = ref("");
const getCheckoutLoading = ref(true);

const checkoutItems = ref([]);
const getCheckout = async () => {
  try {
    getCheckoutLoading.value = true;
    const data = localStorage.getItem("checkoutData");

    const paresdData = JSON.parse(data);

    const checkoutData = await $fetch("/api/products/checkout", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        items: paresdData?.items,
        seller_id: paresdData?.seller?.id,
        address_id: selectedAddress.value?.id,
      },
    });

    checkoutItems.value = checkoutData?.resources;
  } catch (err) {
  } finally {
    getCheckoutLoading.value = false;
  }
};

const selectedAddress = ref(null);

const addQty = (product: any) => {
  product.quantity += 1;
};
const subQty = (product: any) => {
  if (product?.quantity == 1) return;
  product.quantity -= 1;
};

const paymentMethods = ref([]);
const getSellerPaymentMethods = async () => {
  const data = localStorage.getItem("checkoutData");

  const paresdData = JSON.parse(data);

  const sellerPaymentMethods = await $fetch(
    "/api/products/seller-payment-methods",
    {
      headers: {
        Lang: locale.value,
      },
      query: {
        seller_id: paresdData?.seller?.id,
      },
    }
  );
  paymentMethods.value = sellerPaymentMethods?.resources;
};

const getTotolShippingPrice = computed(() => {
  let total = 0;

  for (const item in checkoutItems.value) {
    let ShippingServices = checkoutItems.value[item]?.selectedShipping;
    if (ShippingServices) {
      total += Number(ShippingServices?.price);
    }
  }
  return total;
});
const getTotalItems = () => {
  const items = [];

  for (const item in checkoutItems.value) {
    let product = checkoutItems.value[item];
    items.push(product);
  }
  return items;
};
const getTotalCart = computed(() => {
  let total = 0;
  for (const item in checkoutItems.value) {
    let product = checkoutItems.value[item]?.item;
    total += Number(product?.regular_price) * Number(product?.quantity);
  }
  return Number(total).toFixed(2);
});

const couponDetails = computed(() => {
  let data = {
    discount: 0,
    net_price: 0,
    total_price: 0,
  };

  if (validateCouponRes.value && validateCouponRes.value.status == true) {
    data.discount = validateCouponRes.value.discount;
    data.net_price = validateCouponRes.value.net_price;
    data.total_price = validateCouponRes.value.total_price;
  }

  return data;
});

const addAddressModal = ref(null);
const showAddressModal = async () => {
  await addAddressModal.value.showModal();
};

const requestItems = computed(() => {
  const items = [];

  for (const item in checkoutItems.value) {
    let product = checkoutItems.value[item];
    items.push({
      item_id: product?.item?.id,
      quantity: product?.item?.quantity,
    });
  }
  return items;
});
onMounted(async () => {
  await getAddresses().then((data) => {
    selectedAddress.value = addresses.value[0];
  });
  await getSellerPaymentMethods();
  await getCheckout();
});
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
        <div>/</div>
        <NuxtLink
          active-class="active"
          :href="$localePath(`/products/checkout`)"
        >
          {{ $t("checkout.title") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <template v-if="!pageLoading">
        <div class="products">
          <div class="">
            <table>
              <thead>
                <tr>
                  <th>{{ $t("general.img") }}</th>
                  <th>{{ $t("general.product") }}</th>
                  <th>{{ $t("checkout.shippingService") }}</th>
                  <th>{{ $t("checkout.shippingPrice") }}</th>
                  <th>{{ $t("general.price") }}</th>
                  <th>{{ $t("general.qty") }}</th>
                  <th>{{ $t("cart.total") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in checkoutItems" :key="i">
                  <td>
                    <NuxtImg
                      width="100"
                      height="100"
                      :alt="item?.item?.title"
                      :title="item?.item?.title"
                      :src="item?.item?.src"
                    />
                  </td>
                  <td>
                    <NuxtLink
                      :href="$localePath(`/products/item/${item?.item?.id}`)"
                    >
                      {{ item?.item?.title }}
                    </NuxtLink>
                  </td>
                  <td>
                    <div class="dropdown shipping">
                      <button
                        class="nav-link d-inline-block dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {{
                          item.selectedShipping
                            ? item.selectedShipping.title
                            : $t("checkout.chooseShipping")
                        }}
                      </button>
                      <ul class="dropdown-menu">
                        <li
                          @click="item.selectedShipping = shippingService"
                          v-for="(shippingService, i) in item?.ShippingServices"
                          :key="i"
                          :class="{
                            active:
                              item?.selectedShipping?.id == shippingService.id,
                          }"
                        >
                          {{ shippingService?.title }}
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td>
                    {{
                      item.selectedShipping
                        ? $t("general.curr_value", {
                            value: item.selectedShipping.price,
                          })
                        : "--"
                    }}
                  </td>
                  <td>
                    {{
                      $t("general.curr_value", {
                        value: item?.item?.regular_price,
                      })
                    }}
                  </td>
                  <td>
                    <div class="qty">
                      <div
                        :class="{ disabled: item?.item?.quantity == 1 }"
                        @click.prevent="subQty(item?.item)"
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
                                item?.item?.quantity == 1 ? '#444C4E' : 'black'
                              "
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M9 12H15"
                              :stroke="
                                item?.item?.quantity == 1 ? '#444C4E' : 'black'
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
                      <!-- TODO::CHECK ITEM QUANTITY SHOULD BE LIKE IN CART -->
                      <span>{{ item?.item?.quantity }}</span>
                      <div @click.prevent="addQty(item?.item)">
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
                  </td>
                  <td>
                    <span class="fw-bold">
                      {{
                        $t("general.curr_value", {
                          value: Number(
                            item?.item?.quantity * item?.item?.regular_price
                          ).toFixed(2),
                        })
                      }}</span
                    >
                  </td>
                  <!-- TODO::check if regular_price is right -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col-md-4 mb-3">
            <div class="shipping-addresses">
              <div class="head">{{ $t("checkout.shippingAddress") }}</div>
              <div v-if="selectedAddress" class="body">
                <div v-for="(address, i) in addresses" :key="i" class="address">
                  <label :for="`address-${i}`">
                    <input
                      type="radio"
                      name="selectedAddress"
                      :id="`address-${i}`"
                      :checked="selectedAddress?.id == address?.id"
                    />
                    {{
                      `${address?.address_line_1} - ${address?.address_line_2} - ${address?.address_line_3}`
                    }}</label
                  >
                </div>
              </div>
              <div class="footer">
                <button @click.prevent="showAddressModal" class="btn action">
                  {{ $t("general.addAddress") }}
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="payment-methods">
              <div class="head">{{ $t("checkout.paymentMethod") }}</div>
              <div v-if="selectedAddress" class="body">
                <div
                  v-for="(method, i) in paymentMethods"
                  :key="i"
                  class="address"
                >
                  <label :for="`method-${i}`">
                    <input
                      type="radio"
                      name="selectedPaymentMethod"
                      :id="`method-${i}`"
                    />
                    {{ `${method?.name}` }}</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="invoice">
              <div class="head">{{ $t("checkout.invoice") }}</div>
              <div class="body">
                <div class="value">
                  <!-- TODO:: handle is_available -->
                  <span>{{ $t("checkout.availableItems") }}</span>
                  <span>{{ getTotalItems().length }}</span>
                </div>
                <div class="value">
                  <span>{{ $t("checkout.totolShippingPrice") }}</span>
                  <span>{{
                    $t("general.curr_value", { value: getTotolShippingPrice })
                  }}</span>
                </div>
                <div class="copoun">
                  <label for="discount-code">{{ $t("cart.couponCode") }}</label>
                  <form @submit.prevent="validateCoupon(coupon, requestItems)">
                    <div class="box">
                      <input
                        type="text"
                        v-model="coupon"
                        name="discount-code"
                        :placeholder="$t('cart.enterCoupon')"
                        id="discount-code"
                        :class="{
                          invalid:
                            validateCouponRes &&
                            validateCouponRes.status != true,
                        }"
                      />
                      <button
                        :disabled="validateCouponLoading"
                        class="btn-zaad"
                        type="submit"
                      >
                        {{ $t("general.apply") }}
                      </button>
                    </div>
                  </form>
                  <div
                    v-if="validateCouponRes && validateCouponRes.status != true"
                    class="invalid-msg"
                  >
                    {{ validateCouponRes?.message }}
                  </div>
                  <div
                    class="valid-msg"
                    v-if="validateCouponRes && validateCouponRes.status == true"
                  >
                    {{ validateCouponRes?.message }}
                  </div>
                </div>
                <div v-if="couponDetails.net_price <= 0" class="value">
                  <span>{{ $t("cart.totalPrice") }}</span>
                  <span>{{
                    $t("general.curr_value", { value: getTotalCart })
                  }}</span>
                </div>
                <template v-if="couponDetails && couponDetails.net_price > 0">
                  <!-- TODO:: After apply coupon can the quantity change ? -->
                  <div class="value">
                    <span>{{ $t("cart.totalPrice") }}</span>
                    <span>{{
                      $t("general.curr_value", {
                        value: Number(couponDetails?.total_price).toFixed(2),
                      })
                    }}</span>
                  </div>
                  <div class="value">
                    <span>{{ $t("checkout.discountValue") }}</span>
                    <span>{{
                      $t("general.curr_value", {
                        value: Number(couponDetails?.discount).toFixed(2),
                      })
                    }}</span>
                  </div>
                  <div class="value">
                    <span>{{ $t("checkout.netPrice") }}</span>
                    <span>{{
                      $t("general.curr_value", {
                        value: Number(couponDetails?.net_price).toFixed(2),
                      })
                    }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="row">
          <div class="col text-center py-5 my-5">
            {{ $t("general.wait") }}
          </div>
        </div>
      </template>
    </div>
    <!-- TODO::Edit Cart and sller info -->
  </section>

  <ClientOnly>
    <AddAddressModal ref="addAddressModal" />
  </ClientOnly>
</template>
<style scoped lang="scss">
button.action {
  padding: 7px 30px;
  border-radius: 16px;
  border-color: #cdcdcd;
  color: #4a4a4a;
  transition: var(--trans);
  width: 100%;
  &:hover {
    background-color: #e2e2e2;
  }
}
.invoice {
  background-color: #f9f9f9;
  border-radius: 12px;
  .head {
    background-color: #ff6a2a;
    color: #fff;
    font-size: 18px;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    padding: 8px 12px;
  }
  .body {
    padding: 15px;
    .value {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:not(:last-child) {
        border-bottom: 1px solid #e4dbdb;
      }
      padding: 12px 0;
      span {
        &:last-child {
          font-weight: bold;
          color: #000;
        }
      }
    }
    .copoun {
      border-bottom: 1px solid #e4dbdb;
      padding: 12px 0;
      div.box {
        display: flex;
        align-items: center;
        gap: 10px;
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
        &.invalid {
          border-color: #dc3545;
        }
      }
    }
  }
}
.invalid-msg {
  color: #dc3545;
}
.valid-msg {
  color: #198754;
}
.payment-methods {
  background-color: #f9f9f9;
  border-radius: 12px;
  .head {
    background-color: var(--main-color);
    color: #fff;
    font-size: 18px;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    padding: 8px 12px;
  }
  .body {
    padding: 15px;
  }
}
.shipping-addresses {
  background-color: #f9f9f9;
  border-radius: 12px;
  .head {
    background-color: var(--main-color);
    color: #fff;
    font-size: 18px;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    padding: 8px 12px;
  }
  .body {
    padding: 15px;
    .address {
      margin-bottom: 10px;
    }
  }
  .footer {
    padding: 15px;
  }
}
.qty {
  display: flex;
  background-color: rgba(210, 210, 210, 0.1019607843);
  gap: 8px;
  padding: 5px 5px;
  border: 1px solid #e6e6e6;
  border-radius: 13px;
  width: 100px;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

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
.products {
  table {
    width: 100%;
    background-color: #f9f9f9;
    border-radius: 24px;
    color: #000;
    thead {
      th {
        padding: 15px;
        text-align: center;
      }
    }
    td {
      text-align: center;
      padding: 15px;
    }
    a {
      color: #4a4a4a;
      transition: var(--trans);
      color: var(--main-color);
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
.dropdown.shipping {
  .dropdown-menu {
    padding: 15px;
    li {
      margin-bottom: 10px;
      cursor: pointer;
      transition: var(--trans);
      &.active {
        color: var(--main-color);
      }
      &:hover {
        color: var(--main-color);
      }
      button {
        background-color: transparent;
      }
    }
  }
}
</style>
