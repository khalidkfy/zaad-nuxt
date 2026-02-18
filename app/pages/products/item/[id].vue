<script setup lang="ts">
const route = useRoute();
const id = route.params.id;
const { t, locale } = useI18n();
const {
  productDetails,
  getProductDetailsLoading,
  getProductDetails,
  productRates,
} = useProducts();

const {
  addToCart,
  addToCartLoading,
  deleteCartLoading,
  deleteFromCart,
  deleteSuccess,
  addSuccess,
} = useCart();

watch(deleteSuccess, (value) => {
  if (value) {
    isCartItem.value = false;
  }
});
watch(addSuccess, (value) => {
  if (value) {
    isCartItem.value = true;
  }
});

await getProductDetails(id);

if (!productDetails.value || (productDetails.value as any).error) {
  throw createError({
    statusCode: 404,
    statusMessage: t("general.productNotFound"),
  });
}

useSeo({
  description:
    productDetails.value?.seo.description || productDetails.value?.short_description,
  title: t("meta.setMeta", {
    meta: productDetails.value?.seo.title || productDetails.value?.title,
  }),
  og_image: productDetails.value?.src,
});

const galleryImages = computed(() => {
  const baseAlt = productDetails.value?.title;

  const allImages = [productDetails.value?.src, ...(productDetails.value?.images || [])];

  return allImages.map((src, index) => ({
    src,
    alt: `${baseAlt} - ${t("general.img")} ${index + 1}`,
    width: 400,
    height: 400,
  }));
});

const qty = ref(productDetails?.value?.cart_count || 1);
const isCartItem = ref(productDetails?.value?.cart_item);
const addQty = () => {
  if (qty.value == productDetails?.value?.quantity) return;
  qty.value += 1;
};
const subQty = () => {
  if (qty.value <= 1) return;
  qty.value -= 1;
};

const activeTab = ref("desc");
const changeTab = (tab: string) => {
  activeTab.value = tab;
};
const router = useRouter();
const checkout = async () => {
  let data = {
    items: [
      {
        item_id: productDetails?.value?.id,
        quantity: productDetails?.value?.quantity,
      },
    ],
    seller: productDetails?.value?.seller,
  };
  localStorage.setItem("checkoutData", JSON.stringify(data));
  router.push("/products/checkout");
};

const showShare = ref(false);
const shareUrl = computed(() => {
  if (process.client) {
    return window.location.href;
  }
  return "";
});
const shareTitle = computed(() => productDetails.value?.title || "");
const shareText = computed(() => productDetails.value?.short_description || "");

// Native share (mobile)
const handleShareClick = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle.value,
        text: shareText.value,
        url: shareUrl.value,
      });
    } catch (err) {
      console.log("Share cancelled");
    }
  } else {
    showShare.value = !showShare.value;
  }
};

