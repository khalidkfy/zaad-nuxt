<script setup lang="ts">
const props = defineProps({
  layout: {
    required: false,
    type: String,
    default: "app",
  },
});
const { t, locale } = useI18n();

const router = useRouter();
const toast = useToast();

const { userAddresses } = useProfile();
const callLogout = async () => {
  await logout();
  toast.warning({
    title: t("login.loged-out"),
    message: `${t("login.loged-out-desc")}`,
    rtl: locale.value === "ar",
  });
  router.push("/");
};
const { user, loggedIn, clear: logout } = useUserSession();

const route = useRoute();

const loginLink = computed(() => ({
  path: "/account/login",
  query: { redirect: route.fullPath },
}));

const { joinTexts } = useGlobal();

</script>
<template>
  <header>
    <!-- Cookie box -->
    <ClientOnly>
      <CookieBox />
    </ClientOnly>

    <!-- Header Actions -->
    <section class="actions-section"> 
      <HeaderActions />
    </section>

    <!-- Navbar -->
    <div v-if="layout === 'app'" class="">
      <nav class="navbar main-navbar navbar-expand-lg py-2" aria-label="Main Navigation">
        <div class="container position-relative">
          <NuxtLink :to="$localePath('index')">
            <img
              alt="Zaad Logo"
              class="navbar-brand"
              width="132"
              height="38"
              src="/assets/images/logo/zaad-logo.svg"
            />
          </NuxtLink>

          <!-- Toggler for mobile -->
          <!-- <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasApp"
            aria-controls="offcanvasApp"
          >
            <span class="navbar-toggler-icon"></span>
          </button> -->
          <div class="mobile-nav">
            <!-- Login State -->
            <NuxtLink
              v-if="!loggedIn"
              :to="
                $localePath({
                  path: '/account/login',
                  query: { redirect: route.fullPath },
                })
              "
              class="no-auth ms-4"
            >
              <img
                loading="lazy"
                class="me-2"
                width="28"
                height="28"
                alt="location"
                src="/assets/images/user.svg"
              />
              <div class="d-flex">
                <span>{{ $t("general.hello") }}</span>
                <span class="fw-bold">{{ $t("navbar.signInUp") }}</span>
              </div>
            </NuxtLink>

            <div class="dropdown profile" v-else>
              <button
                class="dropdown-toggle"
                title="Actions"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  loading="lazy"
                  class="me-2"
                  width="28"
                  height="28"
                  alt="location"
                  :src="user?.image || '/assets/images/user.svg'"
                />
                <div class="">
                  <span>{{ $t("general.hello") }}</span>
                  <span class="fw-bold">{{ user?.name }}</span>
                </div>
              </button>
              <ul class="dropdown-menu dropdown-menu-end px-4">
                <li>
                  <NuxtLink
                    :href="$localePath('/account/profile?logout=logout')"
                    class="drop-link logout"
                    @click.prevent="callLogout"
                  >
                    <img
                      loading="lazy"
                      width="20"
                      height="20"
                      src="/assets/images/log-out.svg"
                      alt="logout"
                    />
                    <span> {{ $t("links.logout") }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <!-- Navbar content -->
          <div class="collapse navbar-collapse justify-content-between" id="navbarMain">
            <div v-if="loggedIn && userAddresses?.length" class="location">
              <img
                loading="lazy"
                class="me-2"
                width="24"
                height="24"
                alt="location"
                src="/assets/images/location.svg"
              />
              <NuxtLink :href="$localePath('/account/profile/addresses')">
                <div class="d-flex">
                  <span>{{ $t("navbar.deliverOrReceive") }}</span>
                  <span
                    :title="joinTexts(userAddresses[0].address_line_1, userAddresses[0].address_line_2, userAddresses[0].address_line_3)"
                    class="truncate"
                  >
                    {{
                     joinTexts(userAddresses[0].address_line_1, userAddresses[0].address_line_2, userAddresses[0].address_line_3)
                    }}
                  </span>
                </div>
              </NuxtLink>
            </div>

            <!-- Search Component -->
            <!-- <ClientOnly> -->
            <Search />
            <!-- </ClientOnly> -->

            <!-- Login State -->
            <NuxtLink
              v-if="!loggedIn"
              :to="
                $localePath({
                  path: '/account/login',
                  query: { redirect: route.fullPath },
                })
              "
              class="no-auth ms-4"
            >
              <img
                loading="lazy"
                class="me-2"
                width="28"
                height="28"
                alt="location"
                src="/assets/images/user.svg"
              />
              <div class="d-flex">
                <span>{{ $t("general.hello") }}</span>
                <span class="fw-bold">{{ $t("navbar.signInUp") }}</span>
              </div>
            </NuxtLink>

            <div class="dropdown profile" v-else>
              <button
                class="dropdown-toggle"
                title="Actions"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  loading="lazy"
                  class="me-2"
                  width="28"
                  height="28"
                  alt="location"
                  :src="user?.image || '/assets/images/user.svg'"
                />
                <div class="">
                  <span>{{ $t("general.hello") }}</span>
                  <span class="fw-bold">{{ user?.name }}</span>
                </div>
              </button>
              <ul class="dropdown-menu px-4">
                <li>
                  <NuxtLink :href="$localePath('/account/profile')" class="drop-link">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_170_3106)">
                        <path
                          d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 10C9 10.7956 9.31607 11.5587 9.87868 12.1213C10.4413 12.6839 11.2044 13 12 13C12.7956 13 13.5587 12.6839 14.1213 12.1213C14.6839 11.5587 15 10.7956 15 10C15 9.20435 14.6839 8.44129 14.1213 7.87868C13.5587 7.31607 12.7956 7 12 7C11.2044 7 10.4413 7.31607 9.87868 7.87868C9.31607 8.44129 9 9.20435 9 10Z"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.16797 18.849C6.41548 18.0252 6.92194 17.3032 7.61222 16.79C8.30249 16.2768 9.13982 15.9997 9.99997 16H14C14.8612 15.9997 15.6996 16.2774 16.3904 16.7918C17.0811 17.3062 17.5874 18.0298 17.834 18.855"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_170_3106">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span>{{ $t("links.accountInfo") }}</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    :href="$localePath('/account/profile/orders')"
                    class="drop-link"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_170_3055)">
                        <path
                          d="M10 16V8H12.5C13.163 8 13.7989 8.26339 14.2678 8.73223C14.7366 9.20107 15 9.83696 15 10.5C15 11.163 14.7366 11.7989 14.2678 12.2678C13.7989 12.7366 13.163 13 12.5 13H10"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_170_3055">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span> {{ $t("links.orders") }}</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    :href="$localePath('/account/profile?logout=logout')"
                    class="drop-link logout"
                    @click.prevent="callLogout"
                  >
                    <img
                      loading="lazy"
                      width="20"
                      height="20"
                      src="/assets/images/log-out.svg"
                      alt="logout"
                    />
                    <span> {{ $t("links.logout") }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Whish -->
            <WhishListComponent v-if="loggedIn" />

            <!-- Cart -->
            <!-- <ClientOnly> -->
            <CartComponent v-if="loggedIn" class="ms-3" />
            <!-- </ClientOnly> -->
          </div>
        </div>
      </nav>
    </div>
    <!-- Mobile -->
    <div class="mobile-nav">
      <div class="container">
        <Search />
      </div>
    </div>
    <div
      class="offcanvas offcanvas-start"
      tabindex="-1"
      id="offcanvasApp"
      aria-labelledby="offcanvasAppLabel"
    >
      <div class="offcanvas-header">
        <div class="offcanvas-title" id="offcanvasAppLabel">
          <img
            loading="lazy"
            width="112"
            height="40"
            src="/assets/images/logo/zaad-logo.svg"
            alt="Zaad"
          />
        </div>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <!-- Search Component -->
        <!-- <ClientOnly> -->
        <Search />
        <!-- </ClientOnly> -->

        <!-- Login State -->
        <NuxtLink
          v-if="!loggedIn"
          :to="
            $localePath({
              path: '/account/login',
              query: { redirect: route.fullPath },
            })
          "
          class="no-auth mt-5"
        >
          <img
            class="me-2"
            width="28"
            height="28"
            alt="location"
            loading="lazy"
            src="/assets/images/user.svg"
          />
          <div class="d-flex">
            <span>{{ $t("general.hello") }}</span>
            <span class="fw-bold">{{ $t("navbar.signInUp") }}</span>
          </div>
        </NuxtLink>

        <div class="dropdown profile" v-else>
          <button
            class="dropdown-toggle"
            title="Actions"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              loading="lazy"
              class="me-2"
              width="28"
              height="28"
              alt="location"
              :src="user?.image || '/assets/images/user.svg'"
            />
            <div class="">
              <span>{{ $t("general.hello") }}</span>
              <span class="fw-bold">{{ user?.name }}</span>
            </div>
          </button>
          <ul class="dropdown-menu px-4">
            <li>
              <NuxtLink :href="$localePath('/account/profile')" class="drop-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_170_3106)">
                    <path
                      d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
                      stroke="#4A4A4A"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9 10C9 10.7956 9.31607 11.5587 9.87868 12.1213C10.4413 12.6839 11.2044 13 12 13C12.7956 13 13.5587 12.6839 14.1213 12.1213C14.6839 11.5587 15 10.7956 15 10C15 9.20435 14.6839 8.44129 14.1213 7.87868C13.5587 7.31607 12.7956 7 12 7C11.2044 7 10.4413 7.31607 9.87868 7.87868C9.31607 8.44129 9 9.20435 9 10Z"
                      stroke="#4A4A4A"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.16797 18.849C6.41548 18.0252 6.92194 17.3032 7.61222 16.79C8.30249 16.2768 9.13982 15.9997 9.99997 16H14C14.8612 15.9997 15.6996 16.2774 16.3904 16.7918C17.0811 17.3062 17.5874 18.0298 17.834 18.855"
                      stroke="#4A4A4A"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_170_3106">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span>{{ $t("links.accountInfo") }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :href="$localePath('/account/profile/orders')" class="drop-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_170_3055)">
                    <path
                      d="M10 16V8H12.5C13.163 8 13.7989 8.26339 14.2678 8.73223C14.7366 9.20107 15 9.83696 15 10.5C15 11.163 14.7366 11.7989 14.2678 12.2678C13.7989 12.7366 13.163 13 12.5 13H10"
                      stroke="#4A4A4A"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
                      stroke="#4A4A4A"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_170_3055">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span> {{ $t("links.orders") }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :href="$localePath('/account/profile?logout=logout')"
                class="drop-link logout"
                @click.prevent="callLogout"
              >
                <img
                  loading="lazy"
                  width="20"
                  height="20"
                  src="/assets/images/log-out.svg"
                  alt="logout"
                />
                <span> {{ $t("links.logout") }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Whish -->
        <WhishListComponent v-if="loggedIn" />

        <!-- Cart -->
        <!-- <ClientOnly> -->
        <CartComponent v-if="loggedIn" class="ms-3" />
        <!-- </ClientOnly> -->
      </div>
    </div>
    <!-- Mobile -->

    <div v-if="loggedIn" class="bottom-menu">
      <div class="d-flex align-items-center">
        <NuxtLink :href="$localePath('/account/profile')">
          <img
            loading="lazy"
            class="me-2"
            width="28"
            height="28"
            alt="location"
            :src="'/assets/images/user.svg'"
          />
        </NuxtLink>
      </div>
      <!-- Whish -->
      <WhishListComponent :showText="false" />

      <!-- <ClientOnly> -->
      <CartComponent :showText="false" v-if="loggedIn" class="ms-3" />
      <!-- </ClientOnly> -->

      <div v-if="userAddresses?.length" class="location">
        <img
          loading="lazy"
          class="me-2"
          width="28"
          height="28"
          alt="location"
          src="/assets/images/location.svg"
        />
        <NuxtLink :href="$localePath('/account/profile/addresses')">
          <div class="d-flex">
            <span
              :title="`${userAddresses[0]?.address_line_1} - ${userAddresses[0]?.address_line_2} - ${userAddresses[0]?.address_line_3}`"
              class=""
            >
              {{ `${userAddresses[0]?.address_line_1}` }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
<style scoped lang="scss">
.cookie-box.show + .actions-section {
  margin-top: 50px;
}
.bottom-menu {
  display: none;
  background-color: #fff;
  padding: 10px;
  z-index: 999900;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  justify-content: space-around;
  box-shadow: 0 -4px 20px #00000014;
  border-top: 1px solid #e6e6e680;

  justify-content: space-between;
  padding: 20px;

  @media (max-width: 992px) {
    display: flex;
  }
}

.mobile-nav {
  display: none;

  @media (max-width: 992px) {
    display: block;
    margin: 15px 0;
  }
}

.profile.dropdown {
  font-size: 10px;

  button {
    background: none;
    border: 0;
    display: flex;
    align-items: center;

    &::after {
      display: none;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: start;
    }

    span {
      &:first-child {
        font-size: 10px;
        color: #8e90a7;
      }

      &:last-child {
        font-size: 12px;
        color: #4a4a4a;

        @media (max-width: 1200px) {
          font-size: 10px;
        }
      }
    }
  }

  .dropdown-menu {
    li {
      margin-bottom: 10px;
      white-space: nowrap;

      .drop-link {
        font-size: 15px;
        color: #4a4a4a;
        display: flex;
        gap: 8px;
        width: 100%;
        transition: var(--trans);

        &:hover {
          color: var(--main-color);

          svg {
            path {
              stroke: var(--main-color);
            }
          }
        }

        &.logout {
          &:hover {
            color: #ca0606;
          }
        }
      }
    }
  }
}

.main-nav {
  position: fixed;
  bottom: 0;
  z-index: var(--bs-offcanvas-zindex);
  display: flex;
  flex-direction: column;
  max-width: 100%;
  color: var(--bs-offcanvas-color);
  visibility: hidden;
  background-color: var(--bs-offcanvas-bg);
  background-clip: padding-box;
  outline: 0;
  transition: var(--bs-offcanvas-transition);
}

.main-navbar {
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > .location {
    margin-inline-end: 60px;
  }
}

.brand {
  margin-inline-end: 25px;
}

.location {
  display: flex;
  align-items: center;
  text-decoration: none;

  div {
    display: flex;
    font-size: 10px;
    flex-direction: column;

    span {
      &:first-child {
        font-size: 10px;
        color: #8e90a7;
      }

      &:last-child {
        font-size: 12px;
        color: #4a4a4a;
      }
    }

    .location {
      img {
        margin-inline-end: 10px;
      }
    }
  }
}

.no-auth,
.auth {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;

  div {
    display: flex;
    font-size: 10px;
    flex-direction: column;

    span {
      &:first-child {
        font-size: 10px;
        color: #8e90a7;
      }

      &:last-child {
        font-size: 12px;
        color: #4a4a4a;

        @media (max-width: 1200px) {
          font-size: 10px;
        }
      }
    }

    .location {
      img {
        margin-inline-end: 10px;
      }
    }
  }
}

.truncate {
  white-space: nowrap;
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
