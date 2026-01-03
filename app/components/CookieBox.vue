<template>
  <div
    v-if="showCookieBox"
    aria-label="cookie box"
    class="cookie-box"
  >
    <p class="me-2">
      {{ $t("cookies.text") }}
      <NuxtLink
        class="text-white"
        :href="$localePath('privacy-policy')"
      >  
        {{ $t("links.privacyPolicy") }}
      </NuxtLink>
    </p>

    <button
      type="button"
      aria-label="ok"
      class="ok"
      @click="acceptCookies"
    >
      {{ $t("general.ok") }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showCookieBox = ref(false)

const COOKIE_KEY = 'cookie-consent'

onMounted(() => {
  const consent = localStorage.getItem(COOKIE_KEY)

  if (!consent) {
    showCookieBox.value = true
  }
})

const acceptCookies = () => {
  localStorage.setItem(COOKIE_KEY, 'accepted')
  showCookieBox.value = false;
}
</script>

<style scoped lang="scss">
.cookie-box {
  background-color: var(--main-color);
  display: flex;
  justify-content: center;
  color: #fff;
  padding: 10px;
  align-items: center;
  font-size: 12px;

  a {
    text-decoration: underline;
  }
}

.cookie-box p {
  margin: 0;
}

.cookie-box button.ok {
  background-color: var(--main-color-hover);
  border: 0;
  outline: none;
  color: #fff;
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 4px;
  transition: var(--trans);
}

.cookie-box button.ok:hover {
  background-color: #fff;
  color: var(--main-color);
}
</style>
