<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
const { locale } = useI18n();

onMounted(() => {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });   
});
// onMounted(() => {
//   if (process.client) {
//     const script = document.createElement('script')
//     script.src = '/assets/bootstrap.bundle.min.js'
//     script.defer = true
//     document.head.appendChild(script)
//   }
// })
useHead(() => {
  const isRTL = locale.value === "ar";

  const links: any[] = [
    // Bootstrap CSS
    {
      rel: "stylesheet",
      href: isRTL
        ? "/assets/bootstrap.rtl.min.css"
        : "/assets/bootstrap.min.css",
      id: "bootstrap-style",
    },
  ];

  //  RTL style
  if (isRTL) {
    // links.push({
    //   rel: 'stylesheet',
    //   href: '/assets/css/style-rtl.css',
    //   id: 'main-rtl-style',
    // })
  }

  return {
    htmlAttrs: {
      lang: locale.value,
      dir: isRTL ? "rtl" : "ltr",
    },
    link: links,
  };
});
</script>
