<script setup lang="ts">
const { t } = useI18n()
useSeo({
    title: t("blog.title"),
    description: t("blog.desc"),
    keywords: t("blog.keywords"),
})

const { blogList, getBlogList, viewMore, currentBlogPage, lastBlogPage } = useBlog();

await getBlogList();

console.log(blogList.value);


</script>
<template>
    <section class="mt-5">
        <div class="container">
            <div class="blog-banner">
                <div class="text-center">
                    <p class="title">{{ $t("blog.title") }}</p>
                    <h1>{{ $t("blog.h1") }}</h1>
                    <p class="p">{{ $t("blog.p") }}</p>
                </div>
                <!-- search -->
                <!-- <div class="row">
                    <div class="col-md-4 mx-auto mt-4">
                        <div class="input-group">
                            <input type="text" class="form-control" id="phone" :placeholder="$t('blog.search')">
                            <div class="input-group-text">
                                <NuxtImg width="16" height="16" src="/assets/images/search.svg" />
                            </div>

                        </div>
                    </div>
                </div> -->

            </div>
        </div>
    </section>
    <section class="mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="section-header">
                        <h2>{{ $t("blog.latest") }}</h2>
                        <div class="line"></div>
                    </div>
                    <div class="row mt-4">
                        <div v-for="blog in blogList" class="col-md-3 mb-4">
                            <BlogCard :blog="blog" />
                        </div>
                    </div>

                </div>

            </div>
            <div v-if="lastBlogPage > currentBlogPage" class="row mt-5">
                <div class="col-md-3 text-center mx-auto">
                    <button @click="viewMore" class="btn-zaad view-more">{{ $t("blog.viewMore") }}</button>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped lang="scss">
.blog-banner {
    padding: 40px;
    background-color: #BCBCBC14;
    border-radius: 16px;

    h1 {
        font-size: 32px;
        font-weight: 700;
    }

    p.title {
        color: #757575;
        font-size: 14px;
    }

    p.p {
        color: #4A4A4A;
        margin-top: 25px;
        font-weight: 500;
        font-size: 14px;
    }

    .input-group {
        input {
            padding: 12px;
            border-radius: 8px;
            border-color: transparent;
            box-shadow: none;

            &::placeholder {
                color: #8E90A7;
            }


        }

        img {
            background-color: var(--main-color);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            padding: 7px;
            cursor: pointer;
        }

        .input-group-text {
            background-color: #fff;
            border: none;
            border-radius: 8px;
        }
    }

}

.section-header {
    display: flex;

    h2 {
        font-size: 16px;
        color: #1E1E1E;
        font-weight: 600;
        width: 9%;
    }

    .line {
        height: 1px;
        width: 100%;
        background-color: #E1E1E1;
    }
}
</style>