<script setup lang="ts">
const { dealsSection } = usePages()

const products = dealsSection.value?.data;


</script>
<template>
    <section class="best-sales mt-5  pt-5" aria-label="Best Sales Section">
        <div class="container">
            <div class="section-header">
                <h3>{{ dealsSection?.title || $t("general.besstSales") }}</h3>
                <NuxtLink :href="$localePath('/products')">{{ $t("general.showMore") }}</NuxtLink>
            </div>
            <div class="content mt-2" aria-label="Products Best sales">
                <BaseProductsCarousel :items="products" :showControls="true" carouselId="offers-carousel" />
            </div>
        </div>
    </section>
</template>
<style scoped lang="scss"></style>