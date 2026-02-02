<script setup lang="ts">
const { dealsSection } = usePages();

const products = dealsSection.value?.data;

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
</script>
<template>
  <section class="offers-section mt-5 pt-5" aria-label="offers Section">
    <div class="container">
      <div class="offers-card">
        <div class="row">
          <div class="col-md-4">
            <h3>{{ $t("offers.title") }}</h3>
            <p>{{ $t("offers.text") }}</p>
            <NuxtLink :href="$localePath('/products')">{{ $t("general.showAll") }}</NuxtLink>
          </div>

          <div class="col-md-8">
            <Swiper
              :modules="[Navigation, Autoplay]"
              :slides-per-view="4"
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
                992: { slidesPerView: 4 },
              }"
              class="product-swiper"
            >
              <SwiperSlide v-for="(item, index) in products" :key="index">
                <LazyProductCard cartBg="#ff601c" textColor="#fff" :product="item" />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.offers-card {
  background-color: var(--main-color);
  padding: 35px;
  border-radius: 16px;
  //   display: flex;
  h3 {
    color: #fff;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  p {
    font-weight: 500;
    color: #ffffffb5;
  }
  a {
    background-color: #053B74;
    color: #fff;
    border-radius: 12px;
    padding: 12px;
    margin-top: 20px;
    display: inline-block;
    transition: var(--trans);
    &:hover {
        background-color: #fff;
        color: var(--main-color);
    }
  }
  @media (max-width:992px) {
    h3,p,a {
        margin-bottom: 20px;
    }
    a{
        margin: 20px auto;
        display: inline-block;
    }
  }
}
.product-card .img-box .cart{
    background-color: #ff601c !important;
}
</style>
