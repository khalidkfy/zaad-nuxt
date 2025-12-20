<script setup lang="ts">
const { getCategs } = useCategs();

await getCategs();
const route = useRoute();
const breadcrumbs = route.meta.breadcrumbs;

const { getProfileRes, getProfileLoading, profileData } = useProfile();

onMounted(async () => {
  await getProfileRes();
  console.log(profileData.value);
});
</script>
<template>
  <AppHeader layout="app" />

  <main>
    <LazyWhatsApp />

    <section class="mt-3">
      <div class="container">
        <div class="breadcrumbs">
          <NuxtLink :href="$localePath('index')">{{
            $t("links.home")
          }}</NuxtLink>
          <div>/</div>
          <template v-for="(breadcrumb, i) in breadcrumbs">
            <NuxtLink class="active" :href="$localePath(breadcrumb?.url)">
              {{ $t(breadcrumb?.name) }}
            </NuxtLink>
            <div v-if="i + 1 != breadcrumbs.length">/</div>
          </template>
        </div>
      </div>
    </section>
    <section class="mt-3">
      <div class="container">
        <div class="content">
          <div class="row">
            <div class="col-md-4">
              <div class="user-info-card">
                <template v-if="!getProfileLoading">
                  <div class="info text-center">
                    <NuxtImg
                      width="117"
                      height="117"
                      :src="profileData?.profile?.image ??'/assets/images/user.svg'"
                      :alt="profileData?.name"
                    />
                    <div class="name">{{ profileData?.name }}</div>
                    <div class="id">#{{ profileData?.id }}</div>
                  </div>
                  <div class="contact">
                    <div>
                      <NuxtImg
                        width="20"
                        height="20"
                        src="/assets/images/phone.svg"
                        alt="phone"
                      />
                      <span dir="ltr">+{{ profileData?.mobile }}</span>
                    </div>
                    <div>
                      <NuxtImg
                        width="20"
                        height="20"
                        src="/assets/images/message.svg"
                        alt="email"
                      />
                      <span dir="ltr">{{ profileData?.email }}</span>
                    </div>
                  </div>
                  <hr class="my-5" />
                  <div
                    class="address"
                    v-for="(address, i) in profileData?.address"
                    :key="i"
                  >
                    <NuxtImg
                      width="20"
                      height="20"
                      src="/assets/images/loca.svg"
                      alt="location"
                    />
                    <div>
                      <span>العنوان</span>
                      <span>مصر - الشاهرة الجديده</span>
                    </div>
                  </div>
                  <button class="add-address">اضافة عنوان جديد</button>
                </template>
                <template v-else>
                  <div>
                    <div class="info text-center">
                      <div
                        style="width: 117px; height: 117px"
                        class="skeleton circular mx-auto"
                      ></div>
                      <div class="skeleton my-3 name text"></div>
                      <div class="skeleton id text"></div>
                    </div>
                    <div class="contact">
                      <div class="skeleton text"></div>
                    </div>
                    <div class="skeleton rectangular"></div>
                    <div class="skeleton my-5 rectangular"></div>
                    <div class="skeleton my-5 text"></div>
                    <div class="skeleton my-5 text"></div>
                  </div>
                </template>
              </div>
            </div>
            <div class="col-md-8">
              <div class="d-flex flex-column justify-content-between h-100">
                <div class="profile-links">
                  <NuxtLink
                    active-class="active"
                    class="btn"
                    :href="$localePath('/account/profile')"
                  >
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
                    {{ $t("links.accountInfo") }}
                  </NuxtLink>
                  <NuxtLink
                    active-class="active"
                    class="btn"
                    :href="$localePath('/account/profile/security')"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_170_3095)">
                        <path
                          d="M5 13C5 12.4696 5.21071 11.9609 5.58579 11.5858C5.96086 11.2107 6.46957 11 7 11H17C17.5304 11 18.0391 11.2107 18.4142 11.5858C18.7893 11.9609 19 12.4696 19 13V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V13Z"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11 16C11 16.2652 11.1054 16.5196 11.2929 16.7071C11.4804 16.8946 11.7348 17 12 17C12.2652 17 12.5196 16.8946 12.7071 16.7071C12.8946 16.5196 13 16.2652 13 16C13 15.7348 12.8946 15.4804 12.7071 15.2929C12.5196 15.1054 12.2652 15 12 15C11.7348 15 11.4804 15.1054 11.2929 15.2929C11.1054 15.4804 11 15.7348 11 16Z"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M8 11V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V11"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_170_3095">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    {{ $t("links.accountsecurity") }}
                  </NuxtLink>
                  <NuxtLink
                    active-class="active"
                    class="btn"
                    :href="$localePath('/account/profile/adresses')"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_170_3087)">
                        <path
                          d="M9 11C9 11.7956 9.31607 12.5587 9.87868 13.1213C10.4413 13.6839 11.2044 14 12 14C12.7956 14 13.5587 13.6839 14.1213 13.1213C14.6839 12.5587 15 11.7956 15 11C15 10.2044 14.6839 9.44129 14.1213 8.87868C13.5587 8.31607 12.7956 8 12 8C11.2044 8 10.4413 8.31607 9.87868 8.87868C9.31607 9.44129 9 10.2044 9 11Z"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M17.657 16.657L13.414 20.9C13.039 21.2746 12.5306 21.4851 12.0005 21.4851C11.4704 21.4851 10.962 21.2746 10.587 20.9L6.343 16.657C5.22422 15.5382 4.46234 14.1127 4.15369 12.5609C3.84504 11.009 4.00349 9.40051 4.60901 7.93873C5.21452 6.47694 6.2399 5.22754 7.55548 4.3485C8.87107 3.46947 10.4178 3.00029 12 3.00029C13.5822 3.00029 15.1289 3.46947 16.4445 4.3485C17.7601 5.22754 18.7855 6.47694 19.391 7.93873C19.9965 9.40051 20.155 11.009 19.8463 12.5609C19.5377 14.1127 18.7758 15.5382 17.657 16.657Z"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_170_3087">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    {{ $t("links.accountAdresses") }}
                  </NuxtLink>
                  <NuxtLink
                    active-class="active"
                    class="btn"
                    :href="$localePath('/account/profile/bank-transfers')"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_170_3072)">
                        <path
                          d="M3 8C3 7.20435 3.31607 6.44129 3.87868 5.87868C4.44129 5.31607 5.20435 5 6 5H18C18.7956 5 19.5587 5.31607 20.1213 5.87868C20.6839 6.44129 21 7.20435 21 8V16C21 16.7956 20.6839 17.5587 20.1213 18.1213C19.5587 18.6839 18.7956 19 18 19H6C5.20435 19 4.44129 18.6839 3.87868 18.1213C3.31607 17.5587 3 16.7956 3 16V8Z"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M3 10H21"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M7 15H7.01"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11 15H13"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_170_3072">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    {{ $t("links.bank-transfers") }}
                  </NuxtLink>
                  <NuxtLink
                    active-class="active"
                    class="btn"
                    :href="$localePath('/account/profile/disputes')"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_170_3065)">
                        <path
                          d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5C15 5.53043 14.7893 6.03914 14.4142 6.41421C14.0391 6.78929 13.5304 7 13 7H11C10.4696 7 9.96086 6.78929 9.58579 6.41421C9.21071 6.03914 9 5.53043 9 5Z"
                          stroke="#4A4A4A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_170_3065">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    {{ $t("links.disputes") }}
                  </NuxtLink>
                  <NuxtLink
                    active-class="active"
                    class="btn"
                    :href="$localePath('/account/profile/orders')"
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
                    {{ $t("links.orders") }}
                  </NuxtLink>
                </div>
                <div class="profile-content">
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <AppFooter />
</template>
<style lang="scss" scoped>
.profile-content {
  background-color: #f9f9f9;
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 10px;
}
.profile-links {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  a {
    background-color: #f9f9f9;
    color: #4a4a4a;
    font-weight: 500;
    border-radius: 8px;
    transition: var(--trans);
    font-size: 14px;
    &:hover {
      background-color: #e2e2e2;
    }
    &.active {
      background-color: var(--main-color);
      color: #fff;
      svg {
        path {
          stroke: #fff;
        }
      }
    }
  }
}
.skeleton {
  background-color: #d7d7d7;
}

.content {
  min-height: 500px;
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

    &:last-of-type {
      color: #4a4a4a;
      font-weight: 600;
    }
  }

  div {
    color: #888888;
    margin: 0 7px;
  }
}

.user-info-card {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 40px;

  .name {
    font-weight: 500;
    font-size: 20px;
    margin-bottom: 12px;
  }

  .id {
    color: #888888;
    font-weight: 500;
  }

  .contact {
    display: flex;
    justify-content: space-around;
    margin-top: 25px;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      span {
        color: #717171;
      }
    }
  }

  .address {
    display: flex;
    gap: 15px;

    div {
      display: flex;
      flex-direction: column;
      color: #717171;
      font-weight: 500;
    }
  }

  button.add-address {
    width: 100%;
    border: 1px solid #cdcdcd;
    border-radius: 16px;
    padding: 14px;
    background-color: transparent;
    color: #4a4a4a;
    margin-top: 20px;
    font-weight: 700;
    transition: var(--trans);

    &:hover {
      background-color: #e2e2e2;
    }
  }
}
</style>
