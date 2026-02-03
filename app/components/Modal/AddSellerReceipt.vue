<script setup lang="ts">
const { t } = useI18n();

interface ValidationError {
  field: string;
  message: string;
}

interface OrderItem {
  item_id: number;
  title: string;
}

interface Order {
  items: OrderItem[];
}

const props = defineProps({
  order: {
    type: Object as () => Order,
    required: true,
  },
});

const emit = defineEmits(["close", "success"]);
const modalRef = ref<HTMLElement | null>(null);

const showModal = () => {
  const SellerReceiptModal = new bootstrap.Modal(
    document.getElementById("SellerReceiptModal"),
    {},
  );
  SellerReceiptModal.show();
};

const hideModal = () => {
  const myModalEl = document.getElementById("SellerReceiptModal");
  const SellerReceiptModal = bootstrap.Modal.getInstance(myModalEl);
  if (SellerReceiptModal) {
    SellerReceiptModal.hide();
  }
};

defineExpose({
  showModal,
  hideModal,
});

const isLoading = ref(false);
const isSubmitting = ref(false);
const validationErrors = reactive<ValidationError[]>([]);
const fileInput = ref<File | null>(null);

const invoiceNum = ref("");
const notes = ref("");

// Validation rules
const validateForm = (): boolean => {
  validationErrors.length = 0;
  let isValid = true;

  if (!invoiceNum.value) {
    validationErrors.push({
      field: "invoiceNum",
      message: "ادخل رقم الحوالة",
    });
    isValid = false;
  }

  // Validate file if uploaded
  if (fileInput.value) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(fileInput.value.type)) {
      validationErrors.push({
        field: "file",
        message: "صيغ الملف غير مدعومة. الصيغ المسموحة: JPEG, PNG, JPG, GIF",
      });
      isValid = false;
    }

    if (fileInput.value.size > maxSize) {
      validationErrors.push({
        field: "file",
        message: "حجم الملف أكبر من 5 ميجابايت",
      });
      isValid = false;
    }
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

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    fileInput.value = target.files[0];
    clearError("file");
  } else {
    fileInput.value = null;
  }
};
const { locale } = useI18n();

const toast = useToast();

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const res = await $fetch("/api/orders/dispute", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        order_id: props?.order?.id,
        comment: desc.value.trim(),
        problem_id: invoiceNum.value!,
        order_item_id: selectedItem.value!,
      },
    });

    emit("success", props?.order);
    hideModal();
    toast.success({
      title: t("submit.success"),
      message: res?.message,
      rtl: locale.value === "ar",
    });
    resetForm();
  } catch (error: any) {
    toast.error({
      title: t("submit.error"),
      message: t("submit.errorP"),
      rtl: locale.value === "ar",
    });

    // Show error message
    if (!validationErrors.length) {
      validationErrors.push({
        field: "general",
        message: error.message || "Failed to submit dispute. Please try again.",
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  invoiceNum.value = "";
  notes.value = "";

  // Reset file input element
  const fileInputElement = document.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  if (fileInputElement) {
    fileInputElement.value = "";
  }
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
    class="modal SellerReceiptModal modal-lg"
    id="SellerReceiptModal"
    role="dialog"
    tabindex="-1"
    aria-labelledby="SellerReceiptModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            {{ $t("order.receipt") }}
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
            ></button>
          </div>

          <form @submit.prevent="submitForm" :disabled="isSubmitting">
            <div class="mb-4">
              <label class="form-label"> رقم الحوالة </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': getError('invoiceNum') }"
                v-model="invoiceNum"
                @input="clearError('invoiceNum')"
                :placeholder="'ادخل رقم الحوالة'"
                :disabled="isSubmitting"
              />
              <div
                v-if="getError('invoiceNum')"
                class="invalid-feedback d-block"
              >
                {{ getError("invoiceNum") }}
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label"> ملاحظات </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': getError('notes') }"
                v-model="notes"
                @input="clearError('notes')"
                :placeholder="'ادخل الملاحظات'"
                :disabled="isSubmitting"
              />
              <div
                v-if="getError('notes')"
                class="invalid-feedback d-block"
              >
                {{ getError("notes") }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">
                ملف الحوالة
              </label>
              <input
                type="file"
                class="form-control"
                :class="{ 'is-invalid': getError('file') }"
                @change="handleFileChange"
                accept="image/*"
                :disabled="isSubmitting"
              />
              <div v-if="getError('file')" class="invalid-feedback d-block">
                {{ getError("file") }}
              </div>
              <div class="form-text text-muted">
                Maximum file size: 5MB. Allowed formats: JPEG, PNG, JPG, GIF
              </div>
            </div>

            <button
              type="submit"
              class="btn-zaad w-100 d-flex align-items-center justify-content-center"
              :disabled="isSubmitting"
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

  &:focus {
    border-color: var(--main-color);
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
}

select {
  option:disabled {
    color: #a9a9a9;
  }
}

button:focus {
  box-shadow: none;
}

.btn-zaad {
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.invalid-feedback {
  font-size: 12px;
}

.text-danger {
  color: #dc3545 !important;
}
</style>
