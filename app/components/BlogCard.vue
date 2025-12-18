<script setup lang="ts">
const props = defineProps({
    blog: {
        required: true,
        type: Object
    }
})
</script>
<template>
    <div aria-label="blog">
        <NuxtLink :href="$localePath(`/blog/${blog?.id}`)" class="blog-card">
            <NuxtImg v-if="blog?.image" width="100" height="100" :src="blog?.image" :alt="blog?.title" :title="blog?.title" />
            <div class="content">
                <div class="date">{{ blog?.created_at }}</div>
                <div :title="blog?.title" class="title">{{ blog?.title }}</div>
            </div>
        </NuxtLink>
    </div>
</template>
<style scoped lang="scss">
.blog-card {
    min-height: 353px;
    border-radius: 16px;
    position: relative;
    background: linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, #000000 100%);
    overflow: hidden;
    display: block;

    &:hover {

        .title {
            text-decoration: underline;
        }

        img {
            width: 103%;
            height: 103%;
        }
    }

    img {
        width: 100%;
        position: absolute;
        height: 100%;
        z-index: -1;
        object-fit: cover;
        border-radius: inherit;
        transition: var(--trans);
    }

    .content {
        position: absolute;
        inset-inline-start: 18px;
        bottom: 10%;

        .date {
            color: #fff;
            font-size: 12px;
            transition: var(--trans);

            font-weight: 400;
        }

        .title {
            color: #fff;
            font-weight: 600;
            width: 80%;
            transition: var(--trans);

            margin-top: 10px;
        }

    }

}
</style>