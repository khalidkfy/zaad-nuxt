<script setup lang="ts">
const { productsCategs: categs, servicesCategs } = useCategs();

const shopByMenuShown = ref(false);
const servicesMenuShown = ref(false);

const toggleMenu = (menu: string): void => {
  if (menu === "shopBy") {
    servicesMenuShown.value = false;
    shopByMenuShown.value = !shopByMenuShown.value;
    return;
  }
  shopByMenuShown.value = false;
  servicesMenuShown.value = !servicesMenuShown.value;
  return;
};
const maxItems = 5;
const expandedServices = ref<Set<number>>(new Set());
const toggleShowMore = (serviceId: number) => {
  expandedServices.value.has(serviceId)
    ? expandedServices.value.delete(serviceId)
    : expandedServices.value.add(serviceId);
};
const visibleChildren = (service: any) => {
  return expandedServices.value.has(service.id)
    ? service.childrens
    : service.childrens.slice(0, maxItems);
};
const sortedServices = computed(() => {
  return [...servicesCategs.value].sort(
    (a, b) => b.childrens.length - a.childrens.length
  );
});
</script>
<template>
  <div class="container position-relative">
    <div class="d-flex holder mt-3" area-label="App Categories">
      <div class="fixed-categs">
        <button
          @click.prevent="toggleMenu('shopBy')"
          class="all-categs me-2"
          href="/"
        >
          <NuxtImg
            src="/assets/images/categs.svg"
            width="24"
            alt="all"
            height="24"
          />
          <span class="ps-2">{{ $t("categs.shopBy") }}</span>
        </button>
        <button
          @click.prevent="toggleMenu('services')"
          class="services me-2"
          href="/"
        >
          <NuxtImg
            src="/assets/images/services.svg"
            width="24"
            alt="all"
            height="24"
          />
          <span class="ps-2">{{ $t("categs.services") }}</span>
        </button>
      </div>
      <Marquee
        :overlay="false"
        :pause-on-hover="true"
        :duration="20"
        gap="2rem"
      >
        <NuxtLink
          class="marquee-item"
          v-for="categ in categs"
          :key="categ.id"
          :href="$localePath('index')"
        >
          {{ categ.name }}</NuxtLink
        >
      </Marquee>
    </div>
    <div v-show="shopByMenuShown" class="mega-menu">
      <div class="categs">
        <NuxtLink
          class=""
          v-for="categ in categs"
          :key="categ.id"
          :href="$localePath('index')"
        >
          {{ categ.name }}</NuxtLink
        >
      </div>
    </div>
    <div v-show="servicesMenuShown" class="mega-menu">
      <div class="services-categ">
        <div v-for="service in sortedServices" :key="service.id">
          <h2>{{ service.name }}</h2>

          <div class="service-links">
            <NuxtLink
              v-for="serviceItem in visibleChildren(service)"
              :key="serviceItem.id"
              class="service-link"
              :href="$localePath('index')"
            >
              {{ serviceItem.name }}
            </NuxtLink>
          </div>

          <!-- Show more button -->
          <button
            v-if="service.childrens.length > maxItems"
            class="show-more"
            @click="toggleShowMore(service.id)"
          >
            {{ expandedServices.has(service.id) ? $t("general.showLess") : $t("general.showMore") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.holder {
  @media (max-width: 992px) {
    flex-wrap: wrap;
  }
}

.fixed-categs {
  display: flex;

  @media (max-width: 992px) {
    margin-bottom: 12px;
    width: 100%;
  }

  button {
    white-space: nowrap;
    border-color: transparent;
  }
}

.all-categs {
  color: #4a4a4a;
  border-radius: 8px;
  background-color: #f2f3f7;
  padding: 10px 15px;
  font-weight: 500;
  font-size: 14px;
  transition: var(--trans);
  display: inline-block;
}

.services {
  color: #4a4a4a;
  border-radius: 8px;
  background-color: #f2f3f7;
  padding: 10px 15px;
  font-weight: 500;
  color: #004a98;
  background-color: #e7ebffad;
  font-size: 14px;
  display: inline-block;
}

.marquee-item {
  color: #888888;
  font-size: 14px;
  white-space: nowrap;
  transition: var(--trans);

  &:hover {
    text-decoration: underline;
    color: #4a4a4a;
  }
}

.mega-menu {
  position: absolute;
  width: 100%;
  background-color: #f9f9f9;
  z-index: 9998;
  margin: 20px 0;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  transition: var(--trans);

  .categs {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;

    a {
      color: #4a4a4a;
      font-size: 14px;
      transition: var(--trans);

      &:hover {
        color: var(--main-color);
      }
    }
  }

  .services-categ {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;

    h2 {
      color: #4a4a4a;
      font-size: 14px;
    }

    .service-links {
      display: flex;
      flex-direction: column;
      gap: 15px;

      a {
        color: #4a4a4a;
        font-size: 14px;
        transition: var(--trans);

        &:hover {
          color: var(--main-color);
        }
      }
    }
  }
  .show-more {
    margin-top: 10px;
    background: none;
    border: none;
    color: var(--main-color);
    cursor: pointer;
    font-size: 14px;
    padding: 0;
  }
}
</style>
