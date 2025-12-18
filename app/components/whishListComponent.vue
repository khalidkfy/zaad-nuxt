<script setup lang="ts">
const { getFavCount, favCount } = useWhish()

await getFavCount();
</script>
<template>
    <NuxtLink area-label="Whish" :href="$localePath('whish-list')" class="whish-header">
        <NuxtImg class="me-2" width="28" height="28" alt="location" src="/assets/images/whish.svg" />
        <div class="whish">
            <span class="whish-badge">{{ favCount }}</span>
            <span>{{ $t("whish.title") }}</span>
        </div>
    </NuxtLink>
</template>
<style scoped lang="scss">
.whish-header {
    display: flex;
    align-items: center;

    .whish {
        display: flex;
        flex-direction: column;
        color: #4A4A4A;
        font-size: 12px;
        font-weight: 600;
        margin-top: 3px;

        .whish-badge {
            color: #ffffff;
            background-color: var(--main-color);
            text-align: center;
            border-radius: 33px;
            padding: 0 8px;
        }
    }
}
</style>
