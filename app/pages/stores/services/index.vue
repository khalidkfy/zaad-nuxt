<script setup lang="ts">
const { t } = useI18n();

useSeo({
  title: t("links.servicesStores"),
});

const { getServicesStores, servicesStores } = useStores();
await getServicesStores();
console.log(servicesStores.value, "productsStores");
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/stores/services`)">
          {{ $t("links.servicesStores") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-9">
          <div class="stores-content" aria-label="stores by category">
            <div
              :id="`${categ?.localeTitle}`"
              class="category"
              v-for="(categ, i) in servicesStores"
              :key="i"
            >
              <h4>{{ categ?.localeTitle }}</h4>
              <div class="stores">
                <NuxtLink
                  href="#"
                  v-for="(store, i) in categ?.stores"
                  class="store"
                >
                  <NuxtImg 
                    width="50"
                    height="50"
                    :title="store?.name"
                    :alt="store?.name"
                    :src="store?.logo"
                  ></NuxtImg>
                  <h6>{{ store?.name }}</h6>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="summery-links">
            <p class="title">{{ $t("categs.allCategs") }}</p>
            <div class="categs">
              <div v-for="(categ, i) in servicesStores" :key="i">
                <NuxtLink
                  :href="$localePath(`/stores/services#${categ.localeTitle}`)"
                >
                  <span>{{ categ?.localeTitle }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.breadcrumbs {
  display: flex;

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
.summery-links {
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
.stores-content {
  .category {
    margin-bottom: 40px;
    h4 {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .stores {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      .store {
        background-color: #f9f9f9;
        color: #4a4a4a;
        padding: 10px;
        display: flex;
        border-radius: 8px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: var(--trans);
        &:hover {
          color: var(--main-color);
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
