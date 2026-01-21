<script setup lang="ts">
const props = defineProps({
  order: {
    required: true,
  },
});

const emit = defineEmits(["close"]);
const modalRef = ref(null);

const showModal = () => {
  const addAddressModal = new bootstrap.Modal(
    document.getElementById("orderItemsModal"),
    {},
  );
  addAddressModal.show();
};

const hideModal = () => {
  const myModalEl = document.getElementById("orderItemsModal");
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
    class="modal orderItemsModal modal-lg"
    id="orderItemsModal"
    role="dialog"
    tabindex="-1"
    aria-labelledby="orderItemsModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            {{ $t("order.items") }}
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body pt-0">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <td>المنتج</td>
                  <td>سعر الوحدة</td>
                  <td>كمية</td>
                  <td>شركة الشحن</td>
                  <td>سعر الشحن</td>
                  <td>المجموع</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in order?.items" :key="i">
                  <td>
                    <NuxtLink
                      @click="hideModal"
                      :href="$localePath(`/products/item/${item?.item_id}`)"
                    >
                      {{ item?.title }}</NuxtLink
                    >
                  </td>
                  <td>
                    {{ $t("general.curr_value", { value: item?.item_price }) }}
                  </td>
                  <td>
                    {{ item?.quantity }}
                  </td>

                  <td>
                    {{ item?.shipping_service }}
                  </td>

                  <td>
                    {{
                      $t("general.curr_value", { value: item?.shipping_price })
                    }}
                  </td>

                  <td>
                    <span class="fw-bold">
                      {{
                        $t("general.curr_value", { value: item?.total_price })
                      }}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
table {
  > :not(caption) > * > * {
    background-color: transparent;
    color: #000;
    font-weight: 500;
    font-size: 14px;
    padding: 17px;
  }
  svg {
    cursor: pointer;
  }
  a {
    color: var(--main-color);
    &:hover {
      opacity: 0.8;
    }
  }
}
button:focus {
  box-shadow: none;
}
</style>
