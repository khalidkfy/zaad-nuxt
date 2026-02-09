<script setup lang="ts">
const { t } = useI18n();

useSeo({
  title: t("links.productsStores"),
});
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
const { getProductsStores, productsStores } = useStores();
await getProductsStores();
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/stores/products`)">
          {{ $t("links.productsStores") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div class="stores-content" aria-label="stores by category">

        <div class="row">
          <div class="col-lg-4 mb-4" v-for="(categ, i) in productsStores" :key="i">
            <div class="category">
              <div class="head">
                <h4>{{ categ?.localeTitle }}</h4>
                <NuxtLink :href="$localePath(`/stores/${categ?.id}`)">
                  عرض المزيد
                </NuxtLink>
              </div>
              <div class="content">
                <Swiper :modules="[Navigation, Autoplay]" :slides-per-view="3" :slides-per-group="1" :space-between="16"
                  :navigation="false" :autoplay="{
                    delay: 3000,
                    disableOnInteraction: false,
                  }" :loop="true" :breakpoints="{
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    992: { slidesPerView: 3 },
                  }" class="product-swiper">
                  <SwiperSlide v-for="(store, i) in categ?.stores" :key="i">
                    <NuxtLink :href="$localePath(`/stores/products/${store.id}`)" class="store-card">
                      <NuxtImg loading="lazy" width="50" height="50" :title="store?.name" :alt="store?.name"
                        :src="store?.logo"></NuxtImg>
                     <span>{{ store.name }}</span>
                    </NuxtLink>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
<style lang="scss" scoped>
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

.stores-content {
  .category {
    background-color: #F9F9F9;
    padding: 20px 10px;
    border-radius: 16px;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    h4 {
      color: #4A4A4A;
      font-size: 16px;
      font-weight: 600;
    }

    a {
      color: var(--main-color);
      font-weight: 600;
      font-size: 14px;
      transition: var(--trans);

      &:hover {
        opacity: 0.9;
      }
    }
  }

  .store-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background: #f9f9f9;
    padding: 12px 15px;
    border-radius: 8px;
    transition: var(--trans);
    min-width: 100px;
    text-decoration: none;

    @media (max-width: 768px) {
      min-width: 90px;
      padding: 10px;
    }

    @media (max-width: 576px) {
      min-width: 85px;
      padding: 8px;
    }

    span {
      color: #4A4A4A;
      font-size: 13px;
      text-align: center;

      @media (max-width: 768px) {
        font-size: 12px;
      }
    }

    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 6px;

      @media (max-width: 768px) {
        width: 35px;
        height: 35px;
      }
    }

    &:hover {
      background: #fff;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }
  }

}
</style>
