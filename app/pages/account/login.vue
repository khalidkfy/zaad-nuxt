<script setup lang="ts">
const { fetch } = useUserSession();

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
useSeo({
  title: t("login.h1"),
  description: t("login.h1"),
});

const { values, errors, validateAll, reset, hasErrors } = useFormValidator(
  {
    email: "",
    password: "",
    remember_me: false,
  },
  {
    email: [
      {
        required: true,
        message: t("validations.required", { key: t("login.emailPhone") }),
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
        message: t("validations.required", { key: t("login.password") }),
      },
    ],
    remember_me: [],
  }
);

const formLoading = ref(false);
const submitErr = ref("");
const submitSuccess = ref(false);
const viewPassword = ref(false);
// Handle login
const handleLogin = async () => {
  submitErr.value = "";
  submitSuccess.value = false;
  reset();
  if (!validateAll() || hasErrors.value) return;
  formLoading.value = true;
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username: values.email,
        password: values.password,
      },
    });
    if (response.access_token) {
      submitSuccess.value = true;
    }
    try {
      await fetch();
      await router.push(localePath("/"));
      console.log("navigation success");
    } catch (e) {
      console.error("navigation failed", e);
    }
  } catch (err) {
    submitErr.value = err?.data?.data?.message;
  } finally {
    formLoading.value = false;
  }
};
const config = useRuntimeConfig();

onMounted(() => {
  console.log("TEST_KEYTEST_KEYTEST_KEYTEST_KEY", config.public.TEST_KEY);
});
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
        <h1>{{ $t("login.h1") }}</h1>
      </div>

      <form @submit.prevent="handleLogin()" class="auth-form">
        <div v-if="submitErr?.length" class="alert alert-warning my-3">
          {{ submitErr || t("validations.submitErr") }}
        </div>
        <div v-if="submitSuccess" class="alert alert-success my-3">
          {{ t("login.signed-in") }}
        </div>

        <div class="mb-3">
          <label for="emailInput" class="form-label">{{
            $t("login.emailPhone")
          }}</label>
          <input
            :class="{ invalid: errors?.email?.length }"
            v-model="values.email"
            type="email"
            class="form-control"
            id="emailInput"
            aria-describedby="emailHelp"
            :placeholder="$t('login.emailPhonePlace')"
          />
          <div
            v-if="errors.email?.length"
            id="emailHelp"
            class="form-text text-danger text-sm"
          >
            {{ errors.email[0] }}
          </div>
        </div>
        <div class="mb-3">
          <label for="passwordInput" class="form-label">{{
            $t("login.password")
          }}</label>
          <input
            :class="{ invalid: errors?.password?.length }"
            v-model="values.password"
            type="password"
            class="form-control"
            id="passwordInput"
            :placeholder="$t('login.passwordPlace')"
          />
          <div
            v-if="errors.password?.length"
            id="emailHelp"
            class="form-text text-danger text-sm"
          >
            {{ errors.password[0] }}
          </div>
        </div>
        <div class="d-flex justify-content-between mb-3">
          <div class="form-check custom-check">
            <input
              v-model="values.remember_me"
              class="form-check-input"
              type="checkbox"
              id="reminderCheck"
            />
            <label class="form-check-label" for="reminderCheck">
              {{ $t("login.remember") }}
            </label>
          </div>
          <div class="forgot">
            <div>
              {{ $t("login.forgot") }}
              <NuxtLink href="/">{{ $t("login.clickHere") }}</NuxtLink>
            </div>
          </div>
        </div>

        <button :disabled="formLoading" type="submit" class="btn-zaad">
          <span v-if="!formLoading">{{ $t("login.loginBtn") }}</span>
          <span v-else class="indicator-progress f-normal fs-20">
            {{ t("general.wait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <div class="mt-4 text-center fw-bold">
          {{ $t("login.noAccount") }}
          <NuxtLink :href="$localePath('/account/register')">{{
            $t("login.clickHere")
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
