<script setup lang="ts">
const { t } = useI18n();

const { siteFacts: feats } = usePages();
const getFeatIcon = (feat: { icon: string }) => {
  switch (feat.icon) {
    case "icon-bubbles":
      return "/assets/images/support-stat.svg";
      break;
    case "icon-credit-card":
      return "/assets/images/payment-stat.svg";
      break;
    case "icon-sync":
      return "/assets/images/refund-stat.svg";
      break;
    case "icon-rocket":
      return "/assets/images/ship-stat.svg";
      break;
    default:
      break;
  }
};
</script>
<template>
  <section class="mt-5 pt-5" aria-label="Zaad Features">
    <div class="features">
      <div class="container">
        <div class="row">
          <div
            v-for="feat in feats"
            :key="feat"
            class="col-md-3 mb-3 text-center"
          >
            <div class="feature">
              <div class="icon">
                <NuxtImg
                  width="24"
                  height="24"
                  :alt="feat.title"
                  :src="getFeatIcon(feat)"
                />
              </div>
              <div class="content">
                <div class="title">{{ feat.title }}</div>
                <div class="sub">{{ feat.subtitle }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.features {
  background-color: #7878780d;
  padding: 30px;
}

.feature {
  display: flex;
  gap: 10px;
  justify-content: center;
  transition: var(--trans);
  @media (max-width: 992px) {
    flex-direction: column;
  }
  &:hover {
    transform: translateY(-2px);
  }

  .title {
    color: #4a4a4a;
    font-weight: 700;
    font-size: 18px;
  }

  .sub {
    color: #8f959b;
  }
}
</style>
