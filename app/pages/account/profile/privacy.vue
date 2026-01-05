<script setup lang="ts">
const { t, locale } = useI18n();
useSeo({});
definePageMeta({
  layout: "profile",
  middleware: "authenticated",
  breadcrumbs: [
    {
      name: "links.accountInfo",
      url: "/account/profile",
    },
  ],
});
</script>
<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="section-title">{{ $t("links.privacy") }}</h1>
  </div>
  <div class="settings">
    <div>
      <p>اظهار الايميل</p>
      <div><input type="checkbox" name="" id="" /></div>
    </div>
    <div>
      <p>اظهار الصورة الشخصية</p>
      <div><input type="checkbox" name="" id="" /></div>
    </div>
    <div>
      <p>اظهار الموبايل</p>
      <div><input type="checkbox" name="" id="" /></div>
    </div>
    <div>
      <p>اظهار الحالة</p>
      <div><input type="checkbox" name="" id="" /></div>
    </div>
    <div>
      <p>اظهار الاهتمامات</p>
      <div><input type="checkbox" name="" id="" /></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
h1.section-title {
  font-size: 18px;
  color: #000;
  font-weight: 700;
}
.settings {
  margin-top: 20px;
  > div {
    display: flex;
    align-items: center;
    gap: 50px;
    margin-bottom: 14px;
    justify-content: space-between;
    width: 30%;
    p {
      color: #000;
      font-weight: 500;
      margin: 0;
    }
  }
}
</style>
