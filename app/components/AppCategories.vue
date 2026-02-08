<script setup lang="ts">
const { productsCategs: categs, servicesCategs } = useCategs();
const { locale } = useI18n();
const isMegaMenuOpen = ref(true);
const activeTab = ref<"shopBy" | "services">("shopBy");

const shopByMenuShown = ref(false);
const servicesMenuShown = ref(false);

const maxItems = 5;
const expandedServices = ref<Set<number>>(new Set());
const toggleShowMore = (serviceId: number) => {
  expandedServices.value.has(serviceId)
    ? expandedServices.value.delete(serviceId)
    : expandedServices.value.add(serviceId);
};
const visibleChildren = (service: any) => {
  return expandedServices.value.has(service.id)
    ? service.childrens
    : service.childrens.slice(0, maxItems);
};
const sortedServices = computed(() => {
  return [...servicesCategs.value].sort(
    (a, b) => b.childrens.length - a.childrens.length,
  );
});
const megaLoading = ref(true);

const megaData = ref(null);
const getMegaMenu = async () => {
  try {
    megaLoading.value = true;
    const res = await $fetch("/api/categs/mega", {
      headers: {
        Lang: locale.value,
      },
    });

    megaData.value = res?.data;

    console.log(res, "asdadasd");
  } catch (err) {
    console.error(err);
  } finally {
    megaLoading.value = false;
  }
};

const activeCateg = ref<any>(null);

