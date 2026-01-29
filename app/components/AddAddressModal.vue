<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps({});
const { t, locale } = useI18n();
const emit = defineEmits(["close", "success", "newAddress"]);
const modalRef = ref(null);
const isSubmitting = ref(false);
const citiesRes = ref([]);
const getCitiesLoading = ref(false);

// Form values
const formValues = reactive({
  address_line1: "",
  address_line2: "",
  street: "",
  country: "",
  city: "",
  postal_code: "",
});

// Validation rules
const formRules = {
  address_line1: [
    {
      required: true,
      message: t("validations.required", { key: t("profile.address_line1") }),
    },
  ],
  street: [
    {
      required: true,
      message: t("validations.required", { key: t("profile.street") }),
    },
  ],
  country: [
    {
      required: true,
      message: t("validations.required", { key: t("profile.country") }),
    },
  ],
  city: [
    {
      required: true,
      message: t("validations.required", { key: t("profile.city") }),
    },
  ],
  postal_code: [
    {
      required: true,
      message: t("validations.required", { key: t("profile.postal_code") }),
    },
    {
      pattern: /^[0-9]+$/,
      message: t("validations.onlyNumbersAllowed"),
    },
  ],
};

const { values, errors, validateField, validateAll, reset, hasErrors } =
  useFormValidator(formValues, formRules);

const showModal = () => {
  const addAddressModal = new bootstrap.Modal(
    document.getElementById("addAddressModal"),
    {},
  );
  addAddressModal.show();

  getCountriesRes();
  resetForm();
};

const hideModal = () => {
  const myModalEl = document.getElementById("addAddressModal");
  const addAddressModal = bootstrap.Modal.getInstance(myModalEl);
  if (addAddressModal) {
    addAddressModal.hide();
  }
};

// Fetch countries
const { getCountriesRes, getCountriesLoading, countryRes } = useCountry();

// Fetch cities when country changes
watch(
  () => values.country,
  async (newCountryId) => {
    if (newCountryId) {
      await getCities(newCountryId);
    } else {
      citiesRes.value = [];
      values.city = "";
    }
  },
);

const getCities = async (countryId: any) => {
  getCitiesLoading.value = true;
  try {
    const response = await $fetch("/api/countries/cities", {
      query: { country_id: countryId },
      headers: {
        Language: locale.value,
      },
    });
    citiesRes.value = response.data || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    citiesRes.value = [];
  } finally {
    getCitiesLoading.value = false;
  }
};

const resetForm = () => {
  reset();
  values.address_line1 = "";
  values.address_line2 = "";
  values.street = "";
  values.country = "";
  values.city = "";
  values.postal_code = "";
  citiesRes.value = [];
  getCitiesLoading.value = false;
  isSubmitting.value = false;
};

