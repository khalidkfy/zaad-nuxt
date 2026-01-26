<script setup lang="ts">
const { productsCategs: categs, servicesCategs } = useCategs();

const isMegaMenuOpen = ref(false);
const activeTab = ref<"shopBy" | "services">("shopBy");

const shopByMenuShown = ref(false);
const servicesMenuShown = ref(false);

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
    (a, b) => b.childrens.length - a.childrens.length,
  );
});
</script>
<template>
  <div class="container position-relative">
    <div class="d-flex holder mt-3" area-label="App Categories">
      <div class="fixed-categs">
        <!-- Shop By Button -->
        <button
          class="all-categs me-2"
          title="all categories"
          :class="{ active: isMegaMenuOpen && activeTab === 'shopBy' }"
          @mouseenter="
            isMegaMenuOpen = true;
            activeTab = 'shopBy';
          "
          @click="
            isMegaMenuOpen = !isMegaMenuOpen;
            activeTab = 'shopBy';
          "
        >
          <NuxtImg
            src="/assets/images/categs.svg"
            width="24"
            alt="all"
            height="24"
          />
          <span class="ps-2">{{ $t("categs.shopBy") }}</span>
        </button>

        <!-- Services Button -->
        <button
          class="services me-2"
          title="services"
          :class="{ active: isMegaMenuOpen && activeTab === 'services' }"
          @mouseenter="
            isMegaMenuOpen = true;
            activeTab = 'services';
          "
          @click="
            isMegaMenuOpen = !isMegaMenuOpen;
            activeTab = 'services';
          "
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

      <!-- Mega Menu Dropdown - MOVED OUTSIDE fixed-categs -->
      <Transition name="fade">
        <div
          v-if="isMegaMenuOpen"
          class="mega-menu"
          @mouseleave="isMegaMenuOpen = false"
        >
          <!-- Tabs for mobile/desktop -->
          <div class="mega-menu-tabs">
            <button
              class="tab-button"
              :class="{ active: activeTab === 'shopBy' }"
              @click="activeTab = 'shopBy'"
            >
              {{ $t("categs.shopBy") }}
            </button>
            <button
              class="tab-button"
              :class="{ active: activeTab === 'services' }"
              @click="activeTab = 'services'"
            >
              {{ $t("categs.services") }}
            </button>
          </div>

          <!-- Shop By Content -->
          <div v-show="activeTab === 'shopBy'" class="mega-menu-content">
            <div class="categs-grid">
              <NuxtLink
                v-for="categ in categs"
                :key="categ.id"
                :href="$localePath(`/products/${categ.id}`)"
                class="categ-item"
                @click="isMegaMenuOpen = false"
              >
                {{ categ.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Services Content -->
          <div v-show="activeTab === 'services'" class="mega-menu-content">
            <div class="services-grid">
              <div
                v-for="service in sortedServices"
                :key="service.id"
                class="service-column"
              >
                <h3 class="service-title">{{ service.name }}</h3>
                <div class="service-links">
                  <NuxtLink
                    v-for="serviceItem in visibleChildren(service)"
                    :key="serviceItem.id"
                    class="service-link"
                    :href="$localePath('index')"
                    @click="isMegaMenuOpen = false"
                  >
                    {{ serviceItem.name }}
                  </NuxtLink>
                </div>
                <button
                  v-if="service.childrens.length > maxItems"
                  class="show-more"
                  @click.prevent="toggleShowMore(service.id)"
                >
                  {{
                    expandedServices.has(service.id)
                      ? $t("general.showLess")
                      : $t("general.showMore")
                  }}
                </button>
              </div>
            </div>
          </div>

          <!-- Close button for mobile -->
          <button
            class="mobile-close"
            @click="isMegaMenuOpen = false"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
      </Transition>

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
          :href="$localePath(`/products/${categ.id}`)"
        >
          {{ categ.name }}
        </NuxtLink>
      </Marquee>
    </div>
  </div>
</template>

<style scoped lang="scss">
.holder {
  position: relative;
  align-items: center; /* Align items to top */

  @media (max-width: 992px) {
    flex-wrap: wrap;
  }
}

.fixed-categs {
  display: flex;
  position: relative;
  z-index: 1000; 

  @media (max-width: 992px) {
    margin-bottom: 12px;
    width: 100%;
  }

  button {
    white-space: nowrap;
    border-color: transparent;
  }
}

.all-categs,
.services {
  border-radius: 8px;
  padding: 10px 15px;
  font-weight: 500;
  font-size: 14px;
  transition: var(--trans);
  display: inline-block;
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
  z-index: 10001; /* Higher than mega menu */

  &.active {
    border-color: var(--main-color);
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.all-categs {
  color: #4a4a4a;
  background-color: #f2f3f7;

  &.active {
    background-color: white;
  }
}

.services {
  color: #004a98;
  background-color: #e7ebffad;

  &.active {
    background-color: white;
  }
}

/* Mega Menu Styles - POSITIONED RELATIVE TO HOLDER */
.mega-menu {
  position: absolute;
  top: 100%; /* Position below the holder */
  left: 0;
  width: 100%;
  z-index: 999998;
  background-color: white;
  z-index: 9999;
  margin-top: 10px;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #eee;

  @media (max-width: 992px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    border-radius: 0;
    overflow-y: auto;
    z-index: 100000; /* Very high for mobile */
  }
}

/* Make sure the mega menu aligns properly */
.container {
  position: relative;
}

/* Ensure the mega menu has proper width calculation */
.mega-menu {
  width: calc(100% - var(--bs-gutter-x, 1.5rem));
  margin-left: calc(var(--bs-gutter-x, 1.5rem) * 0.5);

  @media (max-width: 992px) {
    width: 100%;
    margin-left: 0;
  }
}

.mega-menu-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  .tab-button {
    padding: 0.5rem 1.5rem;
    background: none;
    border: none;
    color: #666;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    transition: var(--trans);

    &.active {
      color: var(--main-color);
      background-color: #e7ebffad;
    }

    &:hover {
      color: var(--main-color);
    }
  }
}

.mega-menu-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.categs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  .categ-item {
    color: #4a4a4a;
    font-size: 14px;
    padding: 8px 0;
    transition: var(--trans);
    border-radius: 4px;
    padding: 10px;
    display: block;

    &:hover {
      color: var(--main-color);
      background-color: #f8f9fa;
      text-decoration: none;
    }
  }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;

  .service-column {
    .service-title {
      color: #4a4a4a;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }

    .service-links {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .service-link {
        color: #666;
        font-size: 14px;
        transition: var(--trans);
        display: block;

        &:hover {
          color: var(--main-color);
          padding-left: 5px;
        }
      }
    }

    .show-more {
      margin-top: 15px;
      background: none;
      border: none;
      color: var(--main-color);
      cursor: pointer;
      font-size: 14px;
      padding: 5px 0;
      font-weight: 500;
      transition: var(--trans);

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

/* Close button for mobile */
.mobile-close {
  display: none;

  @media (max-width: 992px) {
    display: block;
    position: fixed;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 32px;
    color: #666;
    cursor: pointer;
    z-index: 100001;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    line-height: 1;
  }
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

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
