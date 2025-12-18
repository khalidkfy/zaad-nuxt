<script setup>

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    maxPerSlide: {
        type: Number,
        default: 6
    },
    showControls: {
        type: Boolean,
        default: true
    },
    carouselId: {
        type: String,
        default: 'carousel-' + Math.random().toString(36).substring(2, 9)
    }
})

const chunkedItems = computed(() => {
    const chunks = []
    for (let i = 0; i < props.items?.length; i += props.maxPerSlide) {
        chunks.push(props.items.slice(i, i + props.maxPerSlide))
    }
    return chunks
})
</script>
<template>
    <div :id="carouselId" class="carousel slide" data-bs-ride="carousel">

        <!-- SLIDES -->
        <div class="carousel-inner">

            <div v-for="(group, index) in chunkedItems" :key="index" class="carousel-item"
                :class="{ active: index === 0 }">
                <div class="row">

                    <div v-for="(item, i) in group" :key="i" class="col-6 col-md-4 col-lg-2">
                        <LazyProductCard :product="item" />
                    </div>

                </div>
            </div>

        </div>

        <!-- OPTIONAL BUTTONS -->
        <template v-if="showControls && chunkedItems.length > 1">
            <button class="carousel-control-prev control" :data-bs-target="'#' + carouselId" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>

            <button class="carousel-control-next control" :data-bs-target="'#' + carouselId" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </template>

    </div>
</template>
<style lang="scss" scoped>
button.control {
    span {
        background-color: #fff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background-size: 52%;
        border: 1px solid #E4E4E4;
    }
}

[dir=rtl] {
    button.control {
        span {
            scale: -1;
        }
    }
}

/* Make the arrows black */
.carousel-control-prev-icon {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'><path d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0'/></svg>");
}

.carousel-control-next-icon {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'><path d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708'/></svg>");
}
</style>
