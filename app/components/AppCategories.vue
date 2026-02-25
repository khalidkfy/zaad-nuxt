<script setup lang="ts">
const { productsCategs: categs, servicesCategs } = useCategs();
const { locale } = useI18n();
const isMegaMenuOpen = ref(false);
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
    (a, b) => b.childrens.length - a.childrens.length
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

const router = useRouter();

router.afterEach(() => {
  isMegaMenuOpen.value = false;
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
          <img src="/assets/images/categs.svg" width="24" alt="all" height="24" />
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
        <NuxtLink
          class="me-2 stores-link"
          :title="$t('links.productsStores')"
          :href="$localePath('/stores/products')"
        >
          {{ $t("links.productsStores") }}
        </NuxtLink>
      </div>

      <!-- Mega Menu Dropdown - MOVED OUTSIDE fixed-categs -->
      <Transition name="fade">
        <div v-if="isMegaMenuOpen" class="mega-menu" @mouseleave="isMegaMenuOpen = false">
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
                        <div v-if="activeCateg.stores?.length" class="stores-block mb-5">
                          <p class="content-title">{{ $t("items.chooseBrand") }}</p>

                          <div class="stores-grid">
                            <StoreCard
                              v-for="store in activeCateg.stores"
                              :store="store"
                              :key="store.id"
                            />
                          </div>
                        </div>

                        <div class="mega-items">
                          <p class="content-title">{{ $t("items.recommended") }}</p>
                          <Swiper
                            :key="activeCateg?.id"
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
                              v-for="(item, index) in activeCateg.items.slice(0, 6)"
                              :key="item.id"
                            >
                              <LazyProductCard
                                style-for="mega"
                                :product="item"
                                :key="item.id"
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
                    <span class="visually-hidden">{{ $t("general.wait") }}</span>
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

          <button
            class="mobile-close"
            @click="isMegaMenuOpen = false"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
      </Transition>

      <Marquee :overlay="false" :pause-on-hover="true" :duration="20" gap="2rem">
        <NuxtLink
          class="marquee-item"
          v-for="categ in categs"
          :key="categ.id"
          :href="$localePath(`/products/${categ.slug}`)"
        >
          {{ categ.name }}
        </NuxtLink>
      </Marquee>
    </div>
  </div>
</template>
<style scoped lang="scss">
.stores-link {
  width: auto;
  white-space: nowrap;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 10px 15px;
  font-weight: 500;
  font-size: 14px;
  transition: var(--trans);
  display: inline-block;
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
  z-index: 10001;
  color:#000
}
.holder {
  position: relative;
  align-items: center;

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
  z-index: 10001;

  &.active {
    border-color: var(--main-color);
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 1001;
  background-color: white;
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
    z-index: 100000;
    padding-top: 70px;
  }

  @media (max-width: 576px) {
    padding: 60px 15px 20px;
  }
}

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

.categs-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;

  @media (max-width: 992px) {
    max-height: 300px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 2px;
    }
  }

  .categ-item {
    color: #4a4a4a;
    font-size: 14px;
    padding: 12px 15px;
    font-weight: 500;
    border-radius: 6px;
    transition: var(--trans);
    cursor: pointer;

    &:hover,
    &.active {
      background: #fff;
      color: var(--main-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 768px) {
      padding: 15px;
      font-size: 15px;
      margin-bottom: 5px;
    }
  }
}

.mega-details {
  padding-inline-start: 20px;

  @media (max-width: 992px) {
    padding-inline-start: 0;
    margin-top: 20px;
  }
}

.stores-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 10px;
    justify-content: center;
  }
}

.content-title {
  color: #000;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 16px;
    text-align: center;
    margin-bottom: 20px;
  }
}

.product-swiper {
  position: relative;

  .swiper-slide {
    height: auto;

    @media (max-width: 768px) {
      padding: 5px;
    }
  }

  /* Custom navigation buttons */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    background: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    &::after {
      font-size: 16px;
      color: #333;
    }

    @media (max-width: 768px) {
      width: 32px;
      height: 32px;
      top: 40%;

      &::after {
        font-size: 14px;
      }
    }
  }

  :deep(.swiper-button-disabled) {
    opacity: 0.3;
  }
}

.marquee-item {
  color: #888888;
  font-size: 14px;
  white-space: nowrap;
  transition: var(--trans);
  text-decoration: none;

  @media (max-width: 768px) {
    font-size: 13px;
    margin: 0 10px;
  }

  &:hover {
    text-decoration: underline;
    color: #4a4a4a;
  }
}

.spinner-border {
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .service-column {
    .service-title {
      color: #4a4a4a;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;

      @media (max-width: 768px) {
        font-size: 15px;
      }
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
        text-decoration: none;

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

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 992px) {
  * {
    -webkit-tap-highlight-color: transparent;
  }

  button,
  a {
    cursor: pointer;
  }

  .mega-menu {
    max-width: 100vw;
    overflow-x: hidden;
  }
}

.py-5 {
  @media (max-width: 768px) {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
}

.my-5 {
  @media (max-width: 768px) {
    margin-top: 2rem !important;
    margin-bottom: 2rem !important;
  }
}
</style>
