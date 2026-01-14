<script setup lang="ts">
const { t, locale } = useI18n();
useSeo({});
const { getAddresses, getAddressesloading, addresses } = useProfile();

const pageLoading = computed(() => {
  return getAddressesloading.value || getCheckoutLoading.value;
});

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
        address_id: addresses.value[0]?.id,
      },
    });

    checkoutItems.value = checkoutData?.resources;
  } catch (err) {
  } finally {
    getCheckoutLoading.value = false;
  }
};

const addQty = (product: any) => {
  product.quantity += 1;
};
const subQty = (product: any) => {
  if (product?.quantity == 1) return;
  product.quantity -= 1;
};
onMounted(async () => {
  await getAddresses();
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
                  <th>صورة</th>
                  <th>المنتج</th>
                  <th>شركة الشحن</th>
                  <th>سعر الشحن</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                  <th>المجموع</th>
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
                      src="/assets/images/laptop.svg"
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
                            : " اختر شركة الشحن"
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
                          value:
                           Number( item?.item?.quantity * item?.item?.regular_price).toFixed(2),
                        })
                      }}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="row">
          
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
</template>
<style scoped lang="scss">
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
    thead {
      th {
        padding: 15px;
        text-align: center;
      }
    }
    td {
      text-align: center;
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
