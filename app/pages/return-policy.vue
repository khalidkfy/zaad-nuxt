<script setup lang="ts">
useSeo({})
const { getReturnPage, returnPage } = usePages();
await getReturnPage();
</script>
<template>
    <div class="page-content">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h1>{{ $t("links.returnPolicy") }}</h1>
                    <div v-html="returnPage?.resource?.html"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.page-content {
    margin-top: 40px;

    h1 {
        color: #4A4A4A;
        font-weight: 700;
        font-size: 24px;
    }
}
</style>
