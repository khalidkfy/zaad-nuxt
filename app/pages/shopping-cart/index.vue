<script setup lang="ts">
const { t, locale } = useI18n();

useSeo({
  title: t("cart.title"),
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
  <section class="mt-4 cart-page" dir="rtl">
    <div class="container">
      <h1>{{ $t("cart.title") }}</h1>
        
    </div>

    <div class="cart-grid">
      <!-- RIGHT: SUMMARY -->
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

      <!-- LEFT: CART ITEMS -->
      <section class="cart-items">
        <h1>سلة المشتريات</h1>

        <article class="seller-group">
          <h2 class="seller-title">اسم البائع</h2>

          <div class="product-row">
            <NuxtImg src="/assets/images/product.svg" alt="" />
            <div class="info">
              <h3>اسم المنتج</h3>
              <span class="meta">20×20 سم</span>
            </div>

            <div class="qty">
              <button>-</button>
              <span>20</span>
              <button>+</button>
            </div>

            <strong class="price">$400</strong>
          </div>
        </article>

        <article class="seller-group">
          <h2 class="seller-title">بائع آخر</h2>
        </article>
      </section>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.cart-page {
  h1 {
    font-size: 18px;
    font-weight: 700;
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
.cart-grid {
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 340px; /* LEFT | RIGHT */
  gap: 24px;
}

/* SUMMARY (RIGHT) */
.cart-summary section {
  background: #f6f9fc;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.summary-list {
  list-style: none;
  padding: 0;
}

.summary-list li {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}

.primary-btn {
  width: 100%;
  background: #0d5bd7;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  border: none;
}

/* CART ITEMS (LEFT) */
.cart-items h1 {
  margin-bottom: 16px;
}

.seller-group {
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.seller-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.product-row {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 12px;
  align-items: center;
}

.product-row img {
  width: 80px;
}

.qty {
  display: flex;
  gap: 6px;
}

/* MOBILE */
@media (max-width: 768px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    order: -1;
  }
}
</style>
