<script setup lang="ts">
const { t } = useI18n();
useSeo({});
definePageMeta({
  layout: "profile",
  middleware: "authenticated",
  breadcrumbs: [
    {
      name: "links.accountAdresses",
      url: "/account/profile/adresses",
    },
  ],
});
const { getProfileLoading, profileData, getProfileRes } = useProfile();
</script>
<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="section-title">{{ $t("links.accountAdresses") }}</h1>
    <template v-if="!getProfileLoading">
      <button class="btn action">
        {{ $t("general.addAddress") }}
      </button>
    </template>
  </div>
  <div class="content">
    <div class="row">
      <div
        class="col-md-3"
        v-for="(adress, i) in profileData?.addresses"
        :key="i"
      >
        <div class="address-card">
          <div class="layer">
            <button class="edit" title="edit">
              <NuxtImg
                width="20"
                height=""
                src="/assets/images/edit.svg"
                alt="edit"
              />
            </button>
            <button class="delete" title="delete">
              <NuxtImg
                width="20"
                height=""
                src="/assets/images/delete.svg"
                alt="delete"
              />
            </button>
          </div>

          <div>
            <span>{{ $t("profile.country") }}</span>
            <span>{{ adress.country }}</span>
          </div>
          <div>
            <span>{{ $t("profile.postcode") }}</span>
            <span>{{ adress.postcode }}</span>
          </div>
          <div>
            <span>{{ $t("profile.city") }}</span>
            <span>{{ adress.city }}</span>
          </div>
          <div>
            <span>{{ $t("profile.streetAddress") }}</span>
            <span>{{
              `${adress.address_line_1} - ${adress.address_line_2}`
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
h1.section-title {
  font-size: 18px;
}
button.action {
  padding: 7px 30px;
  border-radius: 16px;
  border-color: #cdcdcd;
  color: #4a4a4a;
  transition: var(--trans);
  &:hover {
    background-color: #e2e2e2;
  }
}
.content {
  margin-top: 35px;
  .address-card {
    border: 1px solid #cdcdcd;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 5px;
    padding: 10px;
    transition: var(--trans);
    position: relative;
    > .layer {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
      background-color: #e2e2e288;
      z-index: 2;
      transition: var(--trans);
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      gap: 10px;
      button {
        background-color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid #dedede;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &:hover {
      .layer {
        display: flex;
      }
    }
    > div:not(.layer) {
      display: flex;
      gap: 5px;
      font-size: 12px;
      flex-direction: column;

      span {
        &:first-child {
          color: #888888;
        }
        &:last-child {
          color: #4a4a4a;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
