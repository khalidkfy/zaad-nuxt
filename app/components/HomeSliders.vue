<script setup lang="ts">
const { carouselItems } = usePages();
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
</script>
<template>
  <!-- main sliders -->
  <section class="main-sliders">
    <div class="container">
      <swiper
        :pagination="{
          dynamicBullets: true,
        }"
        :modules="[Pagination]"
        class="mySwiper"
        :slides-per-view="1.4"
        :autoplay="true"
      >
        <swiper-slide v-for="(item, i) in carouselItems" :key="i">
          <NuxtLink href="/">
            <!-- <NuxtImg class="d-block w-100" src="/assets/images/slide1.png" alt="First slide" /> -->
            <picture>
              <source :srcset="item.mobile_image" media="(max-width: 768px)" />

              <NuxtImg
              loading="lazy"
                class="d-block w-100"
                :src="item.src"
                :alt="item.title"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </picture>
          </NuxtLink>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>
<style scoped lang="scss">
.main-sliders {
  a {
    img {
      border-radius: 16px;
    }
  }
  .swiper-slide {
    margin-inline-end: 15px;
  }
}

.slide-img {
  width: 100%;
  height: 400px;
  border-radius: 16px;
  object-fit: cover;
}
</style>
