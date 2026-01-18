<script setup lang="ts">
const props = defineProps({});

const emit = defineEmits(["close"]);
const modalRef = ref(null);

const showModal = () => {
  const addAddressModal = new bootstrap.Modal(
    document.getElementById("addAddressModal"),
    {}
  );
  addAddressModal.show();
};

const hideModal = () => {
  const myModalEl = document.getElementById("addAddressModal");
  const addAddressModal = bootstrap.Modal.getInstance(myModalEl);
  if (addAddressModal) {
    addAddressModal.hide();
  }
};

defineExpose({
  showModal,
  hideModal,
});

onMounted(() => {
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
    class="modal addAddressModal"
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
          ></button>
        </div>
        <div class="modal-body pt-0">
          <form
            
            class="Fh-100 d-flex justify-content-between flex-column"
          >
            <div class="row">
              <div class="col-md-12 mb-3">
                <div class="form-group">
                  <label for="country" class="form-label">
                    {{ $t("profile.country") }}</label
                  >
                  <!-- <select
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
                  </select> -->
                  <!-- <div
                    v-if="errors.country?.length"
                    class="form-text text-danger text-sm"
                  >
                    {{ errors.country[0] }}
                  </div> -->
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
