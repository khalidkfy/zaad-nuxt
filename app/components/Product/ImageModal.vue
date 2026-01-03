<script setup>
const props = defineProps({
  images: Array,
  startIndex: Number,
  open: Boolean,
});

const { locale } = useI18n();
const isRTL = locale.value == "ar";
const emit = defineEmits(["close"]);

const activeIndex = ref(props.startIndex || 0);
const hasMultiple = computed(() => props.images.length > 1);

const activeImage = computed(() => props.images[activeIndex.value]);

function close() {
  emit("close");
}

function next() {
  if (activeIndex.value < props.images.length - 1) activeIndex.value++;
}

function prev() {
  if (activeIndex.value > 0) activeIndex.value--;
}


/* Swipe (mobile) */
let startX = 0;

function onTouchStart(e) {
  startX = e.changedTouches[0].clientX;
}

function onTouchEnd(e) {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) > 50) {
    diff < 0 ? next() : prev();
  }
}

/* ESC close */
onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="image-modal"
        role="dialog"
        aria-modal="true"
        @click.self="close"
      >
        <button class="close-btn" @click="close" aria-label="Close">✕</button>

        <div
          class="slider"
          ref="slider"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <Transition name="slide" mode="out-in">
            <NuxtImg
              :key="activeImage.src"
              :src="activeImage.zoomSrc || activeImage.src"
              :alt="activeImage.alt"
              loading="lazy"
              format="webp"
              sizes="90vw"
            />
          </Transition>
        </div>

        <button
          v-if="hasMultiple"
          class="nav prev"
          @click="prev"
          aria-label="Previous image"
        >
          {{ isRTL ? "›" : "‹" }}
        </button>

        <button
          v-if="hasMultiple"
          class="nav next"
          @click="next"
          aria-label="Next image"
        >
          {{ isRTL ? "‹" : "›" }}
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 3rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

.nav.prev {
  left: 1rem;
}
.nav.next {
  right: 1rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