const handleSubmit = async () => {
  if (!validateAll()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Submit the form data
    const response = await $fetch("/api/profile/add-address", {
      method: "POST",
      body: {
        address_line_1: values.address_line1,
        address_line_2: values.address_line2,
        address_line_3: values.street,
        country_id: values.country,
        city_id: values.city,
        postcode: values.postal_code,
        default: false,
      },
    });

 
    // Emit success event
    emit("newAddress", response);

    // Hide modal on success
    hideModal();

    // Reset form
    resetForm();
  } catch (error) {
    // Handle API validation errors
    if (error.data?.errors) {
      Object.keys(error.data.errors).forEach((key) => {
        if (errors[key]) {
          errors[key] = error.data.errors[key];
        }
      });
    }
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
};

defineExpose({
  showModal,
  hideModal,
});

onMounted(async () => {
  if (modalRef.value) {
    modalRef.value.addEventListener("hidden.bs.modal", () => {
      emit("close");
    });
  }
});

onBeforeUnmount(() => {
  if (modalRef.value) {
    modalRef.value.removeEventListener("hidden.bs.modal", () => {
      emit("close");
    });
  }
});
</script>

<template>
  <div
    class="modal addAddressModal fade"
    id="addAddressModal"
    role="dialog"
    tabindex="-1"
    aria-labelledby="addAddressModal"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            {{ $t("general.addAddress") }}
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="isSubmitting"
          ></button>
        </div>
        <div class="modal-body">
          <template v-if="!getCountriesLoading">
            <form
              class="Fh-100 d-flex justify-content-between flex-column"
              @submit.prevent="handleSubmit"
            >
              <div class="row">
                <div class="col-md-12 mb-3">
                  <div class="form-group">
                    <label for="address_line1" class="form-label">
                      {{ $t("profile.address_line1") }} *
                    </label>
                    <input
                      v-model="values.address_line1"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors?.address_line1?.length }"
                      id="address_line1"
                      :disabled="isSubmitting"
                      @blur="validateField('address_line1')"
                    />
                    <div
                      v-if="errors.address_line1?.length"
                      class="invalid-feedback d-block"
                    >
                      {{ errors.address_line1[0] }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mb-3">
                  <div class="form-group">
                    <label for="address_line2" class="form-label">
                      {{ $t("profile.address_line2") }}
                    </label>
                    <input
                      v-model="values.address_line2"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors?.address_line2?.length }"
                      id="address_line2"
                      :disabled="isSubmitting"
                    />
                  </div>
                </div>

                <div class="col-md-12 mb-3">
                  <div class="form-group">
                    <label for="street" class="form-label">
                      {{ $t("profile.street") }} *
                    </label>
                    <input
                      v-model="values.street"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors?.street?.length }"
                      id="street"
                      :disabled="isSubmitting"
                      @blur="validateField('street')"
                    />
                    <div
                      v-if="errors.street?.length"
                      class="invalid-feedback d-block"
                    >
                      {{ errors.street[0] }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mb-3">
                  <div class="form-group">
                    <label for="country" class="form-label">
                      {{ $t("profile.country") }} *
                    </label>
                    <select
                      v-model="values.country"
                      class="form-select"
                      :class="{ 'is-invalid': errors?.country?.length }"
                      id="country"
                      :disabled="isSubmitting || getCountriesLoading"
                      @change="validateField('country')"
                    >
                      <option value="" disabled selected>
                        {{ $t("profile.selectCountry") }}
                      </option>
                      <option
                        v-for="(country, i) in countryRes?.resources || []"
                        :key="i"
                        :value="country?.id"
                      >
                        {{ country?.title }}
                      </option>
                    </select>
                    <div
                      v-if="errors.country?.length"
                      class="invalid-feedback d-block"
                    >
                      {{ errors.country[0] }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mb-3">
                  <div class="form-group">
                    <label for="city" class="form-label">
                      {{ $t("profile.city") }} *
                    </label>
                    <select
                      v-model="values.city"
                      class="form-select"
                      :class="{
                        'is-invalid': errors?.city?.length || getCitiesLoading,
                      }"
                      id="city"
                      :disabled="
                        isSubmitting || !values.country || getCitiesLoading
                      "
                      @change="validateField('city')"
                    >
                      <option value="" disabled selected>
                        <template v-if="getCitiesLoading">
                          {{ $t("general.wait") }}
                        </template>
                        <template v-else>
                          {{ $t("profile.selectCity") }}
                        </template>
                      </option>
                      <option
                        v-for="(city, i) in citiesRes"
                        :key="i"
                        :value="city?.id"
                      >
                        {{ city?.name || city?.title }}
                      </option>
                    </select>
                    <div
                      v-if="errors.city?.length"
                      class="invalid-feedback d-block"
                    >
                      {{ errors.city[0] }}
                    </div>
                    <div v-if="getCitiesLoading" class="text-muted small mt-1">
                      {{ $t("general.wait") }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mb-4">
                  <div class="form-group">
                    <label for="postal_code" class="form-label">
                      {{ $t("profile.postal_code") }} *
                    </label>
                    <input
                      v-model="values.postal_code"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors?.postal_code?.length }"
                      id="postal_code"
                      :disabled="isSubmitting"
                      @blur="validateField('postal_code')"
                      @input="validateField('postal_code')"
                    />
                    <div
                      v-if="errors.postal_code?.length"
                      class="invalid-feedback d-block"
                    >
                      {{ errors.postal_code[0] }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="modal-footer border-0 pt-0">
                <button
                  type="submit"
                  class="btn-zaad"
                  :disabled="isSubmitting || hasErrors"
                >
                  <template v-if="isSubmitting">
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {{ $t("general.wait") }}
                  </template>
                  <template v-else>
                    {{ $t("general.save") }}
                  </template>
                </button>
              </div>
            </form>
          </template>
          <template v-else>
            <div class="row">
              <div class="col text-center py-5 my-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">{{ $t("general.wait") }}</span>
                </div>
                <p class="mt-3">{{ $t("general.wait") }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.addAddressModal {
  .form-label {
    font-weight: 500;
    color: #495057;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .form-control,
  .form-select {
    padding: 0.75rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 0.95rem;

    &:focus {
      border-color: #86b7fe;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }

    &.is-invalid {
      border-color: #dc3545;

      &:focus {
        box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
      }
    }

    &:disabled {
      background-color: #e9ecef;
      opacity: 0.7;
    }
  }

  .invalid-feedback {
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  .modal-footer {
    padding: 1.5rem 0 0 0;

    .btn {
      padding: 0.625rem 1.5rem;
      border-radius: 6px;
      font-weight: 500;
      min-width: 100px;

      &:disabled {
        opacity: 0.65;
      }
    }

    .btn-primary {
      background-color: #0d6efd;
      border-color: #0d6efd;

      &:hover:not(:disabled) {
        background-color: #0b5ed7;
        border-color: #0a58ca;
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 576px) {
  .addAddressModal {
    .modal-dialog {
      margin: 0.5rem;
    }

    .modal-content {
      border-radius: 8px;
    }

    .modal-header {
      padding: 1rem;
    }

    .modal-body {
      padding: 1rem;
    }

    .form-control,
    .form-select {
      padding: 0.625rem 0.875rem;
    }

    .modal-footer {
      .btn {
        padding: 0.5rem 1.25rem;
        font-size: 0.9rem;
      }
    }
  }
}
</style>
