<template>
  <button
    class="scroll-top"
    :class="{ visible: isVisible }"
    @click="scrollToTop"
    aria-label="Scroll to top"
  >
    ↑
  </button>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isVisible = ref(false)

const toggleVisibility = () => {
  isVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', toggleVisibility)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', toggleVisibility)
})
</script>

<style scoped>
.scroll-top {
  position: fixed;
  bottom: 24px;
  inset-inline-start: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--main-color);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);

  /* hidden state */
  opacity: 0;
  transform: translateY(10px) scale(0.95);
  pointer-events: none;

  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

/* visible state */
.scroll-top.visible {
  opacity: 0.9;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

/* hover effect */
.scroll-top.visible:hover {
  opacity: 1;
  transform: translateY(-2px) scale(1.03);
}
</style>

