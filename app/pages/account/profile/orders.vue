<script setup lang="ts">
const { t } = useI18n();
useSeo({});
definePageMeta({
  layout: "profile",
  middleware: "authenticated",
  breadcrumbs: [
    {
      name: "links.accountInfo",
      url: "/account/profile",
    },
  ],
});
const { locale } = useI18n();
const getOrdersLoading = ref(true);
const ordersList = ref([]);

// pagination state
const currentPage = ref(1);
const lastPage = ref(1);
const perPage = ref(10);
const totalItems = ref(0);

const getOrders = async () => {
  try {
    getOrdersLoading.value = true;
    const reqQuery = {
      page: currentPage.value,
      per_page: perPage.value,
    };

    const res = await $fetch("/api/orders/list", {
      headers: {
        Lang: locale.value,
      },
      query: reqQuery,
    });
    ordersList.value = res?.resources || [];
    // pagination meta
    currentPage.value = Number(res.current_page);
    lastPage.value = Number(res.last_page);
    perPage.value = Number(res.per_page);
    totalItems.value = Number(res.total);
  } catch (err) {
  } finally {
    getOrdersLoading.value = false;
  }
};

const changePage = (page: number) => {
  if (page < 1 || page > lastPage.value) return;
  currentPage.value = page;
  getOrders();
};

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = lastPage.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);

    if (current > 4) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push("...");

    pages.push(total);
  }

  return pages;
});

const changePerPage = (value: number) => {
  perPage.value = value;
  currentPage.value = 1;
  getOrders();
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr.replace(" ", "T"));

  const lang = locale.value === "ar" ? "ar-OM" : "en-US";
  const formatted = date.toLocaleDateString(lang, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return formatted;
};

const statusMap = {
  0: { key: "status.waiting_payment", class: "warning" },
  1: { key: "status.payed", class: "success" },
  2: { key: "status.shipping", class: "info" },
  3: { key: "status.shipped", class: "primary" },
  4: { key: "status.delivered", class: "success" },
  5: { key: "status.canceled", class: "danger" },
};

const statusLabel = (status) => {
  return t(statusMap[status]?.key || "status.unknown");
};

const statusClass = (status) => {
  return statusMap[status]?.class || "secondary";
};

const orderItemsModal = ref(null);
const selectedOrder = ref(null);
const showOrderItems = async (order: any) => {
  selectedOrder.value = order;
  console.log(order);

  await orderItemsModal.value.showModal();
};

