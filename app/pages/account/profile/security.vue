<script setup lang="ts">
const { t, locale } = useI18n();
useSeo({
  title: t("meta.setMeta", { meta: t("links.accountsecurity") }),
  description: t("meta.setMeta", { meta: t("links.accountsecurity") }),
});
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
const { profileData, getProfileRes } = useProfile();
const isMobileEdit = ref(false);
const isEmailEdit = ref(false);

const isEmailActivateLoading = ref(false);
const activateEmailErrs = ref([]);

const sendEmailCode = async () => {
  try {
    isEmailActivateLoading.value = true;
    activateEmailErrs.value = [];
    const res = await $fetch("/api/profile/send-email-code", {
      headers: {
        Lang: locale.value,
      },
      query: {
        userId: profileData.value?.id,
      },
    });

    if (res?.status != 200) {
      activateEmailErrs.value = getAnyError(res?.errors) ?? [t("submit.errorP")];
    }

    const modal = new bootstrap.Modal(document.getElementById("emailCodeModal"));
    if (modal) {
      modal.show();
    }
  } catch (err) {
    console.log("err =>", err.data.data);
    activateEmailErrs.value = err?.data?.data?.errors ?? [t("submit.errorP")];
  } finally {
    isEmailActivateLoading.value = false;
  }
};

const isEmailverifyLoading = ref(false);
const verifyEmailErrs = ref([]);
const emailCode = ref("");
const verifyEmailCode = async () => {
  try {
    if (!emailCode.value.length) {
      verifyEmailErrs.value = [t("validations.requiredField")];
      return;
    }
    isEmailverifyLoading.value = true;
    verifyEmailErrs.value = [];
    const res = await $fetch("/api/profile/verify-email-code", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        userId: profileData.value?.id,
        code: emailCode.value,
      },
    });

    if (res?.status != 200) {
      verifyEmailErrs.value = [res?.message];
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById("emailCodeModal"));
    if (modal) {
      modal.hide();
    }
    await getProfileRes();
    toast.success({
      title: t("profile.emailVerified"),
      message: "",
      rtl: locale.value === "ar",
    });
  } catch (err) {
    console.log("err =>", err.data.data);
    verifyEmailErrs.value = err?.data?.data?.errors ?? [t("submit.errorP")];
  } finally {
    isEmailverifyLoading.value = false;
  }
};
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
          <template v-if="isMobileEdit">
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
              <button class="btn-zaad me-2">{{ $t("general.update") }}</button>
              <button @click.prevent="isMobileEdit = false" class="btn-zaad cancel">
                {{ $t("general.cancel") }}
              </button>
            </div>
          </template>
          <template v-else>
            <div v-if="profileData" class="mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <label class="form-label">{{ $t("register.phone") }}</label>
                <span @click="isMobileEdit = true" class="edit-link">{{
                  $t("general.edit")
                }}</span>
              </div>
              <input
                type="text"
                class="form-control"
                :placeholder="$t('register.phonePladdce')"
                readonly
                :value="profileData?.mobile"
              />
            </div>
          </template>
        </div>
      </div>
      <hr />
      <!-- TODO update phone number, security questions -->
    </form>
    <form @submit.prevent="updateEmail">
      <h3>{{ $t("links.emailSettings") }}</h3>
      <div class="row mt-3">
        <div class="col-md-6">
          <template v-if="isEmailEdit">
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
              <button type="submit" :disabled="updateEmailLoading" class="btn-zaad me-2">
                {{ $t("general.update") }}
              </button>
              <button @click.prevent="isEmailEdit = false" class="btn-zaad cancel">
                {{ $t("general.cancel") }}
              </button>
            </div>
          </template>
          <template v-else>
            <div v-if="profileData" class="mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <label class="form-label">{{ $t("register.email") }}</label>
                <span @click="isEmailEdit = true" class="edit-link">{{
                  $t("general.edit")
                }}</span>
              </div>
              <input
                type="text"
                class="form-control"
                :placeholder="$t('register.emailPlace')"
                readonly
                :value="profileData?.email"
              />
              <div
                v-if="!profileData.email_verified_at"
                :class="{ 'activate-loading': isEmailActivateLoading }"
                class="alert alert-warning d-flex align-items-center mt-2"
                role="alert"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="me-2"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091
             1.767.982 1.767h13.707c.89 0 1.438-.99.982-1.767L8.982
             1.566zM8 5c.535 0 .954.462.9.995l-.35
             3.507a.552.552 0 0 1-1.1 0L7.1
             5.995A.905.905 0 0 1 8 5zm.002
             6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                  />
                </svg>

                <div class="fs-14">
                  {{ $t("profile.emailNotVerified") }}
                  <span @click="sendEmailCode" class="alert-link">{{
                    $t("profile.emailNotVerifiedClick")
                  }}</span
                  >.
                  <span v-if="isEmailActivateLoading">{{ $t("general.wait") }}</span>
                </div>
              </div>
              <div class="err" v-if="activateEmailErrs.length">
                {{ activateEmailErrs[0] }}
              </div>
            </div>
          </template>
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
  <div class="modal fade" id="emailCodeModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("profile.verifyYourEmail") }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <p>{{ $t("profile.enterVerificationCode") }}</p>

          <input
            type="text"
            class="form-control"
            v-model="emailCode"
            id="emailCodeInput"
            :class="{ invalid: verifyEmailErrs.length }"
            :placeholder="$t('submit.Enter verification code')"
          />
          <div class="mt-2">
            <div class="err">{{ verifyEmailErrs[0] }}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-zaad cancel" data-bs-dismiss="modal">
            {{ $t("general.cancel") }}
          </button>
          <button
            :disabled="isEmailverifyLoading"
            @click.prevent="verifyEmailCode"
            class="btn-zaad"
            id="submitCodeBtn"
          >
            {{ isEmailverifyLoading ? $t("general.wait") : $t("submit.VerifyCode") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.activate-loading {
  cursor: no-drop;
  opacity: 0.8;
}
.alert-link {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.edit-link {
  text-decoration: underline;
  color: var(--main-color);
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
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
