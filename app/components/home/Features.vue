<script setup lang="ts">
const { t } = useI18n()

const { siteFacts: feats } = usePages();
</script>
<template>
    <section class="mt-5 pt-5" aria-label="Zaad Features">
        <div class="features">
            <div class="container">
                <div class="row">
                    <div v-for="feat in feats" :key="feat" class="col-md-3">
                        <div class="feature">
                            <!-- <div class="icon">
                            <NuxtImg width="24" height="24" :alt="feat.title" :src="feat.img" />
                        </div> -->
                            <div class="content">
                                <div class="title">{{ feat.title }}</div>
                                <div class="sub">{{ feat.subtitle }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>
<style scoped lang="scss">
.features {
    background-color: #7878780D;
    padding: 30px;
}

.feature {
    display: flex;
    gap: 10px;
    justify-content: center;
    transition: var(--trans);

    &:hover {
        transform: translateY(-2px)
    }

    .title {
        color: #4A4A4A;
        font-weight: 700;
    }

    .sub {
        color: #8F959B;
        font-size: 14px;
    }
}
</style>