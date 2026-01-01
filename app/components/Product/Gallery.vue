<script setup>
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
});
const { t, locale } = useI18n();
const { loggedIn } = useUserSession();

const activeIndex = ref(0);

const activeImage = computed(() => props.images[activeIndex.value]);

const next = () => {
  if (activeIndex.value < props.images.length - 1) {
    activeIndex.value++;
  }
};

const prev = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
  }
};
const handleWhishSubmit = async (product) => {
  if (isFav.value) {
    try {
      await removeFromWhish(product, "product");
      isFav.value = false;
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      await addToWhish(product?.id);
      isFav.value = true;
    } catch (err) {
      console.error(err);
    }
  }
};

const isFav = ref(props?.product?.favorite_item);
console.log(isFav.value, "isFavisFavisFav");

const { addToWhishLoading, addToWhish, removeWhishLoading, removeFromWhish } =
  useWhish();
</script>

<template>
  <div class="product-gallery">
    <!-- Thumbnails (START) -->
    <div class="thumbnails">
      <button
        v-for="(img, index) in images"
        :key="img.src"
        @click="activeIndex = index"
        :class="{ active: index === activeIndex }"
        :aria-label="`${t('general.viewImg')} ${index + 1}`"
      >
        <NuxtImg
          :src="img.src"
          :alt="img.alt"
          width="80"
          height="80"
          loading="lazy"
          format="webp"
        />
      </button>
    </div>

    <!-- Main image -->
    <figure class="main-image">
      <div
        v-if="loggedIn"
        ref="whishRef"
        class="whish"
        :class="{ fav: isFav }"
        :title="
          product?.favorite_item == true ? $t('whish.remove') : $t('whish.add')
        "
        data-bs-toggle="tooltip"
        @click.prevent="handleWhishSubmit(product)"
      >
        <svg
          v-if="!addToWhishLoading && !removeWhishLoading"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 15 15"
          fill="none"
        >
          <g clip-path="url(#clip0_176_1029)">
            <path
              d="M11.7008 7.5432L7.20077 12L2.70077 7.5432C2.40395 7.25437 2.17015 6.90721 2.0141 6.52358C1.85804 6.13996 1.7831 5.72817 1.79401 5.31416C1.80491 4.90015 1.90142 4.49288 2.07746 4.118C2.2535 3.74312 2.50525 3.40875 2.81686 3.13595C3.12847 2.86315 3.49319 2.65782 3.88805 2.53289C4.28292 2.40797 4.69937 2.36615 5.11119 2.41008C5.523 2.45401 5.92127 2.58274 6.28089 2.78815C6.64052 2.99356 6.95372 3.2712 7.20077 3.6036C7.44889 3.27362 7.76245 2.99839 8.12183 2.79517C8.4812 2.59194 8.87866 2.46507 9.28933 2.42251C9.69999 2.37996 10.115 2.42262 10.5084 2.54784C10.9018 2.67305 11.2652 2.87813 11.5757 3.15022C11.8862 3.42231 12.1372 3.75557 12.313 4.12914C12.4888 4.5027 12.5856 4.90853 12.5974 5.32123C12.6091 5.73392 12.5355 6.1446 12.3812 6.52755C12.227 6.91051 11.9953 7.2575 11.7008 7.5468"
              stroke="#4A4A4A"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_176_1029">
              <rect width="14.4" height="14.4" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <div v-else>
          <span class="spinner-border text-dark spinner-border-sm ms-2"></span>
        </div>
      </div>
      <Transition name="fade" mode="out-in">
        <NuxtImg
          :key="activeImage.src"
          :src="activeImage.src"
          :alt="activeImage.alt"
          :width="activeImage.width"
          :height="activeImage.height"
          sizes="(max-width: 768px) 100vw, 600px"
          loading="eager"
          fetchpriority="high"
          format="webp"
        />
      </Transition>

      <!-- Arrows -->
      <button
        class="arrow prev"
        @click="prev"
        :disabled="activeIndex === 0"
        aria-label="prev image"
      >
        ‹
      </button>

      <button
        class="arrow next"
        @click="next"
        :disabled="activeIndex === images.length - 1"
        aria-label="next image"
      >
        ›
      </button>
    </figure>
  </div>
</template>

<style scoped lang="scss">
.whish {
  position: absolute;
  top: 5px;
  inset-inline-start: 5px;
  background-color: #fff;
  cursor: pointer;
  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &.fav {
    svg {
      fill: red !important;
      path {
        stroke: red;
      }
    }
  }
}
/* ===== Desktop layout ===== */
.product-gallery {
  display: grid;
  grid-template-columns: 133px 1fr;
  gap: 1rem;
  align-items: start;
}

/* Thumbnails column */
.thumbnails {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  max-height: 500px;
  overflow-y: scroll;
  padding: 10px 0;
}

.thumbnails button {
  background: #f9f9f9;
  border: 0;
  padding: 10px;
  cursor: pointer;
  border-radius: 12px;
}

.thumbnails button.active {
  outline: 2px solid var(--main-color);
}

/* Main image box */
.main-image {
  position: relative; /* REQUIRED for arrows */
  background: #f6f6f6;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
}

.main-image img {
  max-width: 100%;
}

/* ===== Arrows ===== */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow.prev {
  inset-inline-start: 12px;
}

.arrow.next {
  inset-inline-end: 12px;
}

.arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ===== Mobile layout ===== */
@media (max-width: 768px) {
  .product-gallery {
    grid-template-columns: 1fr;
  }

  .thumbnails {
    flex-direction: row;
    justify-content: center;
    order: 2;
  }

  .main-image {
    order: 1;
  }
}
/* ===== Image fade ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Thumbnail hover ===== */
.thumbnails button {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.thumbnails button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

/* ===== Arrow polish ===== */
.arrow {
  opacity: 0;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.main-image:hover .arrow {
  opacity: 1;
}

.arrow:hover {
  transform: translateY(-50%) scale(1.05);
}

/* Keep arrows visible on touch devices */
@media (hover: none) {
  .arrow {
    opacity: 1;
  }
}
</style>
