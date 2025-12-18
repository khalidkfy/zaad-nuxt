<script setup lang="ts">
const { products } = useProducts()

</script>
<template>
    <section class="special-section mt-5 pt-5" aria-label="Special Section">
        <div class="container">
            <div class="special">
                <div class="row">
                    <div class="col-md-4 mb-4">
                        <h2>الهدايا مميزة للمناسبات الخاصة</h2>
                        <p>عروض لا تنتهي هدايا مميزة بتغليف مميز </p>
                        <NuxtLink href="/" class="btn-zaad mt-3 d-inline-block">{{ $t("general.showAll") }}</NuxtLink>
                    </div>
                    <div class="col-lg-8">
                        <div class="row">
                            <div v-for="(product, i) in products" class="col-lg-3 mb-4">
                                <LazyProductCard discountedPriceColor="#E7E7E7" :showCateg="false" textColor="#fff" v-if="i < 4" class="mx-2 mb-2" :product="product" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped lang="scss">
.special {
    background-color: var(--main-color);
    border-radius: 16px;
    padding: 30px;

    h2 {
        color: #fff;
        font-size: 32px;
    }

    p {
        color: #FFFFFFB5;
    }

    .btn-zaad {
        background-color: #053B74;
        padding: 10px;

        &:hover {
            background-color: #fff;
            color: #053B74;
        }
    }


}

</style>