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

  await orderItemsModal.value.showModal();
};
const toast = useToast();

const payOrder = async (order: any) => {
  try {
    const res = await $fetch("/api/orders/pay", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        order_id: order.id,
      },
    });
    if (res?.payment_request && res?.payment_request?.returnurl) {
      window.location.href = res?.payment_request?.returnurl;
    } else {
      toast.error({
        title: t("submit.error"),
        message: t("submit.errorP"),
        rtl: locale.value === "ar",
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const orderDisputeModal = ref(null);
const showOrderDispute = async (order: any) => {
  selectedOrder.value = order;
  await orderDisputeModal.value.showModal();
};

const problems = ref([]);
const getProblems = async () => {
  try {
    const res = await $fetch("/api/orders/problems", {
      headers: {
        Lang: locale.value,
      },
      query: {},
    });
    problems.value = res?.data || [];
  } catch (err) {
  } finally {
  }
};

const sendSellerModal = ref(null);
const showSendSellerModal = async (order: any) => {
  selectedOrder.value = order;
  await sendSellerModal.value.showModal();
};

const showSellerBank = async (order: any) => {
  selectedOrder.value = order;
  const bankInfo = order.bank_account;

  const SellerBankModal = new bootstrap.Modal(
    document.getElementById("SellerBankModal"),
    {},
  );
  SellerBankModal.show();
};


const showReciptModal = async (order: any) => {
  selectedOrder.value = order;
  const SellerReceiptModal = new bootstrap.Modal(
    document.getElementById("SellerReceiptModal"),
    {},
  );
  SellerReceiptModal.show();
};

onMounted(async () => {
  await getOrders();
  await getProblems();
  // TODO ORDERS PAGINATOR
});
</script>
<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="section-title">{{ $t("links.orders") }}</h1>
  </div>
  <template v-if="!getOrdersLoading">
    <template v-if="ordersList.length">
      <div class="">
        <table class="table table-hover">
          <thead>
            <tr>
              <td>{{ $t("order.orderNum") }}</td>
              <td>{{ $t("order.date") }}</td>
              <td>{{ $t("order.status") }}</td>
              <td>{{ $t("order.store") }}</td>
              <td>طريقة الدفع او السداد</td>
              <td>خصم خدمة توصيل</td>
              <td>خصم</td>
              <td>للدفع</td>
              <td>المجموع</td>
              <td>الخيارات</td>
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
                      <button @click.prevent="payOrder(order)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-wallet"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"
                          />
                        </svg>
                        {{ $t("order.thawaniPay") }}
                      </button>
                    </li>
                    <li v-if="order?.payment_method_id == 3">
                      <button @click.prevent="showSellerBank(order)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-bank"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z"
                          />
                        </svg>
                        {{ $t("order.sellerBank") }}
                      </button>
                    </li>
                    <li v-if="order?.payment_method_id == 3">
                      <button @click.prevent="showReciptModal(order)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-wallet"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"
                          />
                        </svg>
                        {{ $t("order.receipt") }}
                      </button>
                    </li>
                    <li>
                      <button @click.prevent="showSendSellerModal(order)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-chat-square-text"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
                          />
                          <path
                            d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"
                          />
                        </svg>
                        {{ $t("order.sendSeller") }}
                      </button>
                    </li>
                    <li>
                      <button
                        @click.prevent="showOrderDispute(order)"
                        class="dispute"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-bag-x"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M6.146 8.146a.5.5 0 0 1 .708 0L8 9.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 10l1.147 1.146a.5.5 0 0 1-.708.708L8 10.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 10 6.146 8.854a.5.5 0 0 1 0-.708"
                          />
                          <path
                            d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"
                          />
                        </svg>
                        {{ $t("order.orderDispute") }}
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
  <ModalOrderDispute
    :problems="problems"
    :order="selectedOrder"
    ref="orderDisputeModal"
  />
  <ModalSendMessageToSeller :order="selectedOrder" ref="sendSellerModal" />

  <!-- Seller Bank Account Modal -->
  <div
    class="modal SellerBankModal modal-lg"
    id="SellerBankModal"
    role="dialog"
    tabindex="-1"
    aria-labelledby="SellerBankModal"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            {{ $t("order.bankAccountFor") }}
            <span class="main-color">{{ selectedOrder?.seller?.name }}</span>
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <ol>
            <li>اسم صاحب الحساب: {{ selectedOrder?.bank_account?.name }}</li>
            <li>رقم الحساب: {{ selectedOrder?.bank_account?.account_no }}</li>
            <li>اسم البنك: {{ selectedOrder?.bank_account?.bank_name }}</li>
            <li>اسم الفرع: {{ selectedOrder?.bank_account?.branch }}</li>
          </ol>
        </div>
      </div>
    </div>
  </div>

  <!-- Seller Receipt Modal -->
  <div
    class="modal SellerReceiptModal modal-lg"
    id="SellerReceiptModal"
    role="dialog"
    tabindex="-1"
    aria-labelledby="SellerReceiptModal"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">{{$t("order.receipt")}}</div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">شسبشسب</div>
      </div>
    </div>
  </div>
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
      &.dispute {
        color: #ef4444;
        svg {
          fill: #ef4444;
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
