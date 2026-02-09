<script setup lang="ts">
const { t } = useI18n();

const route = useRoute();
const id = route.params.id;

// useSeo({
//   description: `${t("links.productsStores")} - ${productsStoreItems?.value?.seller?.store_name}`,
//   // title: `${productsStoreItems?.value?.seller?.store_name}`,
//   title: `${productsStoreItems?.value?.seller?.store_name} - ${productsStoreItems?.value?.seller?.store_category} - ${t("meta.appName")}`,
//   og_image: productsStoreItems?.value?.seller.store_logo,
// });

// const loadMore = async () => {
//   if (!productsStoreItems.value.next_page_url) return;

//   if (!hasMore.value) return;

//   currentPage.value += 1;

//   await getProductsStoreItems(id, true);
// };

const {
    getCategoryStoresLoading: loading,
    getCategoryStores,
    categoryStores: data
} = useStores();

await getCategoryStores(id)
</script>
<template>
    <section class="mt-4">
        <div class="container">
            <div class="breadcrumbs">
                <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
                <div>/</div>
                <NuxtLink active-class="active" :href="$localePath(`/stores/products`)">
                    {{ $t("links.productsStores") }}
                </NuxtLink>
                <div>/</div>
                <NuxtLink active-class="active" :href="$localePath(`/stores/${id}`)">
                    {{ data?.localeTitle }}
                </NuxtLink>
            </div>
        </div>
    </section>
    <section class="mt-4">
        <div class="container">
            <h1 class="h1-title">{{ data?.localeTitle }}</h1>

            <div class="stores">
                <NuxtLink v-for="store in data?.stores?.data" :key="store.id"
                    :href="$localePath(`/stores/products/${store.id}`)" class="store-card">
                    <NuxtImg width="80" height="70" loading="lazy" :src="store.logo" />
                    <span>{{ store.name }}</span>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
<style scss lang="scss">
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

.h1-title {
    font-weight: 700;
    font-size: 24px;
    color: #4A4A4A;
    text-align: center;
    margin-bottom: 30px;
}

.stores {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(12px, 4vw, 40px);

    .store-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        background: #f9f9f9;
        padding: 12px 15px;
        border-radius: 8px;
        transition: var(--trans);
        width: 150px;
        height: 200px;
        text-decoration: none;
        justify-content: center;

        @media (max-width: 768px) {
            min-width: 90px;
            padding: 10px;
        }

        @media (max-width: 576px) {
            min-width: 85px;
            padding: 8px;
        }

        span {
            color: #000;
            font-size: 16px;
            font-weight: 600;
            text-align: center;

            @media (max-width: 768px) {
                font-size: 14px;
            }
        }

        img {
            width: 80px;
            height: 70px;
            object-fit: cover;
            border-radius: 6px;

            @media (max-width: 768px) {
                width: 35px;
                height: 35px;
            }
        }

        &:hover {
            background: #fff;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
        }
    }
}
</style>