onMounted(async () => {
  await getOrders();
  // TODO ORDERS PAGINATOR
});
</script>
<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="section-title">{{ $t("links.orders") }}</h1>
  </div>
  <template v-if="!getOrdersLoading">
    <template v-if="ordersList.length">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <td>{{ $t("order.orderNum") }}</td>
              <td>{{ $t("order.date") }}</td>
              <td>{{ $t("order.status") }}</td>
              <td>{{ $t("order.store") }}</td>
              <td>طريقة الدفع او السداد{{ $t("order.orderNum") }}</td>
              <td>خصم خدمة توصيل{{ $t("order.orderNum") }}</td>
              <td>خصم{{ $t("order.orderNum") }}</td>
              <td>للدفع{{ $t("order.orderNum") }}</td>
              <td>المجموع{{ $t("order.orderNum") }}</td>
              <td>الخيارات{{ $t("order.orderNum") }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, i) in ordersList" :key="i">
              <td>{{ order?.order_no }}</td>
              <td>{{ formatDate(order?.purchase_date) }}</td>
              <td>
                <div class="badge" :class="statusClass(order.status?.id)">
                  {{ statusLabel(order.status?.id) }}
                </div>
              </td>
              <td>
                <NuxtLink
                  :href="$localePath(`/stores/products/${order.store?.id}`)"
                >
                  {{ order.store?.name }}</NuxtLink
                >
              </td>
              <td>
                {{ order.payment_method }}
              </td>
              <td>
                {{
                  $t("general.curr_value", { value: order.shipping_discount })
                }}
              </td>
              <td>
                {{ $t("general.curr_value", { value: order.discount }) }}
              </td>
              <td>
                {{ $t("general.curr_value", { value: order.payable }) }}
              </td>
              <td>
                <span class="fw-bold">
                  {{ $t("general.curr_value", { value: order.total }) }}</span
                >
              </td>

              <td class="action">
                <div class="dropdown">
                  <button
                    class="dropdown-toggle"
                    title="Actions"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_183_1948)">
                        <path
                          d="M12 6V6.01"
                          stroke="black"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M12 12V12.01"
                          stroke="black"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M12 18V18.01"
                          stroke="black"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_183_1948">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <button @click.prevent="showOrderItems(order)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          class="bi bi-cart3"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"
                          />
                        </svg>
                        {{ $t("order.showItems") }}
                      </button>
                    </li>
                    <li v-if="order?.payment_method_id == 2">
                      <button @click.prevent="showOrderItems(order)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-credit-card-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1"
                          />
                        </svg>
                        {{ $t("order.thawaniPay") }}
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="lastPage > 1" class="orders-pagination">
          <!-- Page info -->
          <div class="page-info">{{ currentPage }} of {{ lastPage }}</div>

          <!-- Pagination buttons -->
          <ul class="pagination-list">
            <li>
              <button :disabled="currentPage === 1" @click="changePage(1)">
                «
              </button>
            </li>

            <li>
              <button
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
              >
                ‹
              </button>
            </li>

            <li v-for="(page, i) in visiblePages" :key="i">
              <button
                v-if="page !== '...'"
                :class="{ active: page === currentPage }"
                @click="changePage(page as number)"
              >
                {{ page }}
              </button>

              <span v-else class="dots">…</span>
            </li>

            <li>
              <button
                :disabled="currentPage === lastPage"
                @click="changePage(currentPage + 1)"
              >
                ›
              </button>
            </li>

            <li>
              <button
                :disabled="currentPage === lastPage"
                @click="changePage(lastPage)"
              >
                »
              </button>
            </li>
          </ul>

          <!-- Per page -->
          <div class="per-page">
            <select
              :value="perPage"
              @change="changePerPage(Number($event.target.value))"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <div class="col text-center py-5 my-5">
          <div class="no-items">
            <div>{{ $t("profile.noOrders") }}</div>
            <NuxtLink :href="$localePath('/shopping-cart')" class="btn-zaad">{{
              $t("cart.title")
            }}</NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </template>
  <template v-else>
    <div class="row">
      <div class="col text-center py-5 my-5">
        {{ $t("general.wait") }}
      </div>
    </div>
  </template>
  <ModalOrderItems :order="selectedOrder" ref="orderItemsModal" />
</template>
<style scoped lang="scss">
.no-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  align-items: center;
  position: sticky;
  top: 100px;
}
.dropdown {
  text-align: center;
  .dropdown-menu {
    padding: 10px;
    button {
      font-size: 14px;
      font-weight: 500;
      margin: 5px 0;
      color: #000;
      white-space: nowrap;
      &:hover {
        color: var(--main-color);
        svg {
          fill: var(--main-color);
        }
      }
    }
  }
  button {
    background-color: transparent;
    border: 0;
    &::after {
      display: none;
    }
  }
}
h1.section-title {
  font-size: 18px;
  color: #000;
  font-weight: 700;
}
table {
  > :not(caption) > * > * {
    background-color: transparent;
    color: #000;
    font-weight: 500;
    font-size: 14px;
    padding: 17px;
  }
  svg {
    cursor: pointer;
  }
  .badge {
    font-size: 14px;
    font-weight: 500;
    &.success {
      background: #10b981;
      color: #fff;
    }
    &.danger {
      background: #ef4444;
      color: #fff;
    }
    &.warning {
      background: #f59e0b;
      color: #fff;
    }
    &.info {
      background: #3b82f6;
      color: #fff;
    }
    &.primary {
      background: #6366f1;
      color: #fff;
    }
    &.secondary {
      background: #9ca3af;
      color: #fff;
    }
  }
  a {
    color: var(--main-color);
    &:hover {
      opacity: 0.8;
    }
  }
}
.orders-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination-list {
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;

  button {
    min-width: 36px;
    height: 36px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #000;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: #f3f4f6;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.active {
      background: #e5e7eb;
      border-color: #e5e7eb;
      font-weight: 600;
    }
  }

  .dots {
    padding: 0 6px;
    color: #9ca3af;
  }
}

.per-page {
  select {
    height: 36px;
    padding: 0 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    background: #fff;
    cursor: pointer;
  }
}
</style>
