<script setup lang="ts">
const { fetch } = useUserSession();
const { t, locale } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
definePageMeta({
  layout: "auth",
});

useSeo({
  title: t("register.h1"),
  description: t("register.h1"),
});

const { values, errors, validateAll, reset, hasErrors } = useFormValidator(
  {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  },
  {
    name: [
      {
        required: true,
        message: t("validations.required", { key: t("register.name") }),
      },
    ],
    email: [
      {
        required: true,
        message: t("validations.required", { key: t("register.email") }),
      },

      {
        pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: t("validations.email.invalid-email"),
      },

      {
        pattern: /^\S.*\S$|^\S$/,
        message: t("validations.email.no-space-start-end", {
          key: t("login.emailPhone"),
        }),
      },

      {
        pattern: /^[\x20-\x7E@._%+-]+$/,
        message: t("validations.email.no-emoji", {
          key: t("login.emailPhone"),
        }),
      },
    ],
    password: [
      {
        required: true,
        message: t("validations.required", { key: t("register.password") }),
      },
    ],
    phone: [
      {
        required: true,
        message: t("validations.required", { key: t("register.phone") }),
      },
    ],
    passwordConfirm: [
      {
        required: true,
        message: t("validations.required", {
          key: t("register.passwordConfirm"),
        }),
      },
    ],
  }
);

const formLoading = ref(false);
const submitErr = ref("");
const submitSuccess = ref(false);
const viewPassword = ref(false);

const handleResponseErr = (errs) => {
  console.log(errs, "errs");

  if (errs?.email) {
    errors.email = errs.email;
  }

  if (errs?.name) {
    errors.name = errs.name;
  }
  if (errs?.password) {
    errors.password = errs.password;
  }
  if (errs?.password_confirmation) {
    errors.passwordConfirm = errs.password_confirmation;
  }
  if (errs?.mobile) {
    errors.phone = errs.mobile;
  }
  if (errs?.mobile_region) {
    errors.phone = errs.mobile_region;
  }
};
const handleRegister = async () => {
  submitErr.value = "";
  submitSuccess.value = false;
  reset();
  if (!validateAll() || hasErrors.value) return;
  formLoading.value = true;
  try {
    const mobile_region = document.getElementById("mobile_region").value;

    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        email: values.email,
        name: values.name,
        password: values.password,
        password_confirmation: values.passwordConfirm,
        mobile: values.phone,
        mobile_region: mobile_region,
      },
    }).then((res) => {});

    if (response.data) {
      submitSuccess.value = true;
    }
  } catch (err) {
    console.log(err?.data?.data);

    if (err?.data?.data?.errors) {
      handleResponseErr(err?.data?.data?.errors);
    }
    submitErr.value = err?.data?.data?.message;
  } finally {
    formLoading.value = false;
  }
};
</script>
<template>
  <section class="auth-section p-5">
    <div class="container">
      <div class="text-center">
        <NuxtImg
          width="132"
          height="32"
          src="/assets/images/logo/zaad-logo.svg"
        />
        <h1>{{ $t("register.h1") }}</h1>
      </div>

      <form @submit.prevent="handleRegister()" class="auth-form">
        <div v-if="submitErr?.length" class="alert alert-warning my-3">
          {{ submitErr || t("validations.submitErr") }}
        </div>
        <div v-if="submitSuccess" class="alert alert-success my-3">
          {{ t("login.signed-in") }}
        </div>

        <div class="mb-3">
          <label class="form-label">{{ $t("register.name") }}</label>
          <input
            :class="{ invalid: errors?.name?.length }"
            v-model="values.name"
            type="text"
            class="form-control"
            :placeholder="$t('register.namePlace')"
          />
          <div v-if="errors.name?.length" class="form-text text-danger text-sm">
            {{ errors.name[0] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t("register.email") }}</label>
          <input
            :class="{ invalid: errors?.email?.length }"
            v-model="values.email"
            type="email"
            class="form-control"
            :placeholder="$t('register.emailPlace')"
          />
          <div
            v-if="errors.email?.length"
            class="form-text text-danger text-sm"
          >
            {{ errors.email[0] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t("register.phone") }}</label>

          <div class="input-group mb-3">
            <div class="input-group-text" id="basic-addon1">
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
              :class="{ invalid: errors?.phone?.length }"
              v-model="values.phone"
              type="text"
              class="form-control"
              :placeholder="$t('register.phonePlace')"
            />
          </div>

          <div
            v-if="errors.phone?.length"
            class="form-text text-danger text-sm"
          >
            {{ errors.phone[0] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t("register.password") }}</label>

          <div class="input-group mb-3">
            <input
              :class="{ invalid: errors?.password?.length }"
              v-model="values.password"
              type="password"
              class="form-control"
              :placeholder="$t('register.passwordPlace')"
            />
            <!-- <div class="input-group-text" id="basic-addon1">eye</div> -->
          </div>

          <div
            v-if="errors.password?.length"
            class="form-text text-danger text-sm"
          >
            {{ errors.password[0] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t("register.passwordConfirm") }}</label>

          <div class="input-group mb-3">
            <input
              :class="{ invalid: errors?.passwordConfirm?.length }"
              v-model="values.passwordConfirm"
              type="password"
              class="form-control"
              :placeholder="$t('register.passwordConfirmPlace')"
            />
            <!-- <div class="input-group-text" id="basic-addon1">eye</div> -->
          </div>

          <div
            v-if="errors.password?.length"
            class="form-text text-danger text-sm"
          >
            {{ errors.passwordConfirm[0] }}
          </div>
        </div>

        <button :disabled="formLoading" type="submit" class="btn-zaad mt-4">
          <span v-if="!formLoading">{{ $t("register.btn") }}</span>
          <span v-else class="indicator-progress f-normal fs-20">
            {{ t("general.wait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <div class="mt-4 text-center fw-bold">
          {{ $t("register.Account") }}
          <NuxtLink :href="$localePath('/account/login')">{{
            $t("register.clickHere")
          }}</NuxtLink>
        </div>
      </form>
    </div>
  </section>
</template>
<style scoped lang="scss">
section.auth-section {
  display: flex;
  justify-content: center;
  margin: auto;
  width: 40%;

  img {
    text-align: center;
  }

  h1 {
    font-size: 24px;
    font-weight: 500;
    margin-top: 15px;
  }

  .auth-form {
    margin-top: 40px;

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

    .forgot {
      color: #7b7b7b;
      font-weight: 500;
    }

    a {
      color: var(--main-color);
      text-decoration: underline;
    }

    .btn-zaad {
      width: 100%;
      border-radius: 14px;
      padding: 14px;
    }
  }

  /* Container */
  .custom-check {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
  }

  /* Hide default checkbox */
  .custom-check .form-check-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* Custom box */
  .custom-check .form-check-label {
    position: relative;
    padding-right: 28px;
    cursor: pointer;
    font-size: 14px;
    color: #444c4e;
    font-weight: 400;
  }

  /* Square */
  .custom-check .form-check-label::before {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    border: 2px solid #000;
    border-radius: 4px;
    background: #fff;
  }

  /* Check icon */
  .custom-check .form-check-input:checked + .form-check-label::after {
    content: "✓";
    position: absolute;
    right: 3px;
    top: 50%;
    transform: translateY(-55%);
    font-size: 14px;
    font-weight: bold;
    color: #000;
  }
}
</style>
