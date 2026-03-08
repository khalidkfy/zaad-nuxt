<script setup lang="ts">
const { t, locale } = useI18n();
useSeo({
  title: t("meta.setMeta", { meta: t("checkout.title") }),
});
const { getAddresses, getAddressesloading, addresses } = useProfile();
const { validateCoupon, validateCouponRes, validateCouponLoading } = useProducts();

const pageLoading = computed(() => {
  return getAddressesloading.value || getCheckoutLoading.value;
});

const router = useRouter();

const checkoutData = ref(null);
const loadCheckoutData = () => {
  const data = localStorage.getItem("checkoutData");

  if (!data) {
    router.push("/shopping-cart"); // redirect if null
    return null;
  }

  try {
    checkoutData.value = JSON.parse(data);
    return checkoutData.value;
  } catch (err) {
    console.error("Invalid checkout data in localStorage", err);
    router.push("/shopping-cart"); // redirect if JSON invalid
    return null;
  }
};
const coupon = ref("");
const getCheckoutLoading = ref(true);
// TODO:: email_sms_verification and able to checkout
const checkoutItems = ref([]);

const itemRefs = ref<Record<number, HTMLElement | null>>({});

const newAddressLoading = ref(false);

const selectedShippingService = ref(null);
const shippingServices = ref([]);
const getCheckout = async (loadingType = null) => {
  try {
    if (loadingType == "newAddress") {
      newAddressLoading.value = true;
    } else {
      getCheckoutLoading.value = true;
    }
    const paresdData = checkoutData.value || loadCheckoutData();
    if (!paresdData) return;

    const checkoutDataReq = await $fetch("/api/products/checkout", {
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

    const responseItems = Array.isArray(checkoutDataReq?.resources)
      ? checkoutDataReq.resources
      : Object.values(checkoutDataReq?.resources || {});

    checkoutItems.value = responseItems.map((item) => {
      const storedItem = paresdData.items.find((i) => i.item_id === item?.item?.id);

      if (storedItem) {
        item.item.quantity = storedItem.quantity;
      }

      return item;
    });

    const servicesMap = new Map();
    checkoutItems.value.forEach((item) => {
      (item?.ShippingServices || []).forEach((service) => {
        servicesMap.set(service.id, service);
      });
    });
    shippingServices.value = Array.from(servicesMap.values());

    if (shippingServices.value.length) {
      selectedShippingService.value = shippingServices.value.reduce(
        (cheapest, service) => {
          return service.price < cheapest.price ? service : cheapest;
        }
      );
    }
  } catch (err) {
  } finally {
    getCheckoutLoading.value = false;
    newAddressLoading.value = false;
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
const selectedPaymentMethod = ref(null);
const getSellerPaymentMethods = async () => {
  const paresdData = checkoutData.value || loadCheckoutData();
  if (!paresdData) return;

  const sellerPaymentMethods = await $fetch("/api/products/seller-payment-methods", {
    headers: {
      Lang: locale.value,
    },
    query: {
      seller_id: paresdData?.seller?.id,
    },
  });
  paymentMethods.value = sellerPaymentMethods?.resources;

  selectedPaymentMethod.value = paymentMethods.value[0] || null;
};

const getTotolShippingPrice = computed(() => {
  let total = 0;

  if (selectedShippingService.value) {
    total = Number(selectedShippingService.value.price);
  }
  return Number(total).toFixed(2);
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
  return Number(total) + Number(getTotolShippingPrice.value);
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
      service_id: selectedShippingService.value ? selectedShippingService.value.id : null,
    });
  }
  return items;
});

const createOrderLoading = ref(false);

const toast = useToast();

const handleSuccessCreateOrder = async (res: any) => {
  await localStorage.removeItem("checkoutData");
  toast.success({
    title: t("submit.success"),
    message: `${t("checkout.orderSuccess")}`,
    rtl: locale.value === "ar",
  });

  if (res?.payment_request && res?.payment_request?.returnurl) {
    window.location.href = res?.payment_request?.returnurl;
  } else {
    router.push(`/account/profile/orders`);
  }
};
const hasUnselectedShipping = computed(() => {
  return !selectedShippingService.value;
});

const checkItemsShippingService = () => {
  toast.error({
    title: t("submit.error"),
    message: t("checkout.selectShippingForAllItems"),
    rtl: locale.value === "ar",
  });

  return;
};
const createOrder = async () => {
  if (hasUnselectedShipping.value) {
    await checkItemsShippingService();
    return;
  }
  if (cantCreateOrder.value) return;
  createOrderLoading.value = true;
  try {
    const paresdData = checkoutData.value || loadCheckoutData();
    if (!paresdData) return;

    const res = await $fetch("/api/orders/create", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        seller_id: paresdData?.seller?.id,
        address_id: selectedAddress.value?.id,
        payment_method_id: selectedPaymentMethod.value?.id,
        coupon: "",
        items: requestItems.value,
      },
    });

 
    if (res && res.status == true) {
      await handleSuccessCreateOrder(res);
    }
  } catch (err) {
    console.log(err);
  } finally {
    createOrderLoading.value = false;
  }
};