watch(megaData, (val) => {
  if (val?.length) {
    activeCateg.value = val[0]; // default first categ
  }
});

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
onMounted(async () => {
  await getMegaMenu();
});
</script>
<template>
  <div class="container position-relative">
    <div class="d-flex holder mt-3" area-label="App Categories">
      <div class="fixed-categs">
        <!-- Shop By Button -->
        <button
          class="all-categs me-2"
          title="all categories"
          :class="{ active: isMegaMenuOpen && activeTab === 'shopBy' }"
          @click.prevent="
            isMegaMenuOpen = !isMegaMenuOpen;
            activeTab = 'shopBy';
          "
        >
          <img
            src="/assets/images/categs.svg"
            width="24"
            alt="all"
            height="24"
          />
          <span class="ps-2">{{ $t("categs.shopBy") }}</span>
        </button>

        <!-- Services Button -->
        <!-- <button
          class="services me-2"
          title="services"
          :class="{ active: isMegaMenuOpen && activeTab === 'services' }"
         
          @click.prevent="
            isMegaMenuOpen = !isMegaMenuOpen;
            activeTab = 'services';
          "
        >
          <img
            src="/assets/images/services.svg"
            width="24"
            alt="all"
            height="24"
          />
          <span class="ps-2">{{ $t("categs.services") }}</span>
        </button> -->
      </div>

      <!-- Mega Menu Dropdown - MOVED OUTSIDE fixed-categs -->
      <Transition name="fade">
        <div
          v-if="isMegaMenuOpen"
          class="mega-menu"
          @mouseleave="isMegaMenuOpen = true"
        >
          <!-- Shop By Content -->
          <div v-show="activeTab === 'shopBy'" class="mega-menu-content">
            <template v-if="!megaLoading">
              <template v-if="megaData">
                <div class="categs-content">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="categs-grid">
                        <div
                          v-for="categ in megaData"
                          :key="categ.id"
                          class="categ-item"
                          :class="{ active: activeCateg?.id === categ.id }"
                          @mouseenter="activeCateg = categ"
                        >
                          {{ categ.localeTitle || categ.title }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-8" v-if="activeCateg">
                      <div class="mega-details">
                        <!-- STORES -->
                        <div
                          v-if="activeCateg.stores?.length"
                          class="stores-block mb-5"
                        >
                          <p class="content-title">اختار حسب البراند</p>

                          <div class="stores-grid">
                            <NuxtLink
                              v-for="store in activeCateg.stores"
                              :key="store.id"
                              :href="$localePath(`/stores/${store.id}`)"
                              class="store-card"
                            >
                              <img :src="store.logo" />
                              <span>{{ store.name }}</span>
                            </NuxtLink>
                          </div>
                        </div>

                        <div class="mega-items">
                          <p class="content-title">منتجات موصى بها لك</p>
                          <Swiper
                            v-if="activeCateg.items?.length"
                            :modules="[Navigation, Autoplay]"
                            :slides-per-view="3"
                            :slides-per-group="1"
                            :space-between="16"
                            :navigation="true"
                            :autoplay="{
                              delay: 3000,
                              disableOnInteraction: false,
                            }"
                            :loop="true"
                            :breakpoints="{
                              0: { slidesPerView: 2 },
                              768: { slidesPerView: 3 },
                              992: { slidesPerView: 3 },
                            }"
                            class="product-swiper"
                          >
                            <SwiperSlide
                              v-for="(item, index) in activeCateg.items.slice(
                                0,
                                6,
                              )"
                              :key="index"
                            >
                              <LazyProductCard
                                style-for="mega"
                                :product="item"
                              />
                            </SwiperSlide>
                          </Swiper>
                        </div>
                        <!-- ITEMS -->
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row">
                  <div class="col text-center py-5 my-5">
                    <p class="mt-3">لا يوجد بيانات</p>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              <div class="row">
                <div class="col text-center py-5 my-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">{{
                      $t("general.wait")
                    }}</span>
                  </div>
                  <p class="mt-3">{{ $t("general.wait") }}</p>
                </div>
              </div>
            </template>
          </div>

          <!-- Services Content -->
          <div v-show="activeTab === 'services'" class="mega-menu-content">
            <div class="services-grid">
              <div
                v-for="service in sortedServices"
                :key="service.id"
                class="service-column"
              >
                <h3 class="service-title">{{ service.name }}</h3>
                <div class="service-links">
                  <NuxtLink
                    v-for="serviceItem in visibleChildren(service)"
                    :key="serviceItem.id"
                    class="service-link"
                    :href="$localePath('index')"
                    @click="isMegaMenuOpen = false"
                  >
                    {{ serviceItem.name }}
                  </NuxtLink>
                </div>
                <button
                  v-if="service.childrens.length > maxItems"
                  class="show-more"
                  @click.prevent="toggleShowMore(service.id)"
                >
                  {{
                    expandedServices.has(service.id)
                      ? $t("general.showLess")
                      : $t("general.showMore")
                  }}
                </button>
              </div>
            </div>
          </div>

          <!-- Close button for mobile -->
          <button
            class="mobile-close"
            @click="isMegaMenuOpen = false"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
      </Transition>

      <Marquee
        :overlay="false"
        :pause-on-hover="true"
        :duration="20"
        gap="2rem"
      >
        <NuxtLink
          class="marquee-item"
          v-for="categ in categs"
          :key="categ.id"
          :href="$localePath(`/products/${categ.id}`)"
        >
          {{ categ.name }}
        </NuxtLink>
      </Marquee>
    </div>
  </div>
</template>

<style scoped lang="scss">
.holder {
  position: relative;
  align-items: center; /* Align items to top */

  @media (max-width: 992px) {
    flex-wrap: wrap;
  }
}

.fixed-categs {
  display: flex;
  position: relative;
  z-index: 1000;

  @media (max-width: 992px) {
    margin: 25px 0;
    width: 100%;
    justify-content: center;
  }

  button {
    white-space: nowrap;
    border-color: transparent;
  }
}

