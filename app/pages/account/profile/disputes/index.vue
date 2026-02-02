<script setup lang="ts">
const { t, locale } = useI18n();
useSeo({
  title: t("meta.setMeta", { meta: t("links.disputes") }),
  description: t("meta.setMeta", { meta: t("links.disputes") }),
});
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

// pagination state
const currentPage = ref(1);
const lastPage = ref(1);
const perPage = ref(10);
const totalItems = ref(0);

const disputes = ref([]);
const disputesLoading = ref(true);
const getDisputes = async () => {
  try {
    disputesLoading.value = true;
    const reqQuery = {
      page: currentPage.value,
      per_page: perPage.value,
    };

    const res = await $fetch("/api/disputes/list", {
      headers: {
        Lang: locale.value,
      },
      query: reqQuery,
    });

    disputes.value = res?.data;
  } catch (err) {
  } finally {
    disputesLoading.value = false;
  }
};
onMounted(async () => {
  await getDisputes();
});
</script>
<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="section-title">{{ $t("links.disputes") }}</h1>
  </div>
  <template v-if="!disputesLoading">
    <template v-if="disputes.length">
      <div class="">
        <table class="table table-hover">
          <thead>
            <tr>
              <td>رقم النزاع</td>
              <td>المنتج</td>
              <td>التاريخ</td>
              <td>الحالة</td>
              <td>نوع المشكلة</td>

              <td>الخيارات</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dispute, i) in disputes" :key="i">
              <td>{{ dispute?.dispute_code }}</td>
              <td>
                <NuxtLink
                  :href="$localePath(`/products/item/${dispute?.item_id}`)"
                >
                  {{ dispute?.item }}</NuxtLink
                >
              </td>
              <td>{{ dispute?.created_at }}</td>

              <td>
                {{ dispute?.dispute_status_id }}
              </td>
              <td>{{ dispute?.problem }}</td>
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
                      <button></button>
                      <NuxtLink
                        :href="
                          $localePath(
                            `/account/profile/disputes/${dispute?.id}`,
                          )
                        "
                        class=""
                        >عرض التفاصيل</NuxtLink
                      >
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <div class="col text-center py-5 my-5">
          <div class="no-items">
            <div class="mb-4">{{ $t("profile.noDisputes") }}</div>
            <NuxtLink
              :href="$localePath('/account/profile/orders')"
              class="btn-zaad"
              >{{ $t("links.orders") }}</NuxtLink
            >
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
</template>
<style scoped lang="scss">
.dropdown {
  text-align: center;
  .dropdown-menu {
    padding: 10px;
    button {
      font-size: 14px;
      font-weight: 500;
      color: #000;
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
</style>