const all_verified = ref(false);
const email_verified = ref(false);
const mobile_verified = ref(false);
const getEmailSmsFlags = async () => {
  const paresdData = checkoutData.value || loadCheckoutData();
  if (!paresdData) return;

  const flags = await $fetch("/api/profile/email-sms-flags", {
    headers: {
      Lang: locale.value,
    },
  });

  all_verified.value = flags?.data?.all_verified;
  email_verified.value = flags?.data?.email_verified_at;
  mobile_verified.value = flags?.data?.mobile_verified_at;
};
onMounted(async () => {
  await initCheckout();
});

const initCheckout = async () => {
  await getAddresses().then((data) => {
    selectedAddress.value = addresses.value[0];
  });
  await getSellerPaymentMethods();
  await getEmailSmsFlags();
  await getCheckout();
};

const cantCreateOrder = computed(() => {
  return (
    !selectedAddress.value ||
    !selectedPaymentMethod.value ||
    createOrderLoading.value ||
    !all_verified.value
  );
});

watch(selectedAddress, async (newAddress, oldAddress) => {
  if (!oldAddress) return;
  if (newAddress?.id !== oldAddress?.id) {
    await getCheckout("newAddress");
  }
});

const handleNewAddress = async () => {
  await initCheckout();
};

const { joinTexts } = useGlobal();

