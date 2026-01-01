<script setup lang="ts">
const route = useRoute();
const id = route.params.id;
const { t } = useI18n();
const { productDetails, getProductDetailsLoading, getProductDetails } =
  useProducts();

await getProductDetails(id);

useSeo({
  description:
    productDetails.value?.seo.description ||
    productDetails.value?.short_description,
  title: productDetails.value?.seo.title || productDetails.value?.title,
});

const galleryImages = computed(() => {
  const baseAlt = productDetails.value?.title;

  const allImages = [
    productDetails.value?.src,
    ...(productDetails.value?.images || []),
  ];

  return allImages.map((src, index) => ({
    src,
    alt: `${baseAlt} - ${t("general.img")} ${index + 1}`,
    width: 400,
    height: 400,
  }));
});
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/products`)">
          {{ $t("links.products") }}
        </NuxtLink>
        <div>/</div>
        <NuxtLink
          active-class="active"
          :href="$localePath(`/products/item/${id}`)"
        >
          {{ productDetails?.title }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4 details">
    <div class="container">
      <div class="row">
        <div class="col-md-7">
          <ProductGallery :product="productDetails" :images="galleryImages" />
        </div>
        <div class="col-md-5">
          <NuxtLink
            class="categ"
            :href="$localePath(`/products/${productDetails?.category_id}`)"
            >{{
              productDetails?.category?.title || productDetails?.category?.name
            }}</NuxtLink
          >
          <h1>{{ productDetails?.title }}</h1>
          <div class="mt-2 store">
            <span>{{ $t("general.by") }}</span>
            <NuxtLink
              class="store"
              :href="
                $localePath(`/stores/products/${productDetails?.store?.id}`)
              "
              >{{ productDetails?.store?.name }}</NuxtLink
            >
          </div>
          <div class="price">
            {{
              $t("general.curr_value", { value: productDetails?.regular_price })
            }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scss lang="scss">
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
.details {
  a.categ {
    font-size: 14px;
    font-weight: 400;
    color: #4a4a4a;
    margin-bottom: 10px;
    display: inline-block;
    transition: var(--trans);
    &:hover {
      color: #888888;
    }
  }
  .store {
    span {
      font-size: 14px;
      font-weight: 500;
      color: #444c4e;
    }
  }
  a.store {
    font-size: 14px;
    font-weight: 500;
    padding: 0 7px;
    transition: var(--trans);
    color: var(--main-color);
    &:hover {
      text-decoration: underline;
    }
  }
  h1 {
    font-size: 24px;
    font-weight: 500;
    color: #1e1e1e;
  }
  .price {
    font-weight: 700;
    font-size: 24px;
    margin-top: 20px;
  }
}
</style>
