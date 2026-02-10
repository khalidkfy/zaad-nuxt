<script setup lang="ts">
definePageMeta({
    layout: "auth",
});

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
useSeo({
    title: t("meta.setMeta", { meta: t("reset.h1") }),
    description: t("reset.h1"),
});

const { values, errors, validateAll, reset, hasErrors } = useFormValidator(
    {
        password: "",
        passwordConfirm: "",
    },
    {

        password: [{
            required: true,
            message: t("validations.required", { key: t("register.password") }),
        },],
        passwordConfirm: [{
            required: true,
            message: t("validations.required", { key: t("register.passwordConfirm") }),
        },]
    },
);

const route = useRoute()
const email = route.query.email
const token = route.query.token;



const formLoading = ref(false);
const submitErr = ref("");
const submitSuccess = ref(false);
// Handle login
const handleSubmit = async () => {
    submitErr.value = "";
    submitSuccess.value = false;
    reset();
    if (!validateAll() || hasErrors.value) return;
    formLoading.value = true;
    try {
        const response = await $fetch("/api/auth/reset", {
            method: "POST",
            body: {
                email: email,
                password: values.password,
                password_confirmation: values.passwordConfirm,
                token: token
            },
        });

        if (response?.status_code != 200) {
            submitErr.value = response?.msg
        } else {
            submitSuccess.value = response?.msg
            setTimeout(async () => {
                await router.push(localePath("/account/login"));
            }, 2000);
        }



    } catch (err) {
        submitErr.value = t("reset.try")

    } finally {
        formLoading.value = false;
    }
};

onMounted(async () => {

    if (!token?.length || !email?.length) {
        await router.push(localePath("/account/login"));
    }
});
</script>
<template>
    <section class="auth-section p-5">
        <div class="container">
            <div class="text-center">
                <img width="132" height="32" src="/assets/images/logo/zaad-logo.svg" />
                <h1>{{ $t("reset.h1") }}</h1>
            </div>

            <form @submit.prevent="handleSubmit()" class="auth-form">
                <div v-if="submitErr?.length" class="alert alert-warning my-3">
                    {{ submitErr || t("validations.submitErr") }}
                </div>
                <div v-if="submitSuccess" class="alert alert-success my-3">
                    {{ submitSuccess }}
                </div>
                <div class="mb-3">
                    <label class="form-label">{{ $t("register.password") }}</label>

                    <div class="input-group mb-3">
                        <input v-model="values.password" type="password" class="form-control"
                            :placeholder="$t('register.passwordPlace')" />
                    </div>

                </div>
                <div class="mb-3">
                    <label class="form-label">{{ $t("register.passwordConfirm") }}</label>

                    <div class="input-group mb-3">
                        <input v-model="values.passwordConfirm" type="password" class="form-control"
                            :placeholder="$t('register.passwordConfirmPlace')" />
                    </div>


                </div>

                <button :disabled="formLoading" type="submit" class="btn-zaad">
                    <span v-if="!formLoading">{{ $t("general.send") }}</span>
                    <span v-else class="indicator-progress f-normal fs-20">
                        {{ t("general.wait") }}
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                </button>
                <div class="mt-4 text-center fw-bold">
                    اذا كنت تتذكر كلمة المرور
                    <NuxtLink :href="$localePath('/account/login')">{{
                        $t("login.clickHere")
                    }}</NuxtLink>
                </div>
            </form>
        </div>
    </section>
</template>
<style scoped lang="scss">
section.auth-section {
    display: flex;
    justify-content: center;
    margin: auto;
    width: 40%;

    @media (max-width: 992px) {
        width: 100%;
    }

    img {
        text-align: center;
    }

    h1 {
        font-size: 24px;
        font-weight: 500;
        margin-top: 15px;
    }

    .auth-form {
        margin-top: 40px;

        label {
            font-size: 14px;
            font-weight: 400;
        }

        input {
            border: 1px solid #dfdfdf;
            background-color: #fbfbfb;
            direction: unset !important;
            padding: 15px;
            border-radius: 14px;
            box-shadow: none;

            &::placeholder {
                color: #888888;
            }

            &:focus {
                border-color: var(--main-color);
            }

            &.invalid {
                border-color: #dc3545;
            }
        }

        .forgot {
            color: #7b7b7b;
            font-weight: 500;
        }

        a {
            color: var(--main-color);
            text-decoration: underline;
        }

        .btn-zaad {
            width: 100%;
            border-radius: 14px;
            padding: 14px;
        }
    }

    /* Container */
    .custom-check {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0;
    }

    /* Hide default checkbox */
    .custom-check .form-check-input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    /* Custom box */
    .custom-check .form-check-label {
        position: relative;
        padding-right: 28px;
        cursor: pointer;
        font-size: 14px;
        color: #444c4e;
        font-weight: 400;
    }

    /* Square */
    .custom-check .form-check-label::before {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        border: 2px solid #000;
        border-radius: 4px;
        background: #fff;
    }

    /* Check icon */
    .custom-check .form-check-input:checked+.form-check-label::after {
        content: "✓";
        position: absolute;
        right: 3px;
        top: 50%;
        transform: translateY(-55%);
        font-size: 14px;
        font-weight: bold;
        color: #000;
    }
}
</style>
