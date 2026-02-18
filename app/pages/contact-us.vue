<script setup lang="ts">
const { t , locale} = useI18n();
useSeo({
  title: t("meta.setMeta", { meta: t("meta.pages.contact.title") }),
  description: `${t("meta.pages.contact.desc")}`,
  keywords: `${t("meta.pages.contact.keywords")}`,
});
const { constants } = useConstants();

const { values, errors, validateAll, reset, hasErrors } = useFormValidator(
  {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    msg: "",
  },
  {
    firstName: [
      {
        required: true,
        message: t("validations.required", { key: t("contact.form.firstName") }),
      },
    ],
    lastName: [
      {
        required: true,
        message: t("validations.required", { key: t("contact.form.lastName") }),
      },
    ],
    mobile: [
      {
        required: true,
        message: t("validations.required", { key: t("contact.form.phoneNumber") }),
      },
    ],
    msg: [
      {
        required: true,
        message: t("validations.required", { key: t("contact.form.msg") }),
      },
    ],
    email: [
      {
        required: true,
        message: t("validations.required", { key: t("contact.form.email") }),
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
  }
);

const toast = useToast();

const resetForm = () => {
  values.firstName = "";
  values.lastName = "";
  values.email = "";
  values.mobile = "";
  values.msg = "";
};
const formLoading = ref(false);
const handleSubmit = async () => {
  reset();
  if (!validateAll() || hasErrors.value) return;
  formLoading.value = true;
  try {
    console.log(123123);

    setTimeout(() => {
      resetForm();
      toast.success({
        title: t("submit.success"),
        message: t("submit.successP"),
        rtl: locale.value === "ar",
      });
      formLoading.value = false;
    }, 2000);
  } catch (err) {
    console.log(err);
  } finally {
  }
};
const confirm = ref(false);
</script>
<template>
  <div class="page-content mt-5">
    <div class="container">
      <div class="banner">
        <h1>{{ $t("contact.h1") }}</h1>
        <p>{{ $t("contact.p") }}</p>
      </div>
      <div class="row mt-5">
        <div class="col-md-7">
          <div class="contact-form h-100">
            <form @submit.prevent="handleSubmit" class="h-100">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="form-group">
                    <label for="firstName" class="form-label">{{
                      $t("contact.form.firstName")
                    }}</label>
                    <input
                      :class="{ invalid: errors?.firstName?.length }"
                      v-model="values.firstName"
                      class="form-control"
                      type="text"
                      name="firstName"
                      id="firstName"
                      :placeholder="$t('contact.form.firstNamePlaceholder')"
                    />
                    <div
                      v-if="errors.firstName?.length"
                      id="emailHelp"
                      class="form-text text-danger text-sm"
                    >
                      {{ errors.firstName[0] }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="lastName" class="form-label">
                      {{ $t("contact.form.lastName") }}</label
                    >
                    <input
                      :class="{ invalid: errors?.lastName?.length }"
                      v-model="values.lastName"
                      class="form-control"
                      type="text"
                      name="lastName"
                      id="lastName"
                      :placeholder="$t('contact.form.lastNamePlaceholder')"
                    />
                    <div
                      v-if="errors.lastName?.length"
                      id="emailHelp"
                      class="form-text text-danger text-sm"
                    >
                      {{ errors.lastName[0] }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="form-group">
                    <label for="email" class="form-label">
                      {{ $t("contact.form.email") }}</label
                    >
                    <input
                      :class="{ invalid: errors?.email?.length }"
                      v-model="values.email"
                      class="form-control"
                      type="email"
                      name="email"
                      id="email"
                      :placeholder="$t('contact.form.emailPlaceholder')"
                    />
                    <div
                      v-if="errors.email?.length"
                      id="emailHelp"
                      class="form-text text-danger text-sm"
                    >
                      {{ errors.email[0] }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="form-group">
                    <label for="phoneNumber" class="form-label">
                      {{ $t("contact.form.phoneNumber") }}</label
                    >
                    <input
                      :class="{ invalid: errors?.mobile?.length }"
                      v-model="values.mobile"
                      class="form-control"
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      :placeholder="$t('contact.form.phoneNumberPlaceholder')"
                    />
                    <div
                      v-if="errors.mobile?.length"
                      id="emailHelp"
                      class="form-text text-danger text-sm"
                    >
                      {{ errors.mobile[0] }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="message" class="form-label">{{
                      $t("contact.form.msg")
                    }}</label>
                    <textarea
                      :class="{ invalid: errors?.msg?.length }"
                      v-model="values.msg"
                      class="form-control"
                      id="message"
                      rows="4"
                      :placeholder="$t('contact.form.msgPlaceholder')"
                    ></textarea>
                    <div
                      v-if="errors.msg?.length"
                      id="emailHelp"
                      class="form-text text-danger text-sm"
                    >
                      {{ errors.msg[0] }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="footer mt-4 mb-4">
                <div class="form-check">
                  <input
                    v-model="confirm"
                    class="form-check-input"
                    type="checkbox"
                    id="confirmData"
                  />
                  <label class="form-check-label" for="confirmData">
                    {{ $t("contact.form.confirm") }}
                  </label>
                </div>
                <button
                  :disabled=" !confirm || formLoading"
                  type="submit"
                  class="btn-zaad w-30"
                >
                  {{ $t("general.send") }}
                </button>
              </div>
              <div class="info-section my-5">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <div class="info-card">
                      <div class="info">
                        <p class="mb-2">{{ $t("contact.email") }}</p>
                        <p>{{ constants?.resources?.contacts?.email }}</p>
                      </div>
                      <div class="icon">
                        <a :href="`mailto:${constants?.resources?.contacts?.email}`">
                          <img
                            loading="lazy"
                            width="40"
                            height="40"
                            src="/assets/images/info-arrow.svg"
                            alt="info"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="info-card">
                      <div class="info">
                        <p class="mb-2">{{ $t("contact.hotline") }}</p>
                        <p>{{ constants?.resources?.contacts?.hotline }}</p>
                      </div>
                      <div class="icon">
                        <a :href="`tel:${constants?.resources?.contacts?.hotline}`">
                          <img
                            loading="lazy"
                            width="40"
                            height="40"
                            src="/assets/images/info-arrow.svg"
                            alt="info"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="col-md-5">
          <div class="d-flex h-100 w-100">
            <NuxtImg
              class="img-fluid me-auto"
              width="180"
              loading="lazy"
              src="/assets/images/contact1.png"
              alt="company"
            />
            <NuxtImg
              class="img-fluid"
              width="289"
              loading="lazy"
              src="/assets/images/contact2.png"
              alt="company"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
[dir="ltr"] .icon img {
  transform: rotate(114deg);
}
.info-card {
  border: 1px solid #004a981f;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  min-height: 115px;
  align-items: center;
  transition: var(--trans);

  &:hover {
    transform: translateY(-2px);
  }

  .icon {
    background-color: var(--main-color);
    border-radius: 50%;
    transition: var(--trans);

    &:hover {
      background-color: #ff6a2a !important;
    }
  }
}

.info-card .info p {
  color: #444c4e;
  font-size: 18px;
  font-weight: 400;
}

.info-card .info > p:first-child {
  font-size: 14px;
}
.page-content {
  .banner {
    height: 270px;
    border-radius: 16px;
    background-color: #004a9814;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    @media (max-width: 992px) {
      height: auto;
      padding: 20px;
    }

    h1 {
      font-size: 24px;
      color: #4a4a4a;
      font-weight: 700;
      margin-bottom: 20px;
    }

    p {
      color: #444c4e;
      font-weight: 400;
      width: 45%;
      text-align: center;

      @media (max-width: 992px) {
        width: 100%;
      }
    }
  }

  .contact-form {
    background-color: #f9f9f9;
    border-radius: 16px;
    padding: 20px 30px;

    label {
      font-size: 14px;
      color: #000;
    }

    input:not([type="checkbox"]),
    select,
    textarea {
      border: 1px solid #dfdfdf;
      border-radius: 14px;
      background-color: #fbfbfb;
      padding: 10px 20px;
      box-shadow: none;
      direction: unset !important;

      &:focus {
        border-color: var(--main-color);
      }

      &::placeholder {
        color: #a9a9a9;
      }
      &.invalid {
        border-color: #dc3545;
      }
    }

    select {
      option:disabled {
        color: #a9a9a9;
      }
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    button[type="submit"] {
      width: 25%;
    }
  }
}
</style>
