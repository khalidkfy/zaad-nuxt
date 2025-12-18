<template>
  <div 
    class="marquee-container"
    :class="[
      orientation === 'vertical' ? 'marquee-vertical' : 'marquee-horizontal',
      overlay && 'marquee-overlay',
      pauseOnHover && 'marquee-pause-hover'
    ]"
    :style="{
      '--marquee-duration': `${duration}s`,
      '--marquee-gap': gap
    }"
  >
    <div 
      ref="marqueeContent" 
      class="marquee-content"
      :class="[
        orientation === 'vertical' ? 'marquee-content-vertical' : 'marquee-content-horizontal',
        reverse && 'marquee-reverse'
      ]"
    >
      <div 
        v-for="index in repeat" 
        :key="index" 
        class="marquee-group"
        :class="orientation === 'vertical' ? 'marquee-group-vertical' : 'marquee-group-horizontal'"
        :aria-hidden="index > 1"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  duration?: number
  pauseOnHover?: boolean
  reverse?: boolean
  orientation?: 'horizontal' | 'vertical'
  repeat?: number
  overlay?: boolean
  gap?: string
}>(), {
  duration: 20,
  pauseOnHover: false,
  reverse: false,
  orientation: 'horizontal',
  repeat: 2,
  overlay: true,
  gap: '1rem'
})

const marqueeContent = ref<HTMLElement | null>(null)
</script>

<style scoped>
.marquee-container {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.marquee-content {
  display: flex;
  width: fit-content;
  /* GPU acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Horizontal */
.marquee-horizontal {
  display: flex;
  flex-direction: row;
}

.marquee-content-horizontal {
  flex-direction: row;
  animation: marquee var(--marquee-duration) linear infinite;
}

/* RTL support */
[dir="rtl"] .marquee-content-horizontal {
  animation-name: marquee-rtl;
}

.marquee-group-horizontal {
  display: flex;
  flex-direction: row;
  gap: var(--marquee-gap);
  flex-shrink: 0;
  align-items: center;
  padding-right: var(--marquee-gap);
}

/* Vertical */
.marquee-vertical {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.marquee-content-vertical {
  flex-direction: column;
  height: fit-content;
  animation: marquee-vertical var(--marquee-duration) linear infinite;
}

.marquee-group-vertical {
  display: flex;
  flex-direction: column;
  gap: var(--marquee-gap);
  flex-shrink: 0;
  align-items: center;
}

/* Reverse */
.marquee-reverse {
  animation-direction: reverse;
}

/* Pause on hover */
.marquee-pause-hover:hover .marquee-content {
  animation-play-state: paused;
}

/* Overlay gradients */
.marquee-overlay::before,
.marquee-overlay::after {
  content: '';
  position: absolute;
  z-index: 2;
  pointer-events: none;
}

.marquee-horizontal.marquee-overlay::before {
  left: 0;
  top: 0;
  bottom: 0;
  width: 33.333%;
  background: linear-gradient(to right, white, transparent);
}

.marquee-horizontal.marquee-overlay::after {
  right: 0;
  top: 0;
  bottom: 0;
  width: 33.333%;
  background: linear-gradient(to left, white, transparent);
}

.marquee-vertical.marquee-overlay::before {
  top: 0;
  left: 0;
  right: 0;
  height: 33.333%;
  background: linear-gradient(to bottom, white, transparent);
}

.marquee-vertical.marquee-overlay::after {
  bottom: 0;
  left: 0;
  right: 0;
  height: 33.333%;
  background: linear-gradient(to top, white, transparent);
}

/* Animations */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% / v-bind(repeat)));
  }
}

@keyframes marquee-rtl {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(100% / v-bind(repeat)));
  }
}

@keyframes marquee-vertical {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(calc(-100% / v-bind(repeat)));
  }
}
</style>