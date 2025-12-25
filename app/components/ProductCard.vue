<script setup lang="ts">
const props = defineProps({
  product: Object as () => Product,
  showCateg: {
    required: false,
    default: true,
    type: Boolean,
  },
  textColor: String,
  discountedPriceColor: String,
});

const cartRef = ref<HTMLElement | null>(null);

const { addToCart, addToCartErr, addToCartLoading } = useCart();

watch(addToCartErr, (val) => {
  if (val && cartRef.value) {
    cartRef.value.classList.remove("shake");
    void cartRef.value.offsetWidth; // force reflow
    cartRef.value.classList.add("shake");
  }
});
</script>
<template>
  <div class="product-card" :aria-label="`Product: ${product?.title}`">
    <div class="img-box">
      <div
        class="cart"
        ref="cartRef"
        :title="$t('cart.add')"
        data-bs-toggle="tooltip"
        @click.prevent="addToCart(product?.id)"
      >
        <NuxtImg
          v-if="!addToCartLoading"
          width="19"
          height="19"
          src="/assets/images/addcart.svg"
          :alt="$t('cart.add')"
        />
        <div v-else>
          <span
            class="spinner-border text-white spinner-border-sm ms-2"
          ></span>
        </div>
      </div>
      <div
        class="whish"
        :class="{ fav: product?.favorite_item == true }"
        :title="$t('whish.add')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
        >
          <g clip-path="url(#clip0_176_1029)">
            <path
              d="M11.7008 7.5432L7.20077 12L2.70077 7.5432C2.40395 7.25437 2.17015 6.90721 2.0141 6.52358C1.85804 6.13996 1.7831 5.72817 1.79401 5.31416C1.80491 4.90015 1.90142 4.49288 2.07746 4.118C2.2535 3.74312 2.50525 3.40875 2.81686 3.13595C3.12847 2.86315 3.49319 2.65782 3.88805 2.53289C4.28292 2.40797 4.69937 2.36615 5.11119 2.41008C5.523 2.45401 5.92127 2.58274 6.28089 2.78815C6.64052 2.99356 6.95372 3.2712 7.20077 3.6036C7.44889 3.27362 7.76245 2.99839 8.12183 2.79517C8.4812 2.59194 8.87866 2.46507 9.28933 2.42251C9.69999 2.37996 10.115 2.42262 10.5084 2.54784C10.9018 2.67305 11.2652 2.87813 11.5757 3.15022C11.8862 3.42231 12.1372 3.75557 12.313 4.12914C12.4888 4.5027 12.5856 4.90853 12.5974 5.32123C12.6091 5.73392 12.5355 6.1446 12.3812 6.52755C12.227 6.91051 11.9953 7.2575 11.7008 7.5468"
              stroke="#4A4A4A"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_176_1029">
              <rect width="14.4" height="14.4" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div v-if="product?.discount" class="discount-label">
        -{{ product?.discount }}%
      </div>
      <!-- <div v-if="product?.customOffer" class="custom-offer">{{ product?.customOffer }}</div> -->
      <NuxtImg
        class="product"
        width="185"
        :src="product?.logo || product?.src"
        :alt="product?.title"
        :title="product?.title"
      />
    </div>
    <NuxtLink
      :style="{ color: textColor ? textColor : '' }"
      v-if="showCateg"
      href="/"
      class="categ"
      >{{ product?.seller?.username }}</NuxtLink
    >

    <NuxtLink href="/" class="product-info">
      <div
        :style="{ color: textColor ? textColor : '' }"
        :title="product?.title"
        class="name"
      >
        {{ product?.title }} {{ product?.title }}
      </div>
      <div class="price">
        <div>
          <span :style="{ color: textColor ? textColor : '' }" class="amount">{{
            product?.regular_price
          }}</span>
          <span :style="{ color: textColor ? textColor : '' }" class="currency"
            >ر.ع</span
          >
        </div>
        <!-- <span :style="{ 'color': discountedPriceColor ? discountedPriceColor : '' }" class="discounted-price">{{
                    product?.regular_price }}</span> -->
      </div>
    </NuxtLink>
  </div>
</template>
<style scoped lang="scss">
.product-card {
  .whish {
    &.fav {
      width: 32px !important;
      height: 32px !important;
      svg {
        fill: red !important;
        path {
          stroke: red;
        }
      }
    }
  }
  &:hover {
    .img-box {
      .whish {
        width: 32px;
        height: 32px;
      }

      img.product {
        transform: translateY(-2px);
      }
    }
  }

  .product-info {
    color: #000;
  }

  img {
    transition: var(--trans);
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .name {
    margin-top: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    line-height: 1.4em;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
  }

  .img-box {
    transition: var(--trans);
    padding: 15px;
    background-color: #f9f9f9;
    height: 200px;
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    position: relative;

    .cart {
      position: absolute;
      bottom: -10px;
      background-color: var(--main-color);
      border-radius: 50%;
      width: 39px;
      z-index: 99993;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 39px;
      cursor: pointer;
      transition: var(--trans);
      inset-inline-end: 10px;

      &:hover {
        background-color: #ff601c;
      }
    }

    .whish {
      position: absolute;
      display: flex;
      top: 8px;
      background-color: #fff;
      border-radius: 50%;
      width: 0;
      z-index: 99993;
      align-items: center;
      justify-content: center;
      height: 0;
      cursor: pointer;
      transition: var(--trans);
      inset-inline-start: 8px;

      svg {
        transition: var(--trans);
      }

      &:hover {
        svg {
          width: 17px;
          height: 17px;
        }
      }
    }

    .discount-label {
      position: absolute;
      top: 10px;
      background-color: #ff0000;
      inset-inline-end: 10px;
      border-radius: 4px;
      color: #fff;
      font-size: 14px;
      padding: 1px 5px;
      z-index: 1;
    }

    .custom-offer {
      position: absolute;
      top: 10px;
      background-color: #ff0000;
      inset-inline-start: 10px;
      border-radius: 4px;
      color: #fff;
      font-size: 14px;
      padding: 1px 5px;
      z-index: 1;
      background-color: #000;
      color: #fff;
    }
  }

  .categ {
    color: #4a4a4a;
    font-size: 12px;
    margin-top: 10px;
    font-weight: 400;
    display: inline-block;

    &:hover {
      color: #000;
      text-decoration: underline;
    }
  }

  .price {
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 8px;

    .amount,
    .currency {
      color: #000;
      font-size: 16px;
      font-weight: 700;
    }

    .discounted-price {
      color: #7b7b7b;
      font-size: 14px;
      text-decoration: line-through;
    }
  }
}
</style>
