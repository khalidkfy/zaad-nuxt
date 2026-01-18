<script setup lang="ts">
const props = defineProps({
  filters: {
    required: true,
  },
});

const useFilters = computed(() => {
  const filters = props.filters;

  filters.forEach((filter) => {
    filter.selectedOption = null;
  });

  return filters;
});

onMounted(() => {
  console.log(props.filters);
});

const showFilter = (filter: any) => {
  const filterType = filter?.type;

  if (filterType == "brand") {
    return filter?.options.length;
  }
  return true;
};

const filterOptionsType = (filter: any) => {
  if (filter?.type == "brand") {
    return "dropdown";
  }
  return filter?.type;
};
const getFilterLabel = (filter: any) => {
  const filterType = filterOptionsType(filter);
  if (filterType === "dropdown") {
    return filter.selectedOption ? filter?.selectedOption.title : filter?.title;
  }

  if (filterType === "range") {
    return filter?.title;
  }
  if (filterType === "checklist") {
    return filter.selectedOption ? filter?.selectedOption.slug : filter?.title;
  }

  return filter?.title;
};
</script>
<template>
  <div class="products-filter">
    <template v-for="filter in useFilters">
      <div
        v-if="showFilter(filter)"
        class="filter"
        :class="{ selected: filter?.selectedOption }"
      >
        <div class="dropdown">
          <button
            class="nav-link d-inline-block"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <template v-if="filterOptionsType(filter) === 'color-picker'">
              <div class="d-flex gap-1 align-items-center">
                <span>
                  {{
                    filter.selectedOption
                      ? filter.selectedOption?.title
                      : filter?.title
                  }}</span
                >
                <span
                  v-if="filter.selectedOption"
                  :style="{
                    backgroundColor: `#${filter.selectedOption.value}`,
                  }"
                  class="color"
                ></span>
              </div>
            </template>
            <template v-else>
              {{ getFilterLabel(filter) }}
            </template>
          </button>
          <ul class="dropdown-menu">
            <p>{{ filter?.title }}</p>
            <template v-if="filterOptionsType(filter) === 'dropdown'">
              <li v-for="(option, i) in filter?.options" :key="i">
                <span
                  @click.prevent="
                    filter.selectedOption &&
                    filter.selectedOption?.id == option?.id
                      ? (filter.selectedOption = null)
                      : (filter.selectedOption = option)
                  "
                  class="option"
                  :class="{ active: filter?.selectedOption?.id == option?.id }"
                >
                  {{ option?.title }}</span
                >
              </li>
            </template>
            <template v-if="filterOptionsType(filter) === 'range'">
              <!-- TODO::RANGE PRICE -->
              <input
                class="form-range"
                v-model="filter.value"
                min="100"
                max="5000"
                type="range"
              />
            </template>
            <template v-if="filterOptionsType(filter) === 'color-picker'">
              <li v-for="(option, i) in filter?.options" :key="i">
                <span
                  @click.prevent="
                    filter.selectedOption &&
                    filter.selectedOption?.slug == option?.slug
                      ? (filter.selectedOption = null)
                      : (filter.selectedOption = option)
                  "
                  class="option"
                  :class="{
                    active: filter?.selectedOption?.slug == option?.slug,
                  }"
                >
                  <div class="d-flex gap-1 align-items-center">
                    <span> {{ option?.title }}</span>
                    <span
                      :style="{ backgroundColor: `#${option.value}` }"
                      class="color"
                    ></span>
                  </div>
                </span>
              </li>
            </template>
            <template v-if="filterOptionsType(filter) === 'checklist'">
              <li
                @click.prevent="
                  filter.selectedOption &&
                  filter.selectedOption?.slug == option?.slug
                    ? (filter.selectedOption = null)
                    : (filter.selectedOption = option)
                "
                v-for="(option, i) in filter?.options"
                :key="i"
              >
                <span
                  class="option"
                  :class="{
                    active: filter?.selectedOption?.slug == option?.slug,
                  }"
                >
                  {{ option?.slug }}</span
                >
              </li>
            </template>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
<style scoped lang="scss">
.products-filter {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  .color {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    display: inline-block;
  }
  .dropdown-menu {
    z-index: 989898;
    padding: 10px;
    margin-top: 13px !important;

    p {
      margin-bottom: 3px;
      font-size: 14px;
      color: #828282;
    }
    .option {
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      color: #000;
      &.active {
        color: var(--main-color);
      }
    }
  }
  .filter {
    background-color: #e1e1e1;
    color: #4a4a4a;
    padding: 8px;
    border-radius: 8px;
    min-width: 70px;
    text-align: center;
    &.selected {
      background-color: var(--main-color);
      color: #fff;
    }
  }
}
</style>
