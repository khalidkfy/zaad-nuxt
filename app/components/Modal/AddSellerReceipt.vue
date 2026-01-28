<template>
  <!-- Seller Receipt Modal -->
  <div
    class="modal SellerReceiptModal modal-lg"
    id="SellerReceiptModal"
    role="dialog"
    tabindex="-1"
    aria-labelledby="SellerReceiptModal"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">{{ $t("order.receipt") }}</div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body"></div>
      </div>
    </div>
  </div>
</template>
