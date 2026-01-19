<script setup lang="ts">
const props = defineProps({
  filters: {
    required: true,
  },
});

const { t } = useI18n();

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
    return filter.selectedOption
      ? filter?.selectedOption.title
      : t("general.all");
  }

  if (filterType === "range") {
    return filter?.title;
  }
  if (filterType === "checklist") {
    return filter.selectedOption
      ? filter?.selectedOption.slug
      : t("general.all");
  }

  return t("general.all");
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
              <span class="d-flex gap-1 align-items-center">
                {{ filter?.title }}
                <span v-if="filter.selectedOption" class="value">{{
                  filter.selectedOption?.title
                }}</span>

                <span
                  v-if="filter.selectedOption"
                  :style="{
                    backgroundColor: `#${filter.selectedOption.value}`,
                  }"
                  class="color value"
                ></span>
                <span v-else class="value">{{ $t("general.all") }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path
                    d="M5 5L9 1"
                    stroke="#444C4E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5 5L1 1"
                    stroke="#444C4E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </template>
            <template v-else>
              {{ filter?.title }}
              <span class="value">{{ getFilterLabel(filter) }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
              >
                <path
                  d="M5 5L9 1"
                  stroke="#444C4E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 5L1 1"
                  stroke="#444C4E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
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
  <!-- TODO::FILTERS COMPLETE HANDLE TYPE -->
</template>
<style scoped lang="scss">
.products-filter {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  flex-wrap: wrap;
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
    background-color: #f9f9f9;
    color: #b5b5b5;
    padding: 8px;
    font-weight: 500;
    border-radius: 8px;
    min-width: 70px;
    font-size: 14px;
    text-align: center;

    .value {
      color: #444c4e;
      font-size: 14px;
      font-weight: 500;
      padding: 0 7px;
    }
  }
}
</style>
