<script setup lang="ts">
const { carouselItems } = usePages();
onMounted(() => {
    if (process.client && window.bootstrap) {
        const el = document.querySelector('#carouselExampleIndicators')

        if (el) {
            new window.bootstrap.Carousel(el, {
                interval: 3000,
                ride: 'carousel',
                pause: false,
                wrap: true
            })
        }
    }
})
</script>
<template>
    <!-- main sliders -->
    <section class="main-sliders">
        <div class="container">
            <div id="carouselExampleIndicators" class="carousel slide">
                <ol class="carousel-indicators">
                    <li v-for="(item, i) in carouselItems" data-bs-target="#carouselExampleIndicators"
                        :data-bs-slide-to="i" :key="i" :class="{ 'active': i == 0 }"></li>
                </ol>
                <div class="carousel-inner">
                    <div v-for="(item, i) in carouselItems" :key="i" class="carousel-item "
                        :class="{ 'active': i == 0 }">
                        <NuxtLink href="/">
                            <!-- <NuxtImg class="d-block w-100" src="/assets/images/slide1.png" alt="First slide" /> -->
                            <picture>
                                <source :srcset="item.mobile_image" media="(max-width: 768px)" />

                                <NuxtImg class="d-block w-100" :src="item.src" :alt="item.title"
                                    sizes="(max-width: 768px) 100vw, 1200px" />
                            </picture>

                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>

</template>
<style scoped lang="scss">
.carousel {
    .carousel-item {
        img {
            height: 400px;
            // object-fit: contain;
            border-radius: 12px;
        }
    }

    .carousel-indicators {
        display: flex;
        align-items: center;
        left: unset;
        right: unset;
        margin: unset;
        inset-inline-start: 40px;
        bottom: 16px;

        li {
            border-radius: 50%;
            width: 8px;
            height: 8px;
            background-color: #fff;
            opacity: 1;
        }

        .active {
            background-color: var(--main-color);
            width: 21px;
            height: 8px;
            border-radius: 27px;
            border: 1px solid var(--main-color);
        }
    }
}
</style>