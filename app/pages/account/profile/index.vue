<script setup lang="ts">
const { user, fetch: refreshSession } = useUserSession();
const toast = useToast();
const { t, locale } = useI18n();
useSeo({});
definePageMeta({
  layout: "profile",
  middleware: "authenticated",
  prerender: true,
  breadcrumbs: [
    {
      name: "links.accountInfo",
      url: "/account/profile",
    },
  ],
});
const isEdit = ref(false);

const { getProfileLoading, profileData, getProfileRes } = useProfile();

const { values, errors, validateAll, reset, hasErrors } = useFormValidator(
  {
    lang: "",
    name: "",
    country: "",
    gender: "",
  },
  {
    lang: [
      {
        required: true,
        message: t("validations.required", { key: t("profile.lang") }),
      },
    ],
    country: [
      {
        required: true,
        message: t("validations.required", { key: t("profile.country") }),
      },
    ],
    gender: [
      {
        required: true,
        message: t("validations.required", { key: t("profile.gender") }),
      },
    ],
    name: [
      {
        required: true,
        message: t("validations.required", { key: t("profile.name") }),
      },
    ],
  }
);
watch(
  profileData,
  (newProfile) => {
    if (newProfile) {
      values.name = newProfile.name || "";
      values.email = newProfile.email || "";
      values.country = newProfile?.profile?.country_json.id || "";
      values.gender = newProfile?.profile?.gender || "";
      values.lang = newProfile?.profile?.language || "";
      // add other fields as needed
    }
  },
  { immediate: true } // also set initial values when profileData is already loaded
);
const formLoading = ref(false);
const submitErr = ref("");
const submitSuccess = ref(false);
const handleSubmit = async () => {

  submitErr.value = "";
  submitSuccess.value = false;
  reset();
  if (!validateAll() || hasErrors.value) {
    toast.error({
      title: t("submit.error"),
      message: t("submit.errorP"),
      rtl: locale.value === "ar",
    });

    return;
  }
  formLoading.value = true;
  try {
    const response = await $fetch("/api/profile/update", {
      method: "POST",
      body: {
        country: values.country,
        gender: values.gender,
        language: values.lang,
        name: values.name,
      },
    });

    toast.success({
      title: t("submit.success"),
      message: t("submit.successP"),
      rtl: locale.value === "ar",
    });

    await refreshSession();

    await getProfileRes();
    isEdit.value = false;
  } catch (err) {
    submitErr.value = err?.data?.data?.message;
  } finally {
    formLoading.value = false;
  }
};

const { getCountriesRes, getCountriesLoading, countryRes } = useCountry();

