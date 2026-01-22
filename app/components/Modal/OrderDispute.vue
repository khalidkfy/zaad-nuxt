<script setup lang="ts">
 const { t } = useI18n();

interface Problem {
  id: number;
  value: string;
}

interface OrderItem {
  item_id: number;
  title: string;
}

interface Order {
  items: OrderItem[];
}

interface ValidationError {
  field: string;
  message: string;
}

const props = defineProps({
  order: {
    type: Object as () => Order,
    required: true,
  },
  problems: {
    type: Array as () => Problem[],
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["close", "success"]);
const modalRef = ref<HTMLElement | null>(null);

const showModal = () => {
  const addAddressModal = new bootstrap.Modal(
    document.getElementById("orderDisputeModal"),
    {},
  );
  addAddressModal.show();
};

const hideModal = () => {
  const myModalEl = document.getElementById("orderDisputeModal");
  const addAddressModal = bootstrap.Modal.getInstance(myModalEl);
  if (addAddressModal) {
    addAddressModal.hide();
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

const selectedProblem = ref<number | null>(null);
const selectedItem = ref<number | null>(null);
const desc = ref("");
const videoLink = ref("");

// Validation rules
const validateForm = (): boolean => {
  validationErrors.length = 0;
  let isValid = true;

  if (!selectedProblem.value) {
    validationErrors.push({
      field: "problemType",
      message: "اختر نوع المشكلة",
    });
    isValid = false;
  }

  if (!selectedItem.value) {
    validationErrors.push({
      field: "product",
      message: "اختر المنتج",
    });
    isValid = false;
  }

  if (!desc.value.trim()) {
    validationErrors.push({
      field: "desc",
      message: "الوصف مطلوب",
    });
    isValid = false;
  } else if (desc.value.trim().length < 10) {
    validationErrors.push({
      field: "desc",
      message: "الوصف يجب أن يكون على الأقل 10 أحرف",
    });
    isValid = false;
  }

  if (videoLink.value && !isValidUrl(videoLink.value)) {
    validationErrors.push({
      field: "videoLink",
      message: "رابط الفيديو غير صالح",
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

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
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
    // const formData = new FormData();
    // formData.append("problem_id", selectedProblem.value!.toString());
    // formData.append("order_item_id", selectedItem.value!.toString());
    // formData.append("comment", desc.value.trim());
    // formData.append("video_link", videoLink.value);
    // formData.append("order_id", props?.order?.id);

    // if (fileInput.value) {
    //   formData.append("image", fileInput.value);
    // }

    const res = await $fetch("/api/orders/dispute", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        order_id: props?.order?.id,
        comment: desc.value.trim(),
        problem_id: selectedProblem.value!,
        order_item_id: selectedItem.value!,
      },
    });

    console.log(res);

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
  selectedProblem.value = null;
  selectedItem.value = null;
  desc.value = "";
  videoLink.value = "";
  fileInput.value = null;
  validationErrors.length = 0;

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
    class="modal orderDisputeModal modal-lg"
    id="orderDisputeModal"
    role="dialog"
    tabindex="-1"
    aria-labelledby="orderDisputeModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            {{ $t("order.orderDispute") }}
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
            <div class="mb-3">
              <label class="form-label">
                {{ $t("contact.form.problemType") }}
                <span class="text-danger">*</span>
              </label>
              <select
                v-model="selectedProblem"
                class="form-select"
                :class="{ 'is-invalid': getError('problemType') }"
                name="problemType"
                id="problemType"
                @change="clearError('problemType')"
                :disabled="isSubmitting"
              >
                <option :value="null" disabled>
                  {{ $t("contact.form.problemTypePlaceholder") }}
                </option>
                <option
                  v-for="(problem, i) in problems"
                  :key="i"
                  :value="problem.id"
                >
                  {{ problem.value }}
                </option>
              </select>
              <div
                v-if="getError('problemType')"
                class="invalid-feedback d-block"
              >
                {{ getError("problemType") }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">
                {{ $t("general.product") }} <span class="text-danger">*</span>
              </label>
              <select
                v-model="selectedItem"
                class="form-select"
                :class="{ 'is-invalid': getError('product') }"
                name="product"
                id="product"
                @change="clearError('product')"
                :disabled="isSubmitting"
              >
                <option :value="null" disabled>
                  {{ $t("general.product") }}
                </option>
                <option
                  v-for="(item, i) in order?.items"
                  :key="i"
                  :value="item.item_id"
                >
                  {{ item.title }}
                </option>
              </select>
              <div v-if="getError('product')" class="invalid-feedback d-block">
                {{ getError("product") }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">
                {{ $t("general.desc") }} <span class="text-danger">*</span>
              </label>
              <textarea
                rows="5"
                cols="20"
                class="form-control"
                :class="{ 'is-invalid': getError('desc') }"
                v-model="desc"
                @input="clearError('desc')"
                :placeholder="$t('general.desc')"
                :disabled="isSubmitting"
              ></textarea>
              <div v-if="getError('desc')" class="invalid-feedback d-block">
                {{ getError("desc") }}
              </div>
              <div class="form-text text-muted">
                Minimum 10 characters required
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">
                {{ $t("general.img") }}
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

            <div class="mb-4">
              <label class="form-label">
                {{ $t("general.videoLink") }}
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': getError('videoLink') }"
                v-model="videoLink"
                @input="clearError('videoLink')"
                :placeholder="$t('general.videoLink')"
                :disabled="isSubmitting"
              />
              <div
                v-if="getError('videoLink')"
                class="invalid-feedback d-block"
              >
                {{ getError("videoLink") }}
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
