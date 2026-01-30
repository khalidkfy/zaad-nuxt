<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  maxPerSlide: {
    type: Number,
    default: 6,
  },
  showControls: {
    type: Boolean,
    default: true,
  },
  carouselId: {
    type: String,
    default: "carousel-" + Math.random().toString(36).substring(2, 9),
  },
});

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
</script>
<template>
  <Swiper
    :modules="[Navigation, Autoplay]"
    :slides-per-view="6"
    :slides-per-group="1"
    :space-between="16"
    :navigation="showControls"
    :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
    }"
    :loop="true"
    :breakpoints="{
      0: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 6 },
    }"
    class="product-swiper"
  >
    <SwiperSlide v-for="(item, index) in items" :key="index">
      <LazyProductCard :product="item" />
    </SwiperSlide>
  </Swiper>
</template>
<style lang="scss" scoped></style>
