<script setup lang="ts">
const { t } = useI18n();
useSeo({});
definePageMeta({
    layout: "profile",
    middleware: "authenticated",
    breadcrumbs: [
        {
            name: "links.accountInfo",
            url: '/account/profile'
        },

    ]
})
</script>
<template>
    
</template>