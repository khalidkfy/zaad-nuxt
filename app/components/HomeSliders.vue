<script setup lang="ts">
const { carouselItems } = usePages();
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
const img = useImage(); // This enables the $img helper
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
            <picture>
              <source
                media="(max-width: 768px)"
                :srcset="
                  img(item.mobile_image, {
                    format: 'webp',
                    quality: 80,
                    width: 768,
                  })
                "
              />

              <!-- Desktop Image -->
              <NuxtImg
                :src="item.src"
                :alt="item.title"
                :preload="true"
                fetchpriority="high"
                loading="eager"
                format="webp"
                quality="80"
                class="d-block w-100"
                width="1200"
                height="400"
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
