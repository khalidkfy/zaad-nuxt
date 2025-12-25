<script setup lang="ts">
const { t, locale } = useI18n();
const { getCartItems, getCartItemsLoading, cartItems } = useCart();
useSeo({
  title: t("cart.title"),
});
onMounted(async () => {
  await getCartItems();
  console.log(cartItems.value);
});
</script>
<template>
  <section class="mt-4">
    <div class="container">
      <div class="breadcrumbs">
        <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
        <div>/</div>
        <NuxtLink active-class="active" :href="$localePath(`/shopping-cart`)">
          {{ $t("cart.title") }}
        </NuxtLink>
      </div>
    </div>
  </section>
  <section class="mt-4 cart-page">
    <div class="container">
      <h1>{{ $t("cart.title") }}</h1>
      <div v-if="!getCartItemsLoading" class="row mt-4">
        <div class="col-md-8">
          <div class="cart-items">
            <div
              v-for="(cartItem, i) in cartItems"
              :key="i"
              class="seller-group"
            >
              <div class="seller-title mb-3">
                {{ cartItem?.seller?.store_name }}
              </div>

              <div
                v-for="(product, i) in cartItem?.items"
                :key="i"
                class="product-row mb-2"
              >
                <div class="img">
                  <NuxtImg
                    width="100"
                    height="100"
                    :src="product?.image"
                    :alt="product?.title"
                  />
                </div>
                <div class="content">
                  <div class="info">
                    <div>{{product?.title}}</div>
                  </div>

                  <div class="qty">
                    <button>-</button>
                    <span>20</span>
                    <button>+</button>
                  </div>

                  <strong class="price">$400</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <aside class="cart-summary">
            <section class="summary-box">
              <h2>سعر الكلي في السلة</h2>

              <ul class="summary-list">
                <li>
                  <span>سعر الإجمالي</span>
                  <strong>$50</strong>
                </li>
                <li class="discount">
                  <span>الخصم</span>
                  <strong>-10%</strong>
                </li>
                <li class="total">
                  <span>السعر الكلي</span>
                  <strong>$40</strong>
                </li>
              </ul>

              <button class="primary-btn">تأكيد الشراء</button>
            </section>

            <section class="coupon-box">
              <h2>كوبون شراء</h2>
              <p>هل لديك كوبون خصم؟ أدخل الكود هنا</p>

              <form class="coupon-form">
                <input type="text" placeholder="إدخال الكود" />
                <button type="submit">تأكيد</button>
              </form>
            </section>
          </aside>
        </div>
      </div>
      <div v-else>loading....</div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.cart-page {
  .seller-title {
    font-size: 18px;
    font-weight: 700;
  }
  .cart-items {
    .seller-group {
        background-color: #004A980D;
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 20px;
      h2 {
        font-size: 16px;
      }
      .product-row {
        display: flex;
        gap: 25px;
        .img {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 16px;
          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        }
        .content {
            .info {
                div {
                    font-size: 18px;
                }
            }
        }
      }
    }
  }
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
</style>
