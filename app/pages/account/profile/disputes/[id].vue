<script setup lang="ts">
const { t, locale } = useI18n();

useSeo({
  title: t("meta.setMeta", { meta: t("links.disputes") }),
  description: t("meta.setMeta", { meta: t("links.disputes") }),
});
definePageMeta({
  layout: "profile",
  middleware: "authenticated",
  breadcrumbs: [
    {
      name: "links.accountInfo",
      url: "/account/profile",
    },
  ],
});

const route = useRoute();
const id = route.params.id;
onMounted(async () => {
  await getDispute();
});
const disputesLoading = ref(true);
const dispute = ref(null);

const getDispute = async () => {
  try {
    disputesLoading.value = true;

    const res = await $fetch("/api/disputes/details", {
      headers: {
        Lang: locale.value,
      },
      query: {
        disputeId: id,
      },
    });

    dispute.value = res?.data;
  } catch (err) {
  } finally {
    disputesLoading.value = false;
  }
};

const toast = useToast();

const informAdminLoading = ref(false);
const informAdmin = async () => {
  if (dispute.value?.adminInformed) return;
  try {
    informAdminLoading.value = true;

    const res = await $fetch("/api/disputes/inform-admin", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        disputeId: id,
      },
    });

    toast.success({
      title: t("submit.success"),
      message: res?.message,
      rtl: locale.value === "ar",
    });

    await getDispute();

   } catch (err) {
  } finally {
    informAdminLoading.value = false;
  }
};
// TODO::HANDLE rest of dispute status
const closeDisputeLoading = ref(false);
const closeDispute = async () => {
  try {
    closeDisputeLoading.value = true;

    const res = await $fetch("/api/disputes/close", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        disputeId: id,
        status: 1,
      },
    });

    toast.success({
      title: t("submit.success"),
      message: res?.message,
      rtl: locale.value === "ar",
    });

    await getDispute();

   } catch (err) {
  } finally {
    closeDisputeLoading.value = false;
  }
};

const { profileData } = useProfile();
const comment = ref("");
const sendMsg = async () => {
  if (!comment.value.length) return;
  try {
    const res = await $fetch("/api/disputes/comment", {
      method: "POST",
      headers: {
        Lang: locale.value,
      },
      body: {
        disputeId: id,
        comment: comment.value,
        problem: dispute?.problem_id,
        product: dispute?.item_id,
      },
    });

    toast.success({
      title: t("submit.success"),
      message: res?.message,
      rtl: locale.value === "ar",
    });
    comment.value = "";
    await getDispute();

    console.log(res, "res");
  } catch (err) {
  } finally {
    closeDisputeLoading.value = false;
  }
};
</script>
<template>
  <div class="">
    <div class="d-flex justify-content-between align-items-center">
      <h1 class="section-title">تفاصيل النزاع</h1>
      <div v-if="dispute" class="dispute-btns">
        <div
          v-if="dispute?.dispute_status_id == 4"
          class="badge btn btn-warning"
        >
          هذا النزاع مغلق
        </div>
        <button
          v-if="dispute?.dispute_status_id != 4"
          :disabled="closeDisputeLoading"
          class="btn btn-sm btn-danger me-2"
          @click.prevent="closeDispute()"
        >
          <span
            v-if="closeDisputeLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          إغلاق النزاع
        </button>
        <button
          v-if="!dispute?.adminInformed && dispute?.dispute_status_id != 4"
          :disabled="informAdminLoading"
          @click.prevent="informAdmin()"
          class="btn btn-sm btn-success"
        >
          <span
            v-if="informAdminLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          ارسال للإدارة
        </button>
      </div>
    </div>
    <div v-if="!disputesLoading" class="info">
      <div>
        <p>كود التذكرة</p>
        <p>{{ dispute?.dispute_code }}</p>
      </div>
      <div>
        <p>المنتج</p>
        <p>
          <NuxtLink :href="$localePath(`/products/item/${dispute?.item_id}`)">{{
            dispute?.item
          }}</NuxtLink>
        </p>
      </div>
      <div>
        <p>تاريخ انشاء التذكرة</p>
        <p>{{ dispute?.created_at }}</p>
      </div>
      <div>
        <p>رقم الطلب</p>
        <p>{{ dispute?.order_no }}</p>
      </div>
      <div>
        <p>نوع المشكلة</p>
        <p>{{ dispute?.problem }}</p>
      </div>
      <div>
        <p>الحاله</p>
        <p>{{ dispute?.status }}</p>
      </div>
      <div>
        <p>ارسلت للادارة</p>
        <p>
          <span
            :class="dispute?.adminInformed ? 'text-success' : 'text-danger'"
          >
            {{ dispute?.adminInformed ? "نعم" : "لا" }}
          </span>
        </p>
      </div>
      <div>
        <p>المشكلة</p>
        <p>{{ dispute?.comments[0]?.comment }}</p>
      </div>
      <div>
        <p>رابط الفيديو</p>
        <p>{{ dispute?.video_url || "--" }}</p>
      </div>
    </div>
    <div v-else class="row">
      <div class="col text-center py-5 my-5">
        {{ $t("general.wait") }}
      </div>
    </div>
  </div>
  <div v-if="dispute" class="comments">
    <h3>المحادثات</h3>
    <div class="message-box">
      <div
        v-for="(msg, i) in dispute?.comments"
        class="message"
        :class="`type-${msg.type?.toLowerCase()}`"
      >
        <div class="user">
          <NuxtImg
            width="35"
            height="35"
            :src="profileData?.profile?.image ?? '/assets/images/user.svg'"
          />
          <div>
            <div class="name">{{ msg?.name }}</div>
            <div class="date">{{ msg?.date }}</div>
          </div>
        </div>
        <div class="msg">{{ msg?.comment }}</div>
      </div>
    </div>
    <hr class="" />
    <form v-if="dispute?.dispute_status_id != 4" @submit.prevent="sendMsg()">
      <textarea
        class="form-control"
        v-model="comment"
        name="comment"
        id="comment"
      ></textarea>
      <button :disabled="!comment.length" type="submit" class="btn-zaad mt-3">
        ارسال
      </button>
    </form>
  </div>
</template>
<style scoped lang="scss">
hr {
  border: 1px solid #888888;
}
.comments {
  margin-top: 40px;
  .message-box {
    margin-top: 20px;

    .message {
      width: 50%;
      margin-bottom: 10px;
      .date {
        color: #a4a4a4;
        font-size: 14px;
      }
      .user {
        font-weight: bold;
        img {
          border-radius: 50%;
        }
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }
      .msg {
        background-color: #fff;
        padding: 10px;
      }
    }
  }
}
h1.section-title,
h3 {
  font-size: 18px;
  color: #000;
  font-weight: 700;
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
</style>
