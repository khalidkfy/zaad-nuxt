<script setup lang="ts">
const { t } = useI18n();
useSeo({
  title:t("meta.setMeta", {meta:t("links.bank-transfers")}),
  description:t("meta.setMeta", {meta:t("links.bank-transfers")}),
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
</script>
<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="section-title">{{ $t("links.bank-transfers") }}</h1>
  </div>
   <div class="row">
        <div class="col text-center py-5 my-5">
          <div class="no-items">
            <div class="mb-3">لا يوجد حوالات بنيكة</div>
            <NuxtLink :href="$localePath('/account/profile/orders')" class="btn-zaad">{{
              $t("links.orders")
            }}</NuxtLink>
          </div>
        </div>
      </div>
  <!-- <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <td>
            رقم الطلب
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <g clip-path="url(#clip0_176_1858)">
                <path
                  d="M9.91602 1.75V12.25"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.83398 10.5L4.08398 12.25L2.33398 10.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.08398 12.25V1.75"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.666 3.5L9.91602 1.75L8.16602 3.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_176_1858">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </td>
          <td>
            التاجر
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <g clip-path="url(#clip0_176_1858)">
                <path
                  d="M9.91602 1.75V12.25"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.83398 10.5L4.08398 12.25L2.33398 10.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.08398 12.25V1.75"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.666 3.5L9.91602 1.75L8.16602 3.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_176_1858">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </td>
          <td>
            الحالة
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <g clip-path="url(#clip0_176_1858)">
                <path
                  d="M9.91602 1.75V12.25"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.83398 10.5L4.08398 12.25L2.33398 10.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.08398 12.25V1.75"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.666 3.5L9.91602 1.75L8.16602 3.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_176_1858">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </td>
          <td>
            رقم الحوالة
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <g clip-path="url(#clip0_176_1858)">
                <path
                  d="M9.91602 1.75V12.25"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.83398 10.5L4.08398 12.25L2.33398 10.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.08398 12.25V1.75"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.666 3.5L9.91602 1.75L8.16602 3.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_176_1858">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </td>
          <td>
            ملاحظات البائع
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <g clip-path="url(#clip0_176_1858)">
                <path
                  d="M9.91602 1.75V12.25"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.83398 10.5L4.08398 12.25L2.33398 10.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.08398 12.25V1.75"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.666 3.5L9.91602 1.75L8.16602 3.5"
                  stroke="#4A4A4A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_176_1858">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </td>
          <td>الخيارات</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 10">
          <td>#{{ i }}</td>
          <td>اسم البراند</td>
          <td>
            <div class="badge" :class="i % 2 === 0 ? 'danger' : 'success'">
              الحالة
            </div>
          </td>
          <td>124#</td>
          <td>1مصر - القاهرة - مدينتي b12 group 122 b 64</td>
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
                  <button>
                    <img
                    loading="lazy"
                      width="20"
                      height="20"
                      src="/assets/images/delete.svg"
                      alt="delete"
                    />
                    {{ $t("general.delete") }}
                  </button>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div> -->
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
      background-color: #00b9251a;
      color: #00b925;
    }
    &.danger {
      background-color: #ff00001a;
      color: #ff0000;
    }
  }
}
</style>
