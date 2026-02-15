<script setup lang="ts">
const { t } = useI18n();

const route = useRoute();
const id = route.params.id;

const { getBlog } = useBlog();

const blog = await getBlog(id);

if (!blog || !blog?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: "not found",
  });
}

const metas = computed(() => {
  if (!blog) return [];

  return blog?.data?.meta?.metaTags;
});

const getMeta = (key: string): string | undefined => {
  const meta = metas.value?.find(
    (m: any) => m.name === key || m.property === key,
  );

  return meta?.content;
};

useSeo({
  title: t("meta.setMeta", {meta:blog?.data?.meta?.title}),
  description: getMeta("description"),
  keywords: getMeta("keywords"),
  og_image: getMeta("og:image"),
  twitter_desc: getMeta("twitter:description"),
  twitter_image: getMeta("twitter:image"),
});
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/blog`)">
          {{ $t("links.blog") }}
        </NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/blog/${blog?.data?.slug}`)">
          {{ blog?.data?.title }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-5 blog">
    <div class="container">
      <h1>{{ blog?.data?.title }}</h1>
      <div class="blog-banner" :style="{
        backgroundImage: blog?.data?.image
          ? `url(${blog.data.image})`
          : 'none'
      }">
        <div class="overlay"></div>

        <div class="banner-content">

        </div>
      </div>
      <div class="time">
        <img loading="lazy" src="/assets/images/time.svg" alt="time" width="18" height="18" />
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
h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 500;
}

.breadcrumbs {
  display: flex;

  a {
    font-size: 14px;
    color: #888888;
    transition: var(--trans);
    font-weight: 500;

    &:hover {
      color: #4a4a4a;
    }

    &.active {
      color: #4a4a4a;
      font-weight: 600;
    }
  }

  div {
    color: #888888;
    margin: 0 7px;
  }
}

.blog-banner {
  position: relative;
  width: 100%;
  min-height: 280px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (min-width: 768px) {
    min-height: 350px;
  }

  @media (min-width: 1200px) {
    min-height: 420px;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 1;
  }

  .banner-content {
    position: relative;
    z-index: 2;
    padding: 20px;

    h1 {
      color: #fff;
      font-size: 32px;
      font-weight: 600;
      line-height: 1.3;

      @media (min-width: 768px) {
        font-size: 40px;
      }

      @media (min-width: 1200px) {
        font-size: 48px;
      }
    }
  }
}

section.blog {


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