.all-categs,
.services {
  border-radius: 8px;
  padding: 10px 15px;
  font-weight: 500;
  font-size: 14px;
  transition: var(--trans);
  display: inline-block;
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
  z-index: 10001; /* Higher than mega menu */

  &.active {
    border-color: var(--main-color);
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.all-categs {
  color: #4a4a4a;
  background-color: #f2f3f7;

  &.active {
    background-color: white;
  }
}

.services {
  color: #004a98;
  background-color: #e7ebffad;

  &.active {
    background-color: white;
  }
}

/* Mega Menu Styles - POSITIONED RELATIVE TO HOLDER */
.mega-menu {
  position: absolute;
  top: 100%; /* Position below the holder */
  left: 0;
  width: 100%;
  z-index: 1001;
  background-color: white;
  z-index: 9999;
  margin-top: 10px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #eee;

  @media (max-width: 992px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    border-radius: 0;
    overflow-y: auto;
    z-index: 100000; /* Very high for mobile */
  }
}

/* Make sure the mega menu aligns properly */
.container {
  position: relative;
}

/* Ensure the mega menu has proper width calculation */
.mega-menu {
  width: calc(100% - var(--bs-gutter-x, 1.5rem));
  margin-left: calc(var(--bs-gutter-x, 1.5rem) * 0.5);

  @media (max-width: 992px) {
    width: 100%;
    margin-left: 0;
  }
}

.mega-menu-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  .tab-button {
    padding: 0.5rem 1.5rem;
    background: none;
    border: none;
    color: #666;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    transition: var(--trans);

    &.active {
      color: var(--main-color);
      background-color: #e7ebffad;
    }

    &:hover {
      color: var(--main-color);
    }
  }
}

.mega-menu-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.categs-content {
  .content-title {
    color: #000;
    font-weight: 500;
    font-size: 14px;
  }
  .categs-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #f9f9f9;

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;

    /* Webkit (Chrome, Edge, Safari) */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: transparent;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    /* Show scrollbar only on hover */
    &:hover {
      scrollbar-color: rgba(0, 0, 0, 0.25) transparent;

      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.25);
      }
    }

    .categ-item {
      color: #4a4a4a;
      font-size: 14px;
      padding: 10px;
      font-weight: 500;
      border-radius: 4px;
      transition: var(--trans);

      &:hover,
      &.active {
        background: #fff;
        color: var(--main-color);
      }
    }
  }
  .mega-details {
    padding-inline-start: 20px;
  }

  .stores-grid {
    display: flex;
    flex-wrap: wrap;

    gap: 15px;

    .store-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      background: #f9f9f9;
      padding: 8px 12px;
      border-radius: 8px;
      transition: var(--trans);
      span {
        color: #4A4A4A;
      }
      img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 6px;
      }

      &:hover {
        background: #fff;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      }
    }
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;

    .item-card {
      display: block;
      background: #f9f9f9;
      border-radius: 10px;
      padding: 10px;
      transition: var(--trans);

      img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 8px;
      }

      h6 {
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 4px;
        color: #333;
      }

      .price {
        font-size: 12px;
        color: var(--main-color);
        font-weight: 600;
      }

      &:hover {
        background: white;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;

  .service-column {
    .service-title {
      color: #4a4a4a;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }

    .service-links {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .service-link {
        color: #666;
        font-size: 14px;
        transition: var(--trans);
        display: block;

        &:hover {
          color: var(--main-color);
          padding-left: 5px;
        }
      }
    }

    .show-more {
      margin-top: 15px;
      background: none;
      border: none;
      color: var(--main-color);
      cursor: pointer;
      font-size: 14px;
      padding: 5px 0;
      font-weight: 500;
      transition: var(--trans);

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

/* Close button for mobile */
.mobile-close {
  display: none;

  @media (max-width: 992px) {
    display: block;
    position: fixed;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 32px;
    color: #666;
    cursor: pointer;
    z-index: 100001;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    line-height: 1;
  }
}

.marquee-item {
  color: #888888;
  font-size: 14px;
  white-space: nowrap;
  transition: var(--trans);

  &:hover {
    text-decoration: underline;
    color: #4a4a4a;
  }
}

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
