<template>
  <div class="content-loader position-absolute f-normal fs-20">
  {{$t("general.wait")}}
    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
  </div>
</template>
<style scoped lang="scss">
.content-loader {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
