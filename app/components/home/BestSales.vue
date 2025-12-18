<script setup lang="ts">
const { bestSales } = usePages()

const products = bestSales.value?.data;


</script>
<template>
    <section class="best-sales mt-5  pt-5" aria-label="Best Sales Section">
        <div class="container">
            <div class="section-header">
                <h3>{{ bestSales?.title || $t("general.besstSales") }}</h3>
                <NuxtLink href="/">{{ $t("general.showMore") }}</NuxtLink>
            </div>
            <div class="content mt-2" aria-label="Products Best sales">
                <BaseProductsCarousel :items="products" :showControls="true" carouselId="best-sales-carousel" />
            </div>
        </div>
    </section>
</template>
<style scoped lang="scss"></style>