<script setup lang="ts">
const { t } = useI18n();

const route = useRoute()
const id = route.params.id;

const { getBlog } = useBlog();

const blog = await getBlog(id);

const metas = computed(() => {
    if (!blog) return [];

    return blog?.data?.meta?.metaTags;
})

const getMeta = (key: string): string | undefined => {
    const meta = metas.value.find(
        (m: any) => m.name === key || m.property === key
    );

    return meta?.content;
};


useSeo({
    title: blog?.data?.meta?.title,
    description: getMeta('description'),
    keywords: getMeta('keywords'),
    og_image:getMeta('og:image'),
    twitter_desc:getMeta('twitter:description'),
    twitter_image:getMeta('twitter:image'),
})
console.log(getMeta('keywords'), "getMeta('keywords')");

</script>
<template>
    <section class="mt-5 blog">
        <div class="container">
            <h1>{{ blog?.data?.title }}</h1>
            <div class="img">
                <div class="layer"></div>
                <NuxtImg width="100" height="100" v-if="blog?.data?.image" :alt="blog?.data?.title"
                    :title="blog?.data?.title" :src="blog?.data?.image" />
            </div>
            <div class="time">
                <NuxtImg src="/assets/images/time.svg" alt="time" width="18" height="18" />
                <span> {{ blog?.data?.created_at }}</span>
            </div>

        </div>
    </section>
    <section class="mt-5 content">
        <div class="container">
            <div v-html="blog?.data.content"></div>
        </div>
    </section>
</template>
<style scoped lang="scss">
section.blog {
    h1 {
        color: #272727;
        font-size: 32px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 30px;
    }

    .img {
        position: relative;

        img {
            width: 100%;
            height: 100%;
            border-radius: 16px;
        }

        .layer {
            width: 100%;
            height: 100%;
            background-color: #000;
            position: absolute;
            opacity: .22;
            border-radius: 16px;

        }

    }

    .time {
        margin-top: 12px;
        display: flex;
        gap: 3px;
        align-items: center;
        color: #272727;

    }
}

section.content {
    overflow: hidden;

    img {
        max-width: 100% !important;
    }
}
</style>