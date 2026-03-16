<script setup lang="ts">
const { productsCategs } = useCategs();
const props = defineProps({
  activeCateg: {
    required: false,
  },
  activeCategory: {
    required: false,
  },
  filters: {
    required: true,
  },
});

const emit = defineEmits(["filter", "search"]);
const searchTerm = ref("");
const filterItems = () => {
  emit("search", searchTerm?.value);
};
const selectedFilters = reactive<any>({});

const priceFilter = computed(() => props.filters.find((f) => f.slug === "price"));
const onFilterChange = ({ slug, value }) => {

  // check if already slected
  if(selectedFilters[slug] && selectedFilters[slug] == value) {
    // return;
   selectedFilters[slug] = null;
   console.log(selectedFilters[slug], "vselectedFilters[slug]");
   
  } else {
      selectedFilters[slug] = value;

  }

  console.log(selectedFilters, "selectedFilters");
  
  filterByFilterTypes();
};

const filterByFilterTypes = async () => {
  emit("filter", selectedFilters);
};

const showFilter = (filter) => {
  if (filter.type == "category") {
    return false;
  }
  if (filter.slug == "price") {
    return false;
  }

  return true;
};

const route = useRoute();

const categ = route.params.categoryId;

const isFilterOptionSelected = (filter, option) => {
  const filterSlug = filter.slug;

  const selectedFilterSlug = selectedFilters[filterSlug];

  if (selectedFilterSlug == option.slug) {
    return true;
  }
  return false;
};
</script>
<template>
  <div class="products-categ-filter">
    <h6>{{ $t("general.filter") }}</h6>
    <form @submit.prevent="filterItems">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          v-model="searchTerm"
          id="search"
          :placeholder="$t('general.search')"
        />
        <div class="input-group-text">
          <button type="submit" aria-label="search">
            <img loading="lazy" width="16" height="16" src="/assets/images/search.svg" />
          </button>
        </div>
      </div>
    </form>
    <!-- price filter -->
    <ProductRangeFilter
      v-if="priceFilter"
      :filter="priceFilter"
      @change="onFilterChange"
    />
    <!--  category filter -->
    <div class="my-2">{{ $t("categs.shopByCateg") }}</div>
    <div class="accordion filter categs-filter mb-3" id="accordionProductsCategs">
      <div class="accordion-item">
        <h3 class="accordion-header">
          <button
            class="accordion-button collapsed fw-bold"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="`#categ-product`"
            :aria-expanded="categ ? false : false"
          >
            {{ activeCategory ? activeCategory?.name : $t("categs.allCategs") }}
          </button>
        </h3>

        <div
          :id="`categ-product`"
          class="accordion-collapse collapse"
          :class="{ show: categ?.length > 0 }"
          data-bs-parent="#accordionProductsCategs"
        >
          <div class="accordion-body">
            <div class="categs">
              <NuxtLink
                :class="{ active: !activeCateg }"
                :href="$localePath(`/products`)"
              >
                <img
                  :src="
                    !activeCateg
                      ? '/assets/images/check.svg'
                      : '/assets/images/nocheck.svg'
                  "
                  width="18"
                  height="18"
                  alt="check"
                />
                <span>{{ $t("categs.allCategs") }}</span>
              </NuxtLink>
              <div v-for="(categ, i) in productsCategs" :key="i">
                <NuxtLink
                  :class="{ active: activeCateg == categ.slug }"
                  :href="$localePath(`/products/${categ.slug}`)"
                >
                  <img
                    :src="
                      activeCateg == categ.slug
                        ? '/assets/images/check.svg'
                        : '/assets/images/nocheck.svg'
                    "
                    width="18"
                    height="18"
                    alt="check"
                  />
                  <span>{{ categ?.name }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- other filters -->
    <div class="accordion filter product-filters mb-3" id="accordionProductsFilters">
      <template v-for="(filter, i) in filters">
        <div v-if="showFilter(filter)" class="accordion-item">
          <div class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#filter-${i}-${filter.slug}`"
              aria-expanded="false"
            >
              {{ filter?.title }}
            </button>
          </div>

          <div
            :id="`filter-${i}-${filter.slug}`"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionProductsFilters"
          >
            <div class="accordion-body">
              <div class="filter-options">
                <div
                  v-for="(option, i) in filter.options"
                  class="option"
                  @click="
                    onFilterChange({
                      slug: filter.slug,
                      value: option.slug,
                    })
                  "
                >
                  <img
                    :src="
                      isFilterOptionSelected(filter, option)
                        ? '/assets/images/check.svg'
                        : '/assets/images/nocheck.svg'
                    "
                    width="18"
                    height="18"
                    alt="check"
                  />
                  {{ option.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.filter-options {
  .option {
    cursor: pointer;
  }
}
.accordion.filter {
  .accordion-item {
    background-color: transparent !important;
    .accordion-header {
      button {
        background-color: transparent !important;
        font-size: 14px;
        color: #4a4a4a;
        font-weight: 500;
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
}
.filter {
  span.title {
    color: #4a4a4a;
    font-weight: 500;
  }
}
.accordion.categs-filter {
  .accordion-body {
    max-height: 400px;
    overflow-y: scroll;
  }
}
.products-categ-filter {
  > h6 {
    font-weight: 500;
    font-size: 16px;
    color: #4a4a4a;
    margin-bottom: 15px;
  }
  .input-group {
    margin: 20px 0;
    input {
      padding: 12px;
      border-radius: 8px;
      border-color: transparent;
      box-shadow: none;
      background: #fff;
      color: #4a4a4a;
      transition: var(--trans);
      &:focus {
        border-color: var(--main-color);
        border-inline-end: 0;
        + div {
          border-color: var(--main-color);
          border-inline-start: 1px solid;
          border-inline-end: 1px solid;
          border-top: 1px solid;
          border-bottom: 1px solid;
        }
      }
      &::placeholder {
        color: #4a4a4a;
      }
    }

    img {
      background-color: var(--main-color);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      padding: 7px;
      cursor: pointer;
    }

    .input-group-text {
      background: #ffffff80;
      backdrop-filter: blur(20.700000762939453px);
      border: none;
      border-radius: 8px;
      transition: var(--trans);
      button {
        background-color: #fff;
        padding: 0;
        border: 0;
        outline: none;
      }
    }
  }
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 10px;
  position: sticky;
  top: 12px;
  max-height: 100vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
  p.title {
    color: #4a4a4a;
    font-weight: 500;
  }
  .categs {
    display: flex;
    flex-direction: column;
    gap: 10px;
    a {
      color: #4a4a4a;
      font-size: 14px;
      font-weight: 500;
      margin-inline-start: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      &.active {
        color: var(--main-color);
      }
    }
  }
}
</style>
