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
    <h1 class="section-title">{{ $t("links.accountsecurity") }}</h1>
  </div>
  <div class="content mt-3">
    <form>
      <hr />
      <h3>{{ $t("links.phoneSettings") }}</h3>
      <div class="row mt-3">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="">{{ $t("register.phone") }}</label>
            <div class="input-group mb-3">
              <div class="input-group-text">
                <select id="mobile_region" class="form-select">
                  <template v-if="locale == 'ar'">
                    <option value="OM" selected>عُمان +968</option>
                    <option value="KW">الكويت +965</option>
                    <option value="QA">قطر +974</option>
                    <option value="BH">البحرين +973</option>
                    <option value="SA">السعودية +966</option>
                    <option value="UAE">الإمارات +971</option>
                    <option value="YE">اليمن +967</option>
                    <option value="EG">مصر +20</option>
                  </template>
                  <template v-if="locale == 'en'">
                    <option value="OM" selected>Oman +968</option>
                    <option value="KW">Kuwait +965</option>
                    <option value="QA">Qatar +974</option>
                    <option value="BH">Bahrain +973</option>
                    <option value="SA">Saudi Arabia +966</option>
                    <option value="UAE">United Arab Emirates +971</option>
                    <option value="YE">Yemen +967</option>
                    <option value="EG">Egypt +20</option>
                  </template>
                </select>
              </div>

              <input
                type="text"
                class="form-control"
                :placeholder="$t('register.phonePlace')"
              />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">{{ $t("register.password") }}</label>

            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                :placeholder="$t('register.passwordPlace')"
              />
            </div>
          </div>
          <div class="mb-3">
            <button class="btn-zaad">{{ $t("general.update") }}</button>
          </div>
        </div>
      </div>
      <hr />
    </form>
    <form>
      <h3>{{ $t("links.emailSettings") }}</h3>
      <div class="row mt-3">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">{{ $t("register.email") }}</label>
            <input
              type="email"
              class="form-control"
              :placeholder="$t('register.emailPlace')"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">{{ $t("register.password") }}</label>

            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                :placeholder="$t('register.passwordPlace')"
              />
            </div>
          </div>
          <div class="mb-3">
            <button class="btn-zaad">{{ $t("general.update") }}</button>
          </div>
        </div>
      </div>
      <hr />
    </form>
    <form>
      <h3>{{ $t("links.passwordSettings") }}</h3>
      <div class="row mt-3">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">{{ $t("register.password") }}</label>

            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                :placeholder="$t('register.passwordPlace')"
              />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">{{ $t("register.password") }}</label>

            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                :placeholder="$t('register.passwordPlace')"
              />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">{{ $t("register.password") }}</label>

            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                :placeholder="$t('register.passwordPlace')"
              />
            </div>
          </div>
          <div class="mb-3">
            <button class="btn-zaad">{{ $t("general.update") }}</button>
          </div>
        </div>
      </div>
      <hr />
    </form>
  </div>
</template>
<style scoped lang="scss">
h1.section-title {
  font-size: 18px;
}
h3 {
  font-size: 16px;
}
label {
  font-size: 14px;
  font-weight: 400;
}

input {
  border: 1px solid #dfdfdf;
  background-color: #fbfbfb;
  direction: unset !important;
  padding: 15px;
  border-radius: 14px;
  box-shadow: none;

  &::placeholder {
    color: #888888;
  }

  &:focus {
    border-color: var(--main-color);
  }

  &.invalid {
    border-color: #dc3545;
  }
}
</style>
