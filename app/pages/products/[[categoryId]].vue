<script setup lang="ts">
const { t, locale } = useI18n();
const { productsCategs } = useCategs();
const route = useRoute();

const category_id = computed(() => {
  return route.params.categoryId;
});
// definePageMeta({});
const activeCategory = productsCategs.value.find(
  (item: any) => item.slug == category_id.value
);
const {joinTexts} = useGlobal();
let title = computed(() => {
  category_id.value
    ? `${t("links.products")} - ${activeCategory?.name}`
    : t("links.products");
    return joinTexts(t("links.products"), activeCategory?.name);    

});
const query = route.query;

const isSearch = computed(() => {
  return typeof route.query.search === "string" && route.query.search.length > 0;
});

useSeo({
  title: t("meta.setMeta", { meta: title.value }),
  robots: isSearch.value ? "noindex, follow" : "index, follow",
});

const {
  getProducts,
  productsRes,
  getProductsLoading,
  currentPage,
  hasMore,
} = useProducts();

const selectedFilters = reactive<any>({});

await getProducts(
  {
    categId: category_id.value,
    append: false,
    search: query?.search ?? "",
  },
  selectedFilters
);

const products = computed(() => productsRes.value.resources);
const filters = computed(() => productsRes.value.filters);

const loadMore = async () => {
  if (!productsRes.value.next_page_url) return;

  if (!hasMore.value) return;

  currentPage.value += 1;

  await getProducts(
    {
      categId: category_id.value,
      append: true,
      search: query?.search || pageSearch.value || "",
    },
    pageFilters.value
  );
};

const handleWhishRemove = ({ item, value }) => {
  const product = productsRes.value.resources.find((p: any) => p.id === item.id);
  if (product) {
    product.favorite_item = value;
  }
};

const pageSearch = ref("");
const pageFilters = ref(null);

const filterItems = async (filters: any) => {
  pageFilters.value = filters;
  await getProducts(
    {
      categId: category_id.value,
      append: false,
      search: pageSearch.value,
    },
    filters
  );
};

const searchFilter = async (searchTerm: string) => {
  pageSearch.value = searchTerm;
  await getProducts(
    {
      categId: category_id.value,
      append: false,
      search: pageSearch.value,
    },
    pageFilters.value
  );
};

const isDrawerOpen = ref(false);

watch(isDrawerOpen, (val) => {
  document.body.style.overflow = val ? "hidden" : "";
});
</script>

<template>
  <!-- TODO:: h1 tag -->
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/products`)">
          {{ $t("links.products") }}
        </NuxtLink>
        <template v-if="category_id && activeCategory">
          <div>/</div>
          <NuxtLink active-class="active" :href="$localePath(`/products/${category_id}`)">
            {{ activeCategory?.name }}
          </NuxtLink></template
        >
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <h1 class="page-title mb-5">
        {{ title }}
      </h1>
      <div class="row">
        <div class="col-lg-3 d-none d-lg-block mb-4">
          <ProductsCategsFilter
            :filters="filters"
            @search="searchFilter"
            @filter="filterItems"
            :activeCateg="category_id"
          />
        </div>
        <div class="col-md-9">
          <!-- <ProductsFilter @update="onFilterChange" :filters="productsRes?.filters" /> -->

          <!-- Mobile Filter Button -->

          <button class="mobile-filter-btn d-lg-none" @click="isDrawerOpen = true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-funnel"
              viewBox="0 0 16 16"
            >
              <path
                d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"
              />
            </svg>
            {{ $t("general.filter") }}
          </button>
          <div class="items-container">
            <div v-if="getProductsLoading" class="overlay-loader">
              <span class="indicator-progress f-normal fs-20">
                {{ t("general.wait") }}
                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            </div>
            <div class="row">
              <template v-if="products?.length">
                <div
                  class="col-sm-3 col-6 mb-4"
                  v-for="(product, i) in products"
                  :key="i"
                >
                  <ProductCard
                    :key="product?.id"
                    @removed="handleWhishRemove"
                    :product="product"
                  />
                </div>
              </template>
              <template v-else>
                <div class="no-items">
                  <div>{{ $t("items.noData") }}</div>
                  <NuxtLink :href="$localePath('/stores/products')" class="btn-zaad">{{
                    $t("links.productsStores")
                  }}</NuxtLink>
                </div>
              </template>
            </div>
            <div class="text-center mt-4" v-if="hasMore">
              <button class="btn-zaad" :disabled="getProductsLoading" @click="loadMore">
                <span v-if="getProductsLoading">{{ $t("general.wait") }}</span>
                <span v-else>{{ $t("general.showMore") }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Mobile Filter Drawer -->
    <transition name="slide">
      <div v-if="isDrawerOpen" class="filter-drawer d-lg-none">
        <div class="drawer-header">
          <h6>{{ $t("general.filter") }}</h6>
          <button @click="isDrawerOpen = false">✕</button>
        </div>

        <div class="drawer-content">
          <ProductsCategsFilter
            :filters="filters"
            @search="searchFilter"
            @filter="filterItems"
            :activeCateg="category_id"
          />
        </div>
      </div>
    </transition>
  </section>
</template>
<style scoped lang="scss">
.mobile-filter-btn {
  background-color: var(--main-color);
  color: #ffff;
  border-radius: 8px;
  outline: none;
  padding: 8px;
  border: 1px solid var(--main-color);
  margin-bottom: 15px;
}

.filter-drawer {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  button {
    border: 0;
    background: 0;
  }
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.drawer-footer {
  padding: 16px;
  border-top: 1px solid #eee;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-top: 10px;
}
.no-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  align-items: center;
  position: sticky;
  top: 100px;
}
.items-container {
  position: relative;
  .overlay-loader {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 400;
    background-color: #fff;
    opacity: 0.9;
    text-align: center;
    > span {
      margin-top: 40px;
      display: inline-block;
      position: sticky;
      top: 50%;
    }
  }
}
.breadcrumbs {
  display: flex;
  flex-wrap: wrap;

  a {
    font-size: 14px;
    color: #888888;
    transition: var(--trans);
    font-weight: 500;

    &:hover {
      color: #4a4a4a;
    }

    &.active {
      color: #4a4a4a;
      font-weight: 600;
    }
  }

  div {
    color: #888888;
    margin: 0 7px;
  }
}
</style>
