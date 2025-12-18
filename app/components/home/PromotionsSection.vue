<script setup lang="ts">
const { promotionsSection } = usePages();
const items = promotionsSection.value?.items;
</script>
<template>
    <section aria-label="Marketing Imaged" class="images-section mt-5 pt-5">
        <div class="container">

            <div class="row">
                <div v-for="(item, i) in items" :key="i" class="col-md-6">
                    <picture>
                        <source :srcset="item.mobile_image" media="(max-width: 768px)" />

                        <NuxtImg class="d-block w-100" :src="item.src" :alt="item.title"
                            sizes="(max-width: 768px) 100vw, 1200px" />
                    </picture>
                </div>
            </div>
        </div>
    </section>
</template>