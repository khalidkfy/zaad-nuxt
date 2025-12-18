<script setup lang="ts">
const { categs } = useCategs();
const { products } = useProducts()

</script>
<template>
    <section class="preferances mt-5 pt-5" aria-label="Preferances Products">
        <div class="container">
            <div class="section-header">
                <h3>{{ $t("general.preferancesProducts") }}</h3>
                <NuxtLink href="/">{{ $t("general.showMore") }}</NuxtLink>
            </div>
            <div class="categs mt-3">
                <button class="categ" :class="{ 'active': i == 0 }" v-for="(categ, i) in categs">{{ categ.name
                    }}</button>
            </div>
            <div aria-label="Section Products " class="d-flex  mt-3 overflow-hidden">
                <template v-for="(product, i) in products">
                    <LazyProductCard class="mx-2 mb-2" :product="product" />

                </template>
            </div>
        </div>

    </section>
</template>
<style scoped lang="scss">
.preferances {
    .categs {
        display: flex;
        overflow-x: scroll;
        .categ:not(:last-child) {
            margin-inline-end: 10px;
        }

        .categ {
            border: 1px solid #D1D1D1;
            outline: none;
            background-color: transparent;
            padding: 8px;
            border-radius: 8px;
            color: #4A4A4A;
            transition: var(--trans);
            font-size: 14px;
            font-weight: 500;

            &:hover,
            &.active {
                color: var(--main-color);
                border: 1px solid var(--main-color);
            }
        }
    }

}
</style>
