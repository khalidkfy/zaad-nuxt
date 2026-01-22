<script setup lang="ts">
import { ref, reactive } from "vue";

interface Seller {
  name: string;
  id: number;
}

const { t } = useI18n();
const { locale } = useI18n();
const toast = useToast();

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "success"]);
const modalRef = ref<HTMLElement | null>(null);

const showModal = () => {
  const addAddressModal = new bootstrap.Modal(
    document.getElementById("sendSellerModal"),
    {},
  );
  addAddressModal.show();
};

const hideModal = () => {
  const myModalEl = document.getElementById("sendSellerModal");
  const addAddressModal = bootstrap.Modal.getInstance(myModalEl);
  if (addAddressModal) {
    addAddressModal.hide();
  }
};

defineExpose({
  showModal,
  hideModal,
});

interface ValidationError {
  field: string;
  message: string;
}

const isLoading = ref(false);
const isSubmitting = ref(false);
const validationErrors = reactive<ValidationError[]>([]);
const message = ref("");

// Validation rules
const validateForm = (): boolean => {
  validationErrors.length = 0;
  let isValid = true;

  if (!message.value.trim()) {
    validationErrors.push({
      field: "message",
      message: t("validations.required", { key: t("order.msg") }),
    });
    isValid = false;
  } else if (message.value.trim().length < 5) {
    validationErrors.push({
      field: "message",
      message: t("validations.min-length", { length: 5 }),
    });
    isValid = false;
  } else if (message.value.trim().length > 1000) {
    validationErrors.push({
      field: "message",
      message: t("validations.max-full-name", { length: 1000 }),
    });
    isValid = false;
  }

  return isValid;
};

const getError = (fieldName: string): string => {
  const error = validationErrors.find((err) => err.field === fieldName);
  return error ? error.message : "";
};

const clearError = (fieldName: string) => {
  const index = validationErrors.findIndex((err) => err.field === fieldName);
  if (index !== -1) {
    validationErrors.splice(index, 1);
  }
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  isLoading.value = true;

  try {
    const formData = {
      order_id: props.order.id,
      seller_id: props.order.seller.id,
      message: message.value.trim(),
      locale: locale.value,
    };

    const res = await $fetch("/api/orders/send-to-seller", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        seller_id: props?.order?.seller?.id,
        message: message.value.trim(),
      },
    });

    emit("success", res);

    toast.success({
      title: t("submit.success"),
      message: t("submit.successP"),
      rtl: locale.value === "ar",
    });
    hideModal();
    resetForm();
  } catch (error: any) {
    console.error("Error sending message to seller:", error);

    if (!validationErrors.length) {
      validationErrors.push({
        field: "general",
        message: error.message || t("general.requestFailed"),
      });
    }

    toast.error({
      title: t("submit.error"),
      message: t("submit.errorP"),
      rtl: locale.value === "ar",
    });
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

const resetForm = () => {
  message.value = "";
  validationErrors.length = 0;
};

onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener("hidden.bs.modal", () => {
      resetForm();
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
    class="modal sendSellerModal modal-lg"
    id="sendSellerModal"
    role="dialog"
    tabindex="-1"
    aria-labelledby="sendSellerModal"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            {{ $t("order.sendSeller") }}
            <span class="main-color">{{ order?.seller?.name }}</span>
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
          <!-- General Error Message -->
          <div
            v-if="getError('general')"
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {{ getError("general") }}
            <button
              type="button"
              class="btn-close"
              @click="clearError('general')"
              aria-label="Close"
              :disabled="isSubmitting"
            ></button>
          </div>

          <form @submit.prevent="submitForm" novalidate>
            <div class="form-group">
              <label class="form-label">
                {{ $t("order.msg") }} <span class="text-danger">*</span>
              </label>
              <textarea
                rows="5"
                cols="20"
                class="form-control"
                :class="{ 'is-invalid': getError('message') }"
                v-model="message"
                @input="clearError('message')"
                :placeholder="$t('order.msg')"
                :disabled="isSubmitting"
                :maxlength="1000"
              ></textarea>
              <div v-if="getError('message')" class="invalid-feedback d-block">
                {{ getError("message") }}
              </div>
              <div
                class="form-text text-muted d-flex justify-content-between mt-1"
              >
                <span>{{ $t("validations.min-length", { length: 5 }) }}</span>
                <span>{{ message.length }}/1000</span>
              </div>
            </div>

            <button
              type="submit"
              class="btn-zaad w-100 mt-4 d-flex align-items-center justify-content-center"
              :disabled="isSubmitting"
            >
              <template v-if="isSubmitting">
                <span
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{ $t("general.sending") }}
              </template>
              <template v-else>
                {{ $t("general.send") }}
              </template>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-body {
  padding: 25px;
}

label {
  font-size: 14px;
  color: #000;
  font-weight: 500;
}

.main-color {
  color: var(--main-color);
  font-weight: 600;
}

.form-text {
  font-size: 12px;
}

.alert {
  border-radius: 10px;
  margin-bottom: 20px;
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
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--main-color);
    box-shadow: 0 0 0 0.2rem rgba(var(--main-color-rgb), 0.25);
  }

  &::placeholder {
    color: #a9a9a9;
  }

  &.is-invalid {
    border-color: #dc3545;
    &:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
    }
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

button:focus {
  box-shadow: none;
}

.btn-zaad {
  padding: 12px;
  border-radius: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

.invalid-feedback {
  font-size: 12px;
  margin-top: 4px;
}

.text-danger {
  color: #dc3545 !important;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.5rem;

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .btn-close {
    &:disabled {
      opacity: 0.5;
    }
  }
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}
</style>
