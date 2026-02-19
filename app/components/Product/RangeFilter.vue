<script setup>
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
</script>

<template>
  <div class="range-filter">
    <p>{{ filter.title }}</p>

    <Slider
      v-model="range"
      :min="filter.min"
      :max="filter.max"
      :rtl="true"
      :tooltips="true"
      :showTooltip="'drag'"
      :marks="{
        [filter.min]: filter.min,
        [filter.max]: filter.max,
      }"
    />
     <div class="slider-labels">
      <span>{{ filter.min }}</span>
      <span>{{ filter.max }}</span>
    </div>
  </div>
</template>
<style>

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
