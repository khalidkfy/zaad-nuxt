<script setup lang="ts">
const { t, locale } = useI18n();
useSeo({});
definePageMeta({
  layout: "profile",
  middleware: "authenticated",
  breadcrumbs: [
    {
      name: "links.accountaddresses",
      url: "/account/profile/addresses",
    },
  ],
});
const { getProfileLoading, profileData, getProfileRes } = useProfile();
const addAddressModal = ref(null);

const showModal = async () => {
  await addAddressModal.value.showModal();
};

const { values, errors, validateAll, reset, hasErrors } = useFormValidator(
  {
    country: "",
  },
  {
    country: [
      {
        required: true,
        message: t("validations.required", { key: t("profile.country") }),
      },
    ],
  }
);
const { getCountriesRes, getCountriesLoading, countryRes } = useCountry();

const handleSubmit = async () => {};
onMounted(async () => {
  // await getCountriesRes();
});

const toast = useToast();
const deleteAddress = async (adress: any) => {
  try {
    const res = await $fetch("/api/profile/delete-address", {
      method: "DELETE",
      headers: {
        Lang: locale.value,
      },
      query: {
        addressId: adress?.id,
      },
    });
    if (res?.status) {
      toast.success({
        title: t("submit.success"),
        message: t("submit.successP"),
        rtl: locale.value === "ar",
      });
      confirmDeleteHide();
      await getProfileRes();
    } else {
      toast.error({
        title: t("submit.error"),
        message: t("submit.errorP"),
        rtl: locale.value === "ar",
      });
    }
  } catch (err) {
    console.error(err);
    toast.error({
      title: t("submit.error"),
      message: t("submit.errorP"),
      rtl: locale.value === "ar",
    });
  }
};

const selectedAddress = ref(null);
const confirmDelete = (address: any) => {
  selectedAddress.value = address;
  const confirmDelete = new bootstrap.Modal(document.getElementById("confirmDelete"), {});
  confirmDelete.show();
};

const confirmDeleteHide = () => {
  const myModalEl = document.getElementById("confirmDelete");
  const confirmDelete = bootstrap.Modal.getInstance(myModalEl);
  if (confirmDelete) {
    confirmDelete.hide();
  }
};

const addressToEdit = ref(null);
const editAddress = async (address: any) => {
  addressToEdit.value = address;
  await showModal();
};

const { joinTexts } = useGlobal();

</script>
<template>
  <div class="d-flex justify-content-between align-items-center">
    <h1 class="section-title">{{ $t("links.accountaddresses") }}</h1>
    <template v-if="!getProfileLoading">
      <button @click.prevent="showModal()" class="btn action">
        {{ $t("general.addAddress") }}
      </button>
    </template>
  </div>
  <div class="content">
    <div class="row">
      <div class="col-md-3 mb-4" v-for="(adress, i) in profileData?.addresses" :key="i">
        <div class="address-card">
          <div class="layer">
            <button @click.prevent="editAddress(adress)" class="edit" title="edit">
              <img
                loading="lazy"
                width="20"
                height=""
                src="/assets/images/edit.svg"
                alt="edit"
              />
            </button>
            <button @click.prevent="confirmDelete(adress)" class="delete" title="delete">
              <img
                loading="lazy"
                width="20"
                height=""
                src="/assets/images/delete.svg"
                alt="delete"
              />
            </button>
          </div>

          <div>
            <span>{{ $t("profile.country") }}</span>
            <span>{{ adress.country }}</span>
          </div>
          <div>
            <span>{{ $t("profile.postcode") }}</span>
            <span>{{ adress.postcode }}</span>
          </div>
          <div>
            <span>{{ $t("profile.city") }}</span>
            <span>{{ adress.city }}</span>
          </div>
          <div>
            <span>{{ $t("profile.streetAddress") }}</span>
            <span>{{ joinTexts(adress.address_line_1, adress.address_line_2, adress.address_line_3) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal confirmDelete fade"
    id="confirmDelete"
    role="dialog"
    tabindex="-1"
    aria-labelledby="confirmDelete"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-sm modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body p-0 text-center">
          <div class="my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Group_90679"
              data-name="Group 90679"
              width="55"
              height="55"
              viewBox="0 0 78.937 70.822"
            >
              <g id="Group_90674" data-name="Group 90674">
                <g id="Group_90673" data-name="Group 90673" transform="translate(0 0)">
                  <path
                    id="Path_97084"
                    data-name="Path 97084"
                    d="M77.678,83.215,47.506,30.956a9.282,9.282,0,0,0-16.077,0L1.258,83.214A9.282,9.282,0,0,0,9.3,97.137H69.64a9.282,9.282,0,0,0,8.039-13.923Zm-4.005,6.97a4.61,4.61,0,0,1-4.033,2.329H9.3a4.657,4.657,0,0,1-4.033-6.986L35.435,33.268a4.657,4.657,0,0,1,8.067,0L73.673,85.527A4.61,4.61,0,0,1,73.673,90.184Z"
                    transform="translate(0 -26.315)"
                    fill="var(--main-color)"
                  />
                </g>
              </g>
              <g
                id="Group_90676"
                data-name="Group 90676"
                transform="translate(37.156 23.079)"
              >
                <g id="Group_90675" data-name="Group 90675">
                  <rect
                    id="Rectangle_22336"
                    data-name="Rectangle 22336"
                    width="4.625"
                    height="23.123"
                    fill="var(--main-color)"
                  />
                </g>
              </g>
              <g
                id="Group_90678"
                data-name="Group 90678"
                transform="translate(36.385 50.827)"
              >
                <g id="Group_90677" data-name="Group 90677">
                  <path
                    id="Path_97085"
                    data-name="Path 97085"
                    d="M239.085,355.99a3.083,3.083,0,1,0,3.083,3.083A3.087,3.087,0,0,0,239.085,355.99Z"
                    transform="translate(-236.002 -355.99)"
                    fill="var(--main-color)"
                  />
                </g>
              </g>
            </svg>
          </div>
          <p class="text-dark">{{$t("general.confirmDelete")}}</p>
        </div>
        <div class="modal-footer border-0 justify-content-center p-0 pb-1">
          <button @click.prevent="deleteAddress(selectedAddress)" class="btn-zaad">{{$t("general.confirm")}}</button>
          <button  @click.prevent="confirmDeleteHide" class="btn-zaad bg-danger">{{$t("general.close")}}</button>
        </div>
      </div>
    </div>
  </div>
  <AddAddressModal
    :address-to-edit="addressToEdit"
    @newAddress="getProfileRes()"
    @addressUpdated="getProfileRes()"
    ref="addAddressModal"
  />
</template>
<style scoped lang="scss">
h1.section-title {
  font-size: 18px;
}
button.action {
  padding: 7px 30px;
  border-radius: 16px;
  border-color: #cdcdcd;
  color: #4a4a4a;
  transition: var(--trans);
  &:hover {
    background-color: #e2e2e2;
  }
}
.content {
  margin-top: 35px;
  .address-card {
    border: 1px solid #cdcdcd;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 5px;
    padding: 10px;
    transition: var(--trans);
    position: relative;
    > .layer {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
      background-color: #e2e2e288;
      z-index: 2;
      transition: var(--trans);
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      gap: 10px;
      button {
        background-color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid #dedede;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: var(--trans);
        &:hover {
          background-color: #e2e2e2;
        }
      }
    }
    &:hover {
      .layer {
        display: flex;
      }
    }
    > div:not(.layer) {
      display: flex;
      gap: 5px;
      font-size: 12px;
      flex-direction: column;

      span {
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
}
</style>
