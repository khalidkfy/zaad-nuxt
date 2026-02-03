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

const getAnyError = (errors: any) => {
  const first = Object.values(errors ?? {})[0];

  if (Array.isArray(first)) return first[0];
  if (typeof first === "string") return first;

  return null;
};

const { clear: logout } = useUserSession();
const router = useRouter();

const callLogout = async () => {
  await logout();
  toast.warning({
    title: t("login.loged-out"),
    message: `${t("login.loged-out-desc")}`,
    rtl: locale.value === "ar",
  });
  router.push("/");
};

const toast = useToast();
// email update
const email = ref("");
const emailPassword = ref("");
const updateEmailLoading = ref(false);
const invalidEmailUpdate = ref("");
const updateEmail = async () => {
  invalidEmailUpdate.value = "";
  if (!email.value || !emailPassword.value) {
    invalidEmailUpdate.value = t("validations.422");
    toast.error({
      title: t("submit.error"),
      message: t("validations.422"),
      rtl: locale.value === "ar",
    });
    return;
  }
  try {
    updateEmailLoading.value = true;
    const res = await $fetch("/api/profile/update-email", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        email: email.value,
        password: emailPassword.value,
      },
    });

    if (res?.status != 200) {
      const errMsg = getAnyError(res?.errors);
      toast.error({
        title: t("submit.error"),
        message: errMsg,
        rtl: locale.value === "ar",
      });
      invalidEmailUpdate.value = errMsg;
    } else {
      await callLogout();
    }
  } catch (err) {
    console.log(err);
  } finally {
    updateEmailLoading.value = false;
  }
};

// password update
const password = ref("");
const newPassword = ref("");
const newPasswordConfirm = ref("");
const updatePasswordLoading = ref(false);
const invalidPasswordUpdate = ref("");
const updatePassword = async () => {
  invalidPasswordUpdate.value = "";
  if (!password.value || !newPassword.value || !newPasswordConfirm.value) {
    invalidPasswordUpdate.value = t("validations.422");
    toast.error({
      title: t("submit.error"),
      message: t("validations.422"),
      rtl: locale.value === "ar",
    });
    return;
  }
  try {
    updatePasswordLoading.value = true;
    const res = await $fetch("/api/profile/update-password", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        password: password.value,
        new_password: newPassword.value,
        new_password_confirmation: newPasswordConfirm.value,
      },
    });

    if (res?.status != 200) {
      const errMsg = getAnyError(res?.errors);
      toast.error({
        title: t("submit.error"),
        message: errMsg,
        rtl: locale.value === "ar",
      });
      invalidPasswordUpdate.value = errMsg;
    } else {
      await callLogout();
    }
  } catch (err) {
    console.log(err);
  } finally {
    updatePasswordLoading.value = false;
  }
};

const getSecurityQuestions = async () => {
  try {
    const res = await $fetch("/api/profile/security_questions", {
      method: "GET",
      headers: {
        Lang: locale.value,
      },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
onMounted(async () => {
  await getSecurityQuestions();
});
</script>
<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="section-title">{{ $t("links.accountsecurity") }}</h1>
  </div>
  <div class="content mt-3">
    <form>
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
      <!-- TODO update phone number, security questions -->
    </form>
    <form @submit.prevent="updateEmail">
      <h3>{{ $t("links.emailSettings") }}</h3>
      <div class="row mt-3">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">{{ $t("register.email") }}</label>
            <input
              type="email"
              class="form-control"
              v-model="email"
              name="email"
              :placeholder="$t('register.emailPlace')"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">{{ $t("register.password") }}</label>

            <div class="input-group mb-3">
              <input
                type="password"
                v-model="emailPassword"
                class="form-control"
                :placeholder="$t('register.passwordPlace')"
              />
            </div>
          </div>
          <div class="mb-3">
            <button :disabled="updateEmailLoading" class="btn-zaad">
              {{ $t("general.update") }}
            </button>
          </div>
        </div>
      </div>
      <div class="err" v-if="invalidEmailUpdate.length">
        {{ invalidEmailUpdate }}
      </div>
      <hr />
    </form>
    <form @submit.prevent="updatePassword">
      <h3>{{ $t("links.passwordSettings") }}</h3>
      <div class="row mt-3">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">{{ $t("register.password") }}</label>

            <div class="input-group mb-3">
              <input
                name="password"
                v-model="password"
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
                name="newPassword"
                v-model="newPassword"
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
                name="newPasswordConfirm"
                v-model="newPasswordConfirm"
                type="password"
                class="form-control"
                :placeholder="$t('register.passwordPlace')"
              />
            </div>
          </div>
          <div class="mb-3">
            <button :disabled="updatePasswordLoading" class="btn-zaad">
              {{ $t("general.update") }}
            </button>
          </div>
        </div>
      </div>
      <div class="err" v-if="invalidPasswordUpdate.length">
        {{ invalidPasswordUpdate }}
      </div>
    </form>
  </div>
</template>
<style scoped lang="scss">
h1.section-title {
  font-size: 18px;
  color: #000;
  font-weight: 700;
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
.err {
  color: #dc3545;
}
</style>