onMounted(async () => {
  await getCountriesRes();
});
</script>
<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="section-title">{{ $t("profile.personalInfo") }}</h1>
    <template v-if="!getProfileLoading">
      <button v-if="!isEdit" @click="isEdit = !isEdit" class="btn is-edit">
        {{ $t("general.edit") }}
      </button>
      <button
        @click.prevent="handleSubmit()"
        :disabled="formLoading"
        type="button"
        v-if="isEdit"
        class="btn-zaad"
      >
        <span v-if="!formLoading"> {{ $t("general.save") }}</span>
        <span v-else class="indicator-progress f-normal fs-20">
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </span>
      </button>
    </template>
  </div>
  <template v-if="!isEdit">
    <div v-if="!getProfileLoading" class="info">
      <div>
        <p>{{ $t("profile.name") }}</p>
        <p>{{ profileData?.name }}</p>
      </div>
      <div>
        <p>{{ $t("profile.country") }}</p>
        <p>{{ profileData?.profile?.country }}</p>
      </div>
      <div>
        <p>{{ $t("profile.gender") }}</p>
        <p>{{ profileData?.profile?.gender }}</p>
      </div>
      <div>
        <p>{{ $t("profile.registerDate") }}</p>
        <p>{{ profileData?.profile?.created_at }}</p>
      </div>
      <div>
        <p>{{ $t("profile.lang") }}</p>
        <p>{{ profileData?.profile?.language }}</p>
      </div>
      <div>
        <p>{{ $t("profile.email") }}</p>
        <p>{{ profileData?.email }}</p>
      </div>
      <div>
        <p>{{ $t("profile.phone") }}</p>
        <p>{{ profileData?.mobile }}</p>
      </div>
    </div>
    <div v-else class="position-relative w-100 h-100">
      <ContentLoader />
    </div>
  </template>
  <template v-else>
    <form
      @submit.prevent="handleSubmit()"
      class="personal-info-form h-100 d-flex justify-content-between flex-column"
    >
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="form-group">
            <label for="name" class="form-label">{{
              $t("profile.name")
            }}</label>
            <input
              class="form-control"
              type="text"
              name="name"
              id="name"
              v-model="values.name"
              :class="{ invalid: errors?.name?.length }"
              :placeholder="$t('profile.name')"
            />
            <div
              v-if="errors.name?.length"
              class="form-text text-danger text-sm"
            >
              {{ errors.name[0] }}
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <div class="form-group">
            <label for="country" class="form-label">
              {{ $t("profile.country") }}</label
            >
            <select
              v-model="values.country"
              class="form-select"
              name="country"
              :class="{ invalid: errors?.country?.length }"
              id="country"
            >
              <option v-if="!getCountriesLoading" disabled selected>
                {{ $t("profile.country") }}
              </option>
              <option v-else disabled selected>
                {{ $t("general.wait") }}
              </option>
              <option
                v-for="(country, i) in countryRes?.resources"
                :key="i"
                :value="country?.id"
              >
                {{ country?.title }}
              </option>
            </select>
            <div
              v-if="errors.country?.length"
              class="form-text text-danger text-sm"
            >
              {{ errors.country[0] }}
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <div class="form-group">
            <label for="gender" class="form-label">
              {{ $t("profile.gender") }}</label
            >
            <select
              v-model="values.gender"
              class="form-select"
              name="gender"
              :class="{ invalid: errors?.gender?.length }"
              id="gender"
            >
              <option disabled selected>
                {{ $t("profile.gender") }}
              </option>

              <option value="ذكر">{{ $t("profile.male") }}</option>
              <option value="انثي">{{ $t("profile.female") }}</option>
            </select>
            <div
              v-if="errors.gender?.length"
              class="form-text text-danger text-sm"
            >
              {{ errors.gender[0] }}
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <div class="form-group">
            <label for="lang" class="form-label">
              {{ $t("profile.lang") }}</label
            >
            <select
              v-model="values.lang"
              class="form-select"
              name="lang"
              id="lang"
              :class="{ invalid: errors?.lang?.length }"
            >
              <option disabled selected>
                {{ $t("profile.lang") }}
              </option>

              <option value="English">{{ $t("langs.en") }}</option>
              <option value="العربية">{{ $t("langs.ar") }}</option>
            </select>
            <div
              v-if="errors.lang?.length"
              class="form-text text-danger text-sm"
            >
              {{ errors.lang[0] }}
            </div>
          </div>
        </div>
      </div>
    </form>
  </template>
</template>
<style scoped lang="scss">
h1.section-title {
  font-size: 18px;
}
button {
  padding: 7px 30px;
  border-radius: 16px;

  &.is-edit {
    border-color: #cdcdcd;
    color: #4a4a4a;
    transition: var(--trans);
    &:hover {
      background-color: #e2e2e2;
    }
  }
}
.info {
  display: flex;
  gap: 70px;
  flex-wrap: wrap;
  margin-top: 35px;
  > div {
    display: flex;
    flex-direction: column;
    p {
      margin: 0;
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
form {
  margin-top: 35px;

  input:not([type="checkbox"]),
  select,
  textarea {
    border: 1px solid #dfdfdf;
    border-radius: 14px;
    background-color: #fbfbfb;
    padding: 10px 20px;
    box-shadow: none;
    direction: unset !important;
    &.invalid {
      border-color: #dc3545;
    }
    &:focus {
      border-color: var(--main-color);
      box-shadow: none;
    }

    &::placeholder {
      color: #a9a9a9;
    }
  }

  select {
    option:disabled {
      color: #a9a9a9;
    }
  }
}
</style>
