<script setup lang="ts">
import Slider from "@vueform/slider";
import "@vueform/slider/themes/default.css";

const props = defineProps({
  filter: Object,
});

const emit = defineEmits(["change"]);

const range = ref([props.filter.min, props.filter.max]);

watch(range, (val) => {
  emit("change", {
    slug: props.filter.slug,
    value: `${val[0]},${val[1]}`,
  });
});

const { locale } = useI18n();

const displayRange = computed(() => {
  if (locale.value === "ar") {
    return [range.value[1], range.value[0]]; // swap for tooltip display
  }
  return range.value;
});
</script>

<template>
  <div class="range-filter">
    <p class="title">{{ filter.title }}</p>

    <Slider
      v-model="range"
      :min="filter.min"
      :max="filter.max"
      :direction="locale === 'ar' ? 'rtl': 'ltr'"
      :tooltips="true"
      :showTooltip="'drag'"
    />
    <div :class="{'flex-row-reverse': locale === 'ar'}" class="slider-labels">
      <span>{{ displayRange[0] }}</span>
      <span>{{ displayRange[1] }}</span>
    </div>
  </div>
</template>
<style>
p.title {
  color: #4a4a4a;
  font-weight: 500;
}
.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 12px;
  color: #777;
}

/* Selected active range */
.slider-connect {
  background-color: var(--main-color) !important;
}

/* Handles */
.slider-handle {
  background-color: var(--main-color) !important;
  border: 2px solid white !important;
  box-shadow: 0 0 0 1px #ccc;
  width: 18px;
  height: 18px;
}
.slider-tooltip {
  background: var(--main-color) !important;
  color: white !important;
}

.slider-tooltip:before {
  border-top-color: #111 !important;
}
</style>
