<script setup lang="ts">
const props = defineProps({
  page: {
    required: false,
    default: "home",
    type: String,
  },
});
import { Swiper, SwiperSlide } from "swiper/vue";

const { topSellersSection } = usePages();
import { Navigation } from "swiper/modules";
</script>
<template>
  <section class="active-stores mt-5 pt-5">
    <div class="container">
      <p class="text-center mb-4">{{ topSellersSection?.title }}</p>
      <div class="d-flex justify-content-between">
        <div v-if="page === 'home'" class="label me-4">
          <span>{{ topSellersSection?.title }}</span>
        </div>
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="8"
          :slides-per-group="1"
          :space-between="16"
          :autoplay="true"
          :breakpoints="{
            0: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 6 },
          }"
          class="product-swiper"
        >
          <SwiperSlide
            v-for="(item, index) in topSellersSection.data"
            :key="index"
          >
            <NuxtLink :href="$localePath(`/stores/products/${item?.id}`)">
              <NuxtImg
                width="100"
                height="100"
                :src="item.logo"
                class="img-fluid"
                :alt="item.name"
                :title="item.name"
            /></NuxtLink>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.active-stores {
  overflow: hidden;
  p {
    color: #1e1e1e;
    font-size: 24px;
    font-weight: 700;
  }
  img {
    max-width: 100%;
    // width: auto;
  }

  .label {
    span {
      display: inline-block;
      width: 90%;
      font-weight: bold;
    }

    background-color: rgba(0, 74, 152, 0.0509803922);
    border-radius: 16px;
    padding: 18px;
    font-weight: 700;
    color: #1e1e1e;
    width: 186px;
    // height: 104px;
    display: flex;
    font-size: 18px;
    justify-content: center;
    align-items: center;
  }
}
</style>