// Social share links
const shareLinks = computed(() => ({
  whatsapp: `https://wa.me/?text=${encodeURIComponent(
    shareTitle.value + " " + shareUrl.value
  )}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl.value
  )}`,
  twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareTitle.value
  )}&url=${encodeURIComponent(shareUrl.value)}`,
  telegram: `https://t.me/share/url?url=${encodeURIComponent(
    shareUrl.value
  )}&text=${encodeURIComponent(shareTitle.value)}`,
  email: `mailto:?subject=${encodeURIComponent(
    shareTitle.value
  )}&body=${encodeURIComponent(shareUrl.value)}`,
}));

const showMRateodal = () => {
  const addRateModal = new bootstrap.Modal(document.getElementById("addRateModal"), {});
  addRateModal.show();
};

const hideRateModal = () => {
  const myModalEl = document.getElementById("addRateModal");
  const addRateModal = bootstrap.Modal.getInstance(myModalEl);
  if (addRateModal) {
    addRateModal.hide();
  }
};

const errors = ref([]);

const getError = (key: any) => {
  const error = errors.value.find((err) => err.key === key);
  return error ? error.message : "";
};
const clearError = (key: string) => {
  const index = errors.value.findIndex((err) => err.key === key);
  if (index !== -1) {
    errors.value.splice(index, 1);
  }
};
const submitRateValue = ref(0);
const submitRateLoading = ref(false);
const submitRateNote = ref("");
const toast = useToast();

const submitRate = async () => {
  clearError("rateSubmit");
  if (!submitRateNote.value.length) {
    errors.value.push({
      key: "rateSubmit",
      message: t("validations.required", { key: t("items.comment") }),
    });
    return;
  }
  if (submitRateValue.value <= 0) {
    errors.value.push({
      key: "rateSubmit",
      message: t("validations.required", { key: t("items.rate") }),
    });
    return;
  }

  try {
    submitRateLoading.value = true;
    const res = await $fetch("/api/products/rate", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        item_id: id,
        rate: submitRateValue.value,
        note: submitRateNote.value,
      },
    });

    toast.success({
      title: t("submit.success"),
      message: res?.message,
      rtl: locale.value === "ar",
    });

    await getProductDetails(id);
    hideRateModal();
  } catch (err) {
    console.log(err.data);

    errors.value.push({
      key: "rateSubmit",
      message: err?.data?.data?.error,
    });
  } finally {
    submitRateLoading.value = false;
  }
};
const { loggedIn } = useUserSession();


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
          :href="$localePath(`/stores/products/${productDetails?.store?.id}`)"
        >
          {{ productDetails?.store?.name }}
        </NuxtLink>
        <div>/</div>

        <NuxtLink active-class="active" :href="$localePath(`/products/item/${id}`)">
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
          <div class="info">
            <div>
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
                  :href="$localePath(`/stores/products/${productDetails?.store?.id}`)"
                  >{{ productDetails?.store?.name }}</NuxtLink
                >
              </div>
              <ProductRate :rates="productRates" :product="productDetails" class="my-4" />
              <p>{{ productDetails?.short_description }}</p>
              <div class="price">
                {{
                  $t("general.curr_value", {
                    value: productDetails?.regular_price,
                  })
                }}
              </div>
              <div>
                <div class="qty">
                  <div :class="{ disabled: qty == 1 }" @click.prevent="subQty()">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_142_912)">
                        <path
                          d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
                          :stroke="qty == 1 ? '#444C4E' : 'black'"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 12H15"
                          :stroke="qty == 1 ? '#444C4E' : 'black'"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_142_912">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span>{{ qty }}</span>
                  <div
                    :class="{ disabled: qty == productDetails?.quantity }"
                    @click.prevent="addQty()"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_142_907)">
                        <path
                          d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 12H15"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M12 9V15"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_142_907">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div class="remain">
                  {{ $t("general.remaining") }} {{ productDetails?.quantity }}
                </div>
              </div>
            </div>
            <div>
              <div class="terms">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clip-path="url(#clip0_117_1009)">
                    <path
                      d="M8 6H8.00667"
                      stroke="#F78400"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.33301 8H7.99967V10.6667H8.66634"
                      stroke="#F78400"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <path
                    d="M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8Z"
                    stroke="#F78400"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <defs>
                    <clipPath id="clip0_117_1009">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <div>
                  <p>{{ $t("general.termsWarn") }}</p>
                  <NuxtLink :href="$localePath('/terms-and-conditions')">{{
                    $t("links.terms")
                  }}</NuxtLink>
                </div>
              </div>
              <div class="mt-4 btns">
                <button
                  v-if="loggedIn"
                  @click="checkout"
                  :disabled="qty < 1"
                  class="btn-zaad"
                >
                  {{ $t("general.buyNow") }}
                </button>
                <button
                  :disabled="addToCartLoading || qty < 1"
                  @click.prevent="addToCart(productDetails?.id, qty)"
                  class="btn-cart"
                  v-if="!isCartItem"
                  title="اضف الى السلة"
                >
                  <svg
                    v-if="!addToCartLoading"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                  >
                    <path
                      d="M15.3955 17.4792C16.0858 17.4792 16.6455 16.9195 16.6455 16.2292C16.6455 15.5389 16.0858 14.9792 15.3955 14.9792C14.7052 14.9792 14.1455 15.5389 14.1455 16.2292C14.1455 16.9195 14.7052 17.4792 15.3955 17.4792Z"
                      fill="#4A4A4A"
                      stroke="#4A4A4A"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.0625 17.4792C7.75283 17.4792 8.3125 16.9195 8.3125 16.2292C8.3125 15.5389 7.75283 14.9792 7.0625 14.9792C6.37214 14.9792 5.8125 15.5389 5.8125 16.2292C5.8125 16.9195 6.37214 17.4792 7.0625 17.4792Z"
                      fill="#4A4A4A"
                      stroke="#4A4A4A"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.3125 2.47917H17.4792L15.8125 11.6458H4.97917L3.3125 2.47917ZM3.3125 2.47917C3.17361 1.92361 2.47917 0.8125 0.8125 0.8125"
                      stroke="#4A4A4A"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.8118 11.6459H4.97852H3.50416C2.01723 11.6459 1.22852 12.2969 1.22852 13.3125C1.22852 14.3282 2.01723 14.9792 3.50416 14.9792H15.3952"
                      stroke="#4A4A4A"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span
                    v-else
                    class="spinner-border text-dark spinner-border-sm ms-2"
                  ></span>
                  {{ $t("cart.add") }}
                </button>
                <button
                  :disabled="addToCartLoading"
                  @click.prevent="deleteFromCart({ item_id: productDetails?.id })"
                  class="btn-cart remove"
                  v-else
                  title="ازالة من السلة"
                >
                  <svg
                    v-if="!deleteCartLoading"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                  >
                    <path
                      d="M15.3955 17.4792C16.0858 17.4792 16.6455 16.9195 16.6455 16.2292C16.6455 15.5389 16.0858 14.9792 15.3955 14.9792C14.7052 14.9792 14.1455 15.5389 14.1455 16.2292C14.1455 16.9195 14.7052 17.4792 15.3955 17.4792Z"
                      fill="#fff"
                      stroke="#fff"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.0625 17.4792C7.75283 17.4792 8.3125 16.9195 8.3125 16.2292C8.3125 15.5389 7.75283 14.9792 7.0625 14.9792C6.37214 14.9792 5.8125 15.5389 5.8125 16.2292C5.8125 16.9195 6.37214 17.4792 7.0625 17.4792Z"
                      fill="#fff"
                      stroke="#fff"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.3125 2.47917H17.4792L15.8125 11.6458H4.97917L3.3125 2.47917ZM3.3125 2.47917C3.17361 1.92361 2.47917 0.8125 0.8125 0.8125"
                      stroke="#fff"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.8118 11.6459H4.97852H3.50416C2.01723 11.6459 1.22852 12.2969 1.22852 13.3125C1.22852 14.3282 2.01723 14.9792 3.50416 14.9792H15.3952"
                      stroke="#fff"
                      stroke-width="1.625"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span
                    v-else
                    class="spinner-border text-dark spinner-border-sm ms-2"
                  ></span>
                  {{ $t("cart.remove") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-7">
          <div class="product-tabs">
            <div
              @click.prevent="changeTab('desc')"
              :class="{ active: activeTab === 'desc' }"
              class="tab"
            >
              {{ $t("general.desc") }}
            </div>
            <div
              @click.prevent="changeTab('rates')"
              :class="{ active: activeTab === 'rates' }"
              class="tab"
            >
              {{ $t("general.rates") }}
            </div>
          </div>
          <hr />

          <div class="product-tab-content">
            <transition name="fade-slide" mode="out-in">
              <div :key="activeTab">
                <div v-if="activeTab === 'rates'">
                  <div class="rates">
                    <div class="rate">
                      <div v-if="productDetails?.rates?.user_rate" class="rate-value">
                        <span class="date">
                          {{ productDetails?.rates?.user_rate?.date }}</span
                        >
                        {{ productDetails?.rates?.user_rate.rate }} <span> /5</span>
                      </div>

                      <div class="new-comments">
                        ( {{ productRates?.total_rating }} {{ $t("items.newComments") }} )
                      </div>
                    </div>
                    <div class="rate-labels">
                      <div class="label">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_117_895)">
                              <path
                                d="M14.2566 18.4042C13.2016 18.3475 11.8199 17.6883 10.0308 16.4417L9.99743 16.4192L9.96659 16.4417C8.17743 17.6892 6.7966 18.3483 5.73993 18.405L5.59159 18.4092C3.30243 18.4092 3.01076 16.2092 4.15993 12.3725L4.20493 12.2242L4.12159 12.1617C-0.925072 8.29668 -0.0834054 5.62168 6.24993 5.44001L6.41826 5.43584L6.51409 5.16418C7.50076 2.38918 8.53576 0.926677 9.86993 0.83751L9.99993 0.833344C11.3949 0.833344 12.4641 2.30001 13.4849 5.16418L13.5799 5.43584L13.7499 5.44001C20.0833 5.62168 20.9249 8.29668 15.8774 12.1608L15.7924 12.2233L15.8383 12.3717C16.9633 16.1317 16.7049 18.3192 14.5416 18.405L14.4058 18.4075L14.2566 18.4042Z"
                                fill="#FFAE00"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_117_895">
                                <rect width="20" height="20" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>5</span>
                        </div>
                        <div class="bar">
                          <div
                            class="fill"
                            :style="{ width: `${productRates?.five_stars || 0}%` }"
                          ></div>
                        </div>
                      </div>
                      <div class="label">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_117_895)">
                              <path
                                d="M14.2566 18.4042C13.2016 18.3475 11.8199 17.6883 10.0308 16.4417L9.99743 16.4192L9.96659 16.4417C8.17743 17.6892 6.7966 18.3483 5.73993 18.405L5.59159 18.4092C3.30243 18.4092 3.01076 16.2092 4.15993 12.3725L4.20493 12.2242L4.12159 12.1617C-0.925072 8.29668 -0.0834054 5.62168 6.24993 5.44001L6.41826 5.43584L6.51409 5.16418C7.50076 2.38918 8.53576 0.926677 9.86993 0.83751L9.99993 0.833344C11.3949 0.833344 12.4641 2.30001 13.4849 5.16418L13.5799 5.43584L13.7499 5.44001C20.0833 5.62168 20.9249 8.29668 15.8774 12.1608L15.7924 12.2233L15.8383 12.3717C16.9633 16.1317 16.7049 18.3192 14.5416 18.405L14.4058 18.4075L14.2566 18.4042Z"
                                fill="#FFAE00"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_117_895">
                                <rect width="20" height="20" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>4</span>
                        </div>
                        <div class="bar">
                          <div
                            class="fill"
                            :style="{ width: `${productRates?.four_stars || 0}%` }"
                          ></div>
                        </div>
                      </div>
                      <div class="label">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_117_895)">
                              <path
                                d="M14.2566 18.4042C13.2016 18.3475 11.8199 17.6883 10.0308 16.4417L9.99743 16.4192L9.96659 16.4417C8.17743 17.6892 6.7966 18.3483 5.73993 18.405L5.59159 18.4092C3.30243 18.4092 3.01076 16.2092 4.15993 12.3725L4.20493 12.2242L4.12159 12.1617C-0.925072 8.29668 -0.0834054 5.62168 6.24993 5.44001L6.41826 5.43584L6.51409 5.16418C7.50076 2.38918 8.53576 0.926677 9.86993 0.83751L9.99993 0.833344C11.3949 0.833344 12.4641 2.30001 13.4849 5.16418L13.5799 5.43584L13.7499 5.44001C20.0833 5.62168 20.9249 8.29668 15.8774 12.1608L15.7924 12.2233L15.8383 12.3717C16.9633 16.1317 16.7049 18.3192 14.5416 18.405L14.4058 18.4075L14.2566 18.4042Z"
                                fill="#FFAE00"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_117_895">
                                <rect width="20" height="20" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>3</span>
                        </div>
                        <div class="bar">
                          <div
                            class="fill"
                            :style="{ width: `${productRates?.three_stars || 0}%` }"
                          ></div>
                        </div>
                      </div>
                      <div class="label">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_117_895)">
                              <path
                                d="M14.2566 18.4042C13.2016 18.3475 11.8199 17.6883 10.0308 16.4417L9.99743 16.4192L9.96659 16.4417C8.17743 17.6892 6.7966 18.3483 5.73993 18.405L5.59159 18.4092C3.30243 18.4092 3.01076 16.2092 4.15993 12.3725L4.20493 12.2242L4.12159 12.1617C-0.925072 8.29668 -0.0834054 5.62168 6.24993 5.44001L6.41826 5.43584L6.51409 5.16418C7.50076 2.38918 8.53576 0.926677 9.86993 0.83751L9.99993 0.833344C11.3949 0.833344 12.4641 2.30001 13.4849 5.16418L13.5799 5.43584L13.7499 5.44001C20.0833 5.62168 20.9249 8.29668 15.8774 12.1608L15.7924 12.2233L15.8383 12.3717C16.9633 16.1317 16.7049 18.3192 14.5416 18.405L14.4058 18.4075L14.2566 18.4042Z"
                                fill="#FFAE00"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_117_895">
                                <rect width="20" height="20" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>2</span>
                        </div>
                        <div class="bar">
                          <div
                            class="fill"
                            :style="{ width: `${productRates?.two_stars || 0}%` }"
                          ></div>
                        </div>
                      </div>
                      <div class="label">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_117_895)">
                              <path
                                d="M14.2566 18.4042C13.2016 18.3475 11.8199 17.6883 10.0308 16.4417L9.99743 16.4192L9.96659 16.4417C8.17743 17.6892 6.7966 18.3483 5.73993 18.405L5.59159 18.4092C3.30243 18.4092 3.01076 16.2092 4.15993 12.3725L4.20493 12.2242L4.12159 12.1617C-0.925072 8.29668 -0.0834054 5.62168 6.24993 5.44001L6.41826 5.43584L6.51409 5.16418C7.50076 2.38918 8.53576 0.926677 9.86993 0.83751L9.99993 0.833344C11.3949 0.833344 12.4641 2.30001 13.4849 5.16418L13.5799 5.43584L13.7499 5.44001C20.0833 5.62168 20.9249 8.29668 15.8774 12.1608L15.7924 12.2233L15.8383 12.3717C16.9633 16.1317 16.7049 18.3192 14.5416 18.405L14.4058 18.4075L14.2566 18.4042Z"
                                fill="#FFAE00"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_117_895">
                                <rect width="20" height="20" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>1</span>
                        </div>
                        <div class="bar">
                          <div
                            class="fill"
                            :style="{ width: `${productRates?.one_stars || 0}%` }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="comments-section">
                    <div class="head">
                      <div>{{ $t("items.customersReviews") }}</div>

                      <button
                        v-if="productDetails?.rates.can_rate"
                        @click.prevent="showMRateodal"
                      >
                        {{ $t("items.addNew") }}
                      </button>
                    </div>
                    <div v-if="productDetails?.rates?.details.length" class="comments">
                      <div
                        v-for="(rate, i) in productDetails?.rates?.details"
                        class="comment"
                      >
                        <div class="user">
                          <div class="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <g clip-path="url(#clip0_128_207)">
                                <path
                                  d="M2.5 10C2.5 10.9849 2.69399 11.9602 3.0709 12.8701C3.44781 13.7801 4.00026 14.6069 4.6967 15.3033C5.39314 15.9997 6.21993 16.5522 7.12987 16.9291C8.03982 17.306 9.01509 17.5 10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 9.01509 17.306 8.03982 16.9291 7.12987C16.5522 6.21993 15.9997 5.39314 15.3033 4.6967C14.6069 4.00026 13.7801 3.44781 12.8701 3.0709C11.9602 2.69399 10.9849 2.5 10 2.5C9.01509 2.5 8.03982 2.69399 7.12987 3.0709C6.21993 3.44781 5.39314 4.00026 4.6967 4.6967C4.00026 5.39314 3.44781 6.21993 3.0709 7.12987C2.69399 8.03982 2.5 9.01509 2.5 10Z"
                                  stroke="black"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M7.5 8.33331C7.5 8.99635 7.76339 9.63224 8.23223 10.1011C8.70107 10.5699 9.33696 10.8333 10 10.8333C10.663 10.8333 11.2989 10.5699 11.7678 10.1011C12.2366 9.63224 12.5 8.99635 12.5 8.33331C12.5 7.67027 12.2366 7.03439 11.7678 6.56555C11.2989 6.09671 10.663 5.83331 10 5.83331C9.33696 5.83331 8.70107 6.09671 8.23223 6.56555C7.76339 7.03439 7.5 7.67027 7.5 8.33331Z"
                                  stroke="black"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M5.13965 15.7075C5.34591 15.021 5.76796 14.4193 6.34319 13.9916C6.91842 13.564 7.61619 13.3331 8.33298 13.3333H11.6663C12.384 13.3331 13.0827 13.5645 13.6583 13.9931C14.234 14.4218 14.6559 15.0248 14.8613 15.7125"
                                  stroke="black"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_128_207">
                                  <rect width="20" height="20" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <span>{{ rate?.user || $t("items.unknown") }}</span>
                        </div>
                        <div class="stars">
                          <svg
                            v-for="i in 5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_117_895)">
                              <path
                                d="M14.2566 18.4042C13.2016 18.3475 11.8199 17.6883 10.0308 16.4417L9.99743 16.4192L9.96659 16.4417C8.17743 17.6892 6.7966 18.3483 5.73993 18.405L5.59159 18.4092C3.30243 18.4092 3.01076 16.2092 4.15993 12.3725L4.20493 12.2242L4.12159 12.1617C-0.925072 8.29668 -0.0834054 5.62168 6.24993 5.44001L6.41826 5.43584L6.51409 5.16418C7.50076 2.38918 8.53576 0.926677 9.86993 0.83751L9.99993 0.833344C11.3949 0.833344 12.4641 2.30001 13.4849 5.16418L13.5799 5.43584L13.7499 5.44001C20.0833 5.62168 20.9249 8.29668 15.8774 12.1608L15.7924 12.2233L15.8383 12.3717C16.9633 16.1317 16.7049 18.3192 14.5416 18.405L14.4058 18.4075L14.2566 18.4042Z"
                                :fill="i <= rate?.rate ? '#FFAE00' : '#ddd'"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_117_895">
                                <rect width="20" height="20" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <p class="date">
                          {{ rate?.date }}
                        </p>
                        <p class="content">
                          {{ rate?.note }}
                        </p>
                        <!-- <div class="feed">
                          <div>مفيد</div>
                          <p>(40) مستخدم وجدوا هذه المراجعة مفيدة</p>
                        </div> -->
                      </div>
                    </div>
                    <div v-else>
                      <div class="mt-4">{{ $t("items.noReviews") }}</div>
                    </div>
                  </div>
                </div>
                <div v-if="activeTab === 'desc'">
                  <div v-html="productDetails?.description"></div>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="col-md-5">
          <div @click="handleShareClick" class="share-item">
            <div class="share">
              <div class="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <g clip-path="url(#clip0_124_49)">
                    <path
                      d="M3.5 14C3.5 14.9283 3.86875 15.8185 4.52513 16.4749C5.1815 17.1313 6.07174 17.5 7 17.5C7.92826 17.5 8.8185 17.1313 9.47487 16.4749C10.1313 15.8185 10.5 14.9283 10.5 14C10.5 13.0717 10.1313 12.1815 9.47487 11.5251C8.8185 10.8687 7.92826 10.5 7 10.5C6.07174 10.5 5.1815 10.8687 4.52513 11.5251C3.86875 12.1815 3.5 13.0717 3.5 14Z"
                      stroke="#2B2932"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.5 7C17.5 7.92826 17.8687 8.8185 18.5251 9.47487C19.1815 10.1313 20.0717 10.5 21 10.5C21.9283 10.5 22.8185 10.1313 23.4749 9.47487C24.1313 8.8185 24.5 7.92826 24.5 7C24.5 6.07174 24.1313 5.1815 23.4749 4.52513C22.8185 3.86875 21.9283 3.5 21 3.5C20.0717 3.5 19.1815 3.86875 18.5251 4.52513C17.8687 5.1815 17.5 6.07174 17.5 7Z"
                      stroke="#2B2932"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.5 21C17.5 21.9283 17.8687 22.8185 18.5251 23.4749C19.1815 24.1313 20.0717 24.5 21 24.5C21.9283 24.5 22.8185 24.1313 23.4749 23.4749C24.1313 22.8185 24.5 21.9283 24.5 21C24.5 20.0717 24.1313 19.1815 23.4749 18.5251C22.8185 17.8687 21.9283 17.5 21 17.5C20.0717 17.5 19.1815 17.8687 18.5251 18.5251C17.8687 19.1815 17.5 20.0717 17.5 21Z"
                      stroke="#2B2932"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10.1504 12.4833L17.8504 8.51666"
                      stroke="#2B2932"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10.1504 15.5167L17.8504 19.4833"
                      stroke="#2B2932"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_124_49">
                      <rect width="28" height="28" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div class="text">
                <span>{{ $t("items.shareItem") }}</span>
                <span>{{ $t("items.shareItemP") }}</span>
              </div>
            </div>
            <div class="arrow">
              <img
                loading="lazy"
                src="/assets/images/arrow.svg"
                alt="arrow"
                width="16"
                height="8"
              />
            </div>
            <div v-if="showShare" class="share-popup">
              <a :href="shareLinks.whatsapp" target="_blank">WhatsApp</a>
              <a :href="shareLinks.facebook" target="_blank">Facebook</a>
              <a :href="shareLinks.twitter" target="_blank">X / Twitter</a>
              <a :href="shareLinks.telegram" target="_blank">Telegram</a>
              <a :href="shareLinks.email">Email</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal addRateModal fade"
      id="addRateModal"
      role="dialog"
      tabindex="-1"
      aria-labelledby="addRateModal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">
              {{ $t("items.addReview") }}
            </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div
              v-if="getError('rateSubmit')"
              class="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {{ getError("rateSubmit") }}
              <button
                type="button"
                class="btn-close"
                @click="clearError('rateSubmit')"
                aria-label="Close"
              ></button>
            </div>
            <template>
              <form @submit.prevent="submitRate">
                <div class="mb-3">
                  <label class="form-label">
                    {{ $t("items.rate") }} <span class="text-danger">*</span>
                  </label>
                  <div class="submit-rate">
                    <svg
                      @click.prevent="submitRateValue = i"
                      v-for="i in 5"
                      :key="i"
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_117_895)">
                        <path
                          d="M14.2566 18.4042C13.2016 18.3475 11.8199 17.6883 10.0308 16.4417L9.99743 16.4192L9.96659 16.4417C8.17743 17.6892 6.7966 18.3483 5.73993 18.405L5.59159 18.4092C3.30243 18.4092 3.01076 16.2092 4.15993 12.3725L4.20493 12.2242L4.12159 12.1617C-0.925072 8.29668 -0.0834054 5.62168 6.24993 5.44001L6.41826 5.43584L6.51409 5.16418C7.50076 2.38918 8.53576 0.926677 9.86993 0.83751L9.99993 0.833344C11.3949 0.833344 12.4641 2.30001 13.4849 5.16418L13.5799 5.43584L13.7499 5.44001C20.0833 5.62168 20.9249 8.29668 15.8774 12.1608L15.7924 12.2233L15.8383 12.3717C16.9633 16.1317 16.7049 18.3192 14.5416 18.405L14.4058 18.4075L14.2566 18.4042Z"
                          :fill="submitRateValue >= i ? '#FFAE00' : '#ddd'"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_117_895">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">
                    {{ $t("items.comment") }} <span class="text-danger">*</span>
                  </label>
                  <textarea
                    v-model="submitRateNote"
                    rows="5"
                    cols="20"
                    class="form-control"
                    :placeholder="$t('items.comment')"
                  ></textarea>
                </div>
                <button
                  :disabled="submitRateLoading"
                  type="submit"
                  class="btn-zaad w-100 d-flex align-items-center justify-content-center"
                >
                  <template v-if="submitRateLoading">
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {{ $t("general.wait") }}
                  </template>
                  <template v-else>
                    {{ $t("general.send") }}
                  </template>
                </button>
              </form>
            </template>
            <!-- <template v-else>
            <div class="row">
              <div class="col text-center py-5 my-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">{{ $t("general.wait") }}</span>
                </div>
                <p class="mt-3">{{ $t("general.wait") }}</p>
              </div>
            </div>
          </template> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scss lang="scss">
[dir="ltr"] .arrow img {
  scale: -1;
}

.submit-rate {
  display: flex;
  gap: 10px;

  svg {
    transition: var(--trans);
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
    }
  }
}

.share-item {
  background-color: #004a980d;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  margin-top: 15px;
  cursor: pointer;

  &:hover {
    .arrow {
      border: 1px solid var(--main-color);
      transform: translateX(-5px);
    }
  }

  .share {
    display: flex;
    align-items: center;
    gap: 10px;

    .text {
      display: flex;
      flex-direction: column;

      span {
        font-size: 14px;

        &:first-child {
          font-weight: 600;
          color: #2b2932;
        }

        &:last-child {
          color: #7b7b7b;
          font-weight: 400;
        }
      }
    }
  }

  .arrow {
    background-color: #fff;
    transition: var(--trans);
    width: 31px;
    height: 31px;
    display: flex;
    align-items: center;
    border-radius: 50%;
    justify-content: center;
  }
}

.product-tab-content {
  .comments-section {
    margin-top: 30px;

    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;

      div {
        font-size: 18px;
        font-weight: 700;
        color: #2b2932;
      }

      button {
        color: #2b2932;
        background-color: #fff;
        border-radius: 179px;
        font-weight: 500;
        transition: var(--trans);
        outline: none;
        border: 1px solid #2b2932;
        padding: 5px 10px;

        &:disabled {
          opacity: 0.8;
          cursor: no-drop;
        }

        &:hover {
          color: #000;
          background-color: #e6e6e6;
        }
      }
    }

    .comments {
      margin-top: 20px;

      .comment {
        margin-bottom: 30px;

        .feed {
          display: flex;
          gap: 15px;
          align-items: center;

          p {
            margin: 0;
            color: #8f8f8f;
            font-size: 14px;
          }

          div {
            color: #2b2932;
            background-color: #fff;
            border-radius: 179px;
            font-weight: 500;
            transition: var(--trans);
            outline: none;
            border: 1px solid #2b2932;
            padding: 5px 10px;
          }
        }

        .content {
          color: #000;
          font-size: 14px;
          font-weight: 400;
        }

        .date {
          color: #444c4e;
          font-size: 12px;
          font-weight: 400;
          margin: 12px 0;
        }

        .stars {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }

        .user {
          display: flex;
          align-items: center;
          gap: 12px;

          span {
            color: #000;
            font-weight: 400;
          }

          .icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #efefef;
          }
        }
      }
    }
  }

  .rates {
    display: flex;
    justify-content: space-between;

    .rate {
      .rate-value {
        font-size: 60px;
        font-weight: 700;
        color: #2b2932;

        span {
          font-size: 24px;
          color: #444c4e;
          font-weight: 400;

          &.date {
            font-size: 14px;
          }
        }
      }

      .new-comments {
        color: #7b7b7b;
        font-size: 18px;
      }
    }

    .rate-labels {
      .label {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 10px;

        div {
          span {
            margin-inline-start: 4px;
            color: #444c4e;
            font-weight: 500;
          }

          &:last-child {
            font-size: 12px;
            color: #7b7b7b;
          }
        }

        .bar {
          width: 200px;
          height: 6px;
          background-color: #efefef;
          position: relative;
          border-radius: 8px;

          .fill {
            border-radius: inherit;
            position: absolute;
            height: 100%;
            background-color: var(--main-color);
          }
        }
      }
    }
  }
}

.product-tabs {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;

  .tab {
    border: 1px solid #888888;
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 18px;
    cursor: pointer;
    font-weight: 400;
    color: #888888;
    transition: var(--trans);

    &:hover {
      color: var(--main-color);
      border-color: var(--main-color);
    }

    &.active { 
      color: var(--main-color);
      border-color: var(--main-color);
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

hr {
  // color: #EBEBEB;
  border: 1px solid #ebebeb;
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

.details {
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

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
    color: #000;
  }

  .qty {
    margin: 20px 0;
    display: inline-flex;
    background-color: rgba(210, 210, 210, 0.1019607843);
    gap: 8px;
    padding: 11px 15px;
    border: 1px solid #e6e6e6;
    border-radius: 13px;
    user-select: none;

    > div {
      cursor: pointer;
      transition: var(--trans);

      &.disabled {
        cursor: no-drop;

        svg {
          path {
            stroke: #444c4e;
          }
        }
      }
    }

    > span {
      font-weight: 700;
    }
  }

  .remain {
    display: inline-block;
    margin: 0 10px;
    font-size: 12px;
    font-weight: 400;
    color: #444c4e;
  }

  .terms {
    display: flex;
    align-items: center;
    color: #4a4a4a;
    gap: 8px;
    font-weight: 600;
    font-size: 12px;

    > div {
      display: flex;
      gap: 4px;

      p {
        margin: 0;
      }

      a {
        color: var(--main-color);
        transition: var(--trans);

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .btns {
    display: flex;
    gap: 12px;

    @media (max-width: 992px) {
      flex-wrap: wrap;
    }

    button {
      border-radius: 16px;
      width: 50%;
      padding: 15px;

      &.btn-cart {
        background-color: #fff;
        color: #4a4a4a;
        transition: var(--trans);
        font-size: 16px;
        font-weight: 400;
        border: 1px solid #cecece;
        outline: none;

        &.remove {
          background-color: #dc3545;
          color: #fff;

          &:hover {
            background-color: #bb2d3b;
            color: #fff;
          }
        }

        &:hover {
          background-color: #cecece;
          color: #000;

          svg {
            width: 20px;
            height: 20px;
          }
        }

        &:disabled {
          cursor: no-drop;
          opacity: 0.8;
        }

        svg {
          margin-inline-end: 8px;
          transition: var(--trans);
        }
      }

      @media (max-width: 992px) {
        width: 100%;
      }
    }
  }
}
</style>
