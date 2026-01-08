<script setup lang="ts">
const search = ref("");

const activeSearch = computed(()=>{
  return search.value.length > 0 ? 'active': ''
})
</script>
<template>
  <div class="search-container">
    <form action="#">
      <input
        id="main-search"
        name="main-search"
        type="search"
        v-model="search"
        :placeholder="$t('search.whatLookingFor')"
      />
      <button class="btn-zaad" type="submit">{{ $t("search.button") }}</button>
    </form>
    <transition   name="fade-slide" mode="out-in">
    
      <div v-if="search.length > 0" class="search-dropdown" :key="search">
        <span class="spinner-border text-dark spinner-border-sm"></span>
      </div>
    </transition>
  </div>
</template>
<style scoped lang="scss">
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.search-container {
  font-size: 12px;
  border-radius: 8px;
  background-color: #f2f3f7;
  min-width: 500px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-inline-end: 3px;
  padding-inline-start: 8px;
  margin: 0 40px;
  position: relative;
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
  .search-dropdown {
    position: absolute;
    padding: 12px;
    text-align: center;
    border-radius: 8px;
    background-color: #fff;
    width: 100%;
    bottom: -48px;
    inset-inline-end: 50%;
    transform: translateX(-50%);
    z-index: 19912;
    box-shadow: 0px 1px 9px 0 #00000040;
    transition: var(--trans);
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
