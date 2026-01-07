<script setup lang="ts">
const { productsCategs } = useCategs();
const props = defineProps({
  activeCateg: {
    required: false,
  },
});

const emit = defineEmits(["filter"]);
const searchTerm = ref("");
const filterItems = () => {
  emit('filter', searchTerm?.value);
};
</script>
<template>
  <div class="products-categ-filter">
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
            <NuxtImg width="16" height="16" src="/assets/images/search.svg" />
          </button>
        </div>
      </div>
    </form>
    <p class="title">{{ $t("categs.allCategs") }}</p>
    <div class="categs">
      <div v-for="(categ, i) in productsCategs" :key="i">
        <NuxtLink
          :class="{ active: activeCateg == categ.id }"
          :href="$localePath(`/products/${categ.id}`)"
        >
          <NuxtImg
            :src="
              activeCateg == categ.id
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
</template>
<style lang="scss" scoped>
.products-categ-filter {
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
        background-color: 0;
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