const getItemTotal = (item: any) => {
  return Number(item?.item?.quantity * item?.item?.regular_price).toFixed(2);
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
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/products/checkout`)">
          {{ $t("checkout.title") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <template v-if="!pageLoading">
        <!-- checkout erros 1. selectedAddress -->
        <template v-if="selectedAddress">
          <div class="products">
            <div class="table-wrapper">
              <div v-if="newAddressLoading" class="table-loader">
                <span class="spinner-border main-color spinner-border-lg"></span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>{{ $t("general.img") }}</th>
                    <th>{{ $t("general.product") }}</th>
                    <th>{{ $t("order.store") }}</th>
                    <!-- <th>{{ $t("checkout.shippingPrice") }}</th> -->
                    <th>{{ $t("general.price") }}</th>
                    <th>{{ $t("general.qty") }}</th>
                    <th>{{ $t("cart.total") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in checkoutItems"
                    :key="i"
                    :class="{
                      'shipping-error': !item.selectedShipping,
                      disabled: !item.ShippingServices.length,
                    }"
                    :ref="(el) => (itemRefs[i] = el)"
                  >
                    <td>
                      <NuxtImg
                        loading="lazy"
                        width="100"
                        height="100"
                        :alt="item?.item?.title"
                        :title="item?.item?.title"
                        :src="item?.item?.src"
                      />
                    </td>
                    <td>
                      <NuxtLink :href="$localePath(`/products/item/${item?.item?.id}`)">
                        {{ item?.item?.title }}
                      </NuxtLink>
                    </td>
                    <td>
                      <NuxtLink :href="$localePath(`/stores/products/${item?.item?.seller?.store_id}`)">
                        {{ item?.item?.seller?.storeName }}
                      </NuxtLink>
                    </td>
                    <!-- <td>
                      <div class="dropdown shipping">
                        <button
                          v-if="item.ShippingServices.length"
                          class="nav-link d-inline-block dropdown-toggle shipping-dropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {{
                            item.selectedShipping
                              ? item.selectedShipping.title
                              : $t("checkout.chooseShipping")
                          }}
                        </button>
                        <button
                          v-else
                          class="nav-link d-inline-block dropdown-toggle shipping-dropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {{ $t("checkout.itemHasNoShippingOptions") }}
                        </button>
                        <ul class="dropdown-menu">
                          <li
                            @click="item.selectedShipping = shippingService"
                            v-for="(shippingService, i) in item?.ShippingServices"
                            :key="i"
                            :class="{
                              active: item?.selectedShipping?.id == shippingService.id,
                            }"
                          >
                            {{ shippingService?.title }}
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span class="shipping-dropdown">
                        {{
                          item.selectedShipping
                            ? $t("general.curr_value", {
                                value: item.selectedShipping.price,
                              })
                            : "--"
                        }}
                      </span>
                    </td> -->
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
                                :stroke="item?.item?.quantity == 1 ? '#444C4E' : 'black'"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M9 12H15"
                                :stroke="item?.item?.quantity == 1 ? '#444C4E' : 'black'"
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
                            value: getItemTotal(item),
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
        </template>
        <template v-else>
          <div class="alert alert-warning">{{ $t("checkout.AddAddressNote") }}</div>
        </template>

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
                      :value="address"
                      v-model="selectedAddress"
                    />
                    {{
                      joinTexts(
                        address?.address_line_1,
                        address?.address_line_2,
                        address?.address_line_3
                      )
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
                <div v-for="(method, i) in paymentMethods" :key="i" class="address">
                  <label :for="`method-${i}`">
                    <input
                      type="radio"
                      name="paymentMethod"
                      :value="method"
                      v-model="selectedPaymentMethod"
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
                  <span>{{ $t("checkout.shippingService") }}</span>
                  <div v-if="shippingServices.length" class="dropdown shipping">
                    <button
                      class="nav-link d-inline-block dropdown-toggle shipping-dropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {{
                        selectedShippingService
                          ? selectedShippingService.title
                          : $t("checkout.chooseShipping")
                      }}
                    </button>
                    <!-- <button
                     
                      class="nav-link d-inline-block dropdown-toggle shipping-dropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {{ $t("checkout.itemHasNoShippingOptions") }}
                    </button> -->
                    <ul class="dropdown-menu">
                      <li
                        @click="selectedShippingService = shippingService"
                        v-for="(shippingService, i) in shippingServices"
                        :key="shippingService.id"
                      >
                        {{ shippingService?.title }}
                      </li>
                    </ul>
                  </div>
                  <div v-else class="text-danger">
                    {{ $t("checkout.noShippingServicesAddr") }}
                  </div>
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
                          invalid: validateCouponRes && validateCouponRes.status != true,
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
                  <span>{{ $t("general.curr_value", { value: getTotalCart }) }}</span>
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
              <div class="footer">
                <button
                  @click.prevent="createOrder()"
                  :disabled="cantCreateOrder"
                  class="btn-zaad w-100"
                >
                  {{ $t("checkout.completeCheckout") }}
                </button>

                <NuxtLink
                  :href="$localePath('/shopping-cart')"
                  class="btn-cart btn-zaad w-100"
                >
                  {{ $t("cart.edit") }}
                </NuxtLink>
              </div>
              <div v-if="!all_verified" class="flags">
                <p class="fw-bold text-danger m-0">{{ $t("checkout.forCompleteBuy") }}</p>
                <div v-if="!email_verified" class="">
                  {{ $t("checkout.email_verified") }}
                  <NuxtLink :href="$localePath('/account/profile')">{{
                    $t("checkout.verify")
                  }}</NuxtLink>
                </div>
                <div v-if="!mobile_verified" class=" ">
                  {{ $t("checkout.mobile_verified") }}
                  <NuxtLink :href="$localePath('/account/profile')">{{
                    $t("checkout.verify")
                  }}</NuxtLink>
                </div>
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
  </section>

  <ClientOnly>
    <AddAddressModal ref="addAddressModal" @newAddress="handleNewAddress" />
  </ClientOnly>
</template>
<style scoped lang="scss">
.btn-cart {
  background-color: #fff;
  color: #4a4a4a;
  transition: var(--trans);
  font-size: 16px;
  font-weight: 400;
  border: 1px solid #cecece;
  outline: none;
  text-align: center;

  &:hover {
    background-color: #cecece;
    color: #000;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &:disabled {
    cursor: no-drop;
    opacity: 0.8;
  }

  svg {
    margin-inline-end: 8px;
    transition: var(--trans);
  }
}

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

  .footer {
    padding: 15px;
    display: flex;
    gap: 5px;
  }

  .flags {
    padding: 15px;
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
  flex-wrap: wrap;

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
  .table-wrapper {
    position: relative;

    .table-loader {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: #f9f9f9;
      opacity: 0.7;
      display: flex;
      justify-content: center;
      align-items: center;
    }

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

    max-width: 100%;

    @media (max-width: 992px) {
      overflow: auto;
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
      font-size: 14px;

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

.shipping-error {
  .shipping-dropdown {
    color: #dc3545;
  }
}

tr.disabled {
  opacity: 0.6;
  pointer-events: none;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  50% {
    transform: translateX(4px);
  }

  75% {
    transform: translateX(-4px);
  }

  100% {
    transform: translateX(0);
  }
}

.shake {
  animation: shake 0.4s ease-in-out;
}
</style>
