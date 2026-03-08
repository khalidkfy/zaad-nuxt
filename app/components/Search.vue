<script setup lang="ts">
const route = useRoute()

const search = ref(route.query.search || "")

watch(
  () => route.query.search,
  (val) => {
    search.value = val || ""
  }
)
const { productsCategs: categs } = useCategs();

const router = useRouter();

const activeCateg = ref(null);

const handleSearch = () => {
  router.push({
    path: activeCateg.value
      ? `/products/${activeCateg.value.slug}`
      : "/products",
    query: {
      search: search.value || undefined
    }
  });
};  
</script>
<template>
  <div class="search-container">
    <form @submit.prevent="handleSearch">
      <div class="dropdown active-categ">
        <button
        type="button"
          class="dropdown-toggle"
          title="Actions"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ activeCateg ? activeCateg?.name : $t("categs.allCategs") }}
        </button>
        <ul class="dropdown-menu">
          <li>
            <div
              @click="activeCateg = null"
              class="categ"
              :class="{ active: activeCateg === null }"
            >
              <img
              loading="lazy"
                :src="
                  activeCateg === null
                    ? '/assets/images/check.svg'
                    : '/assets/images/nocheck.svg'
                "
                width="18"
                height="18"
                alt="check"
              />{{ $t("categs.allCategs") }}
            </div>
          </li>
          <li v-for="(categ, i) in categs">
            <div
              @click="activeCateg = categ"
              class="categ"
              :class="{ active: activeCateg?.id == categ?.id }"
            >
              <img
              loading="lazy"
                :src="
                  activeCateg?.id == categ?.id
                    ? '/assets/images/check.svg'
                    : '/assets/images/nocheck.svg'
                "
                width="18"
                height="18"
                alt="check"
              />
              {{ categ?.name }}
            </div>
          </li>
        </ul>
      </div>

      <input
        id="main-search"
        name="main-search"
        type="search"
        v-model="search"
        :placeholder="$t('search.whatLookingFor')"
      />
      <button class="btn-zaad" type="submit">{{ $t("search.button") }}</button>
    </form>
  </div>
</template>
<style scoped lang="scss">
.search-container {
  font-size: 12px;
  border-radius: 8px;
  background-color: #f2f3f7;
  min-width: 500px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-inline-end: 3px;
  padding-inline-start: 8px;
  margin: 0 auto;
  position: relative;
  .active-categ {
    button {
      border: 0;
      display: flex;
      align-items: center;
      gap: 7px;
      border-radius: 12px;
      padding: 8px 17px;
      color: var(--main-color);
      background-color: transparent;
    }
    .dropdown-toggle {
     &:focus {
       outline: none !important;
     }
    }
    .dropdown-menu {
      max-height: 430px;
      width: 300px;
      overflow-y: auto;
      flex-direction: column;
      padding: 15px;
      z-index: 555555555;
    }
    .categ {
      display: inline-block;
      margin-bottom: 7px;
      cursor: pointer;
      color: #4a4a4a;
      &.active {
        color: var(--main-color);
        font-weight: 500;
      }
      &:hover {
        color: var(--main-color);
      }
      img {
        margin-inline-end: 3px;
      }
    }
  }
  @media (max-width: 1400px) {
    min-width: 300px;
  }
  @media (max-width: 1200px) and (min-width: 992px) {
    margin: 0;
    width: auto;
  }
  @media (max-width: 992px) {
    margin: 0;
  }

  form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    button {
      padding: 8px 17px;
    }
  }

  input {
    background-color: transparent;
    border: 0;
    width: 100%;

    &:focus-visible {
      outline: none;
    }

    &::placeholder {
      color: #8e90a7;
    }
  }
}
</style>
