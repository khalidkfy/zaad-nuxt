<script setup lang="ts">
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath()
const switchLocale = (newLocale: any) => {
    const url = switchLocalePath(newLocale) // uses current route automatically

    if (url) {
        // Optional: set a cookie to persist locale
        document.cookie = `i18n_redirected=${newLocale}; path=/; max-age=31536000`

        // Full page reload
        window.location.href = url
    }
}
</script>
<template>

    <div class="header-actions" aria-label="Switchers">
        <div class="container">
            <div class="actions">
                <div class="dropdowns">
                    <div class="dropdown d-inline-block me-3">
                        <button class="nav-link dropdown-toggle" title="language switcher" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <NuxtImg v-if="locale === 'ar'" class="me-1 " width="21" height="12"
                                src="/assets/images/flags/oman.svg" alt="oman arabic" />
                            <NuxtImg v-if="locale === 'en'" class="me-1 " width="21" height="12"
                                src="/assets/images/flags/uk.svg" alt="uk english" />
                            {{ locale === 'ar' ? "العربية" : "English" }}
                        </button>
                        <ul class="dropdown-menu">

                            <li>
                                <a @click.prevent="switchLocale('ar')" href="#ar" class="dropdown-item text-sec-color">
                                    <NuxtImg aria-hidden="true" class="me-1" width="21" height="12"
                                        src="/assets/images/flags/oman.svg" alt="oman arabic" />
                                    {{ $t("langs.ar") }}
                                </a>
                            </li>
                            <li>
                                <a @click.prevent="switchLocale('en')" href="#en" class="dropdown-item text-sec-color">
                                    <NuxtImg aria-hidden="true" class="me-1 " width="21" height="12"
                                        src="/assets/images/flags/uk.svg" alt="uk english" />
                                    {{ $t("langs.en") }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="dropdown d-inline-block">
                        <button class="nav-link dropdown-toggle" title="currency switcher" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            ر.ع
                        </button>
                        <ul class="dropdown-menu">

                            <li>
                                <a aria-hidden="true" href="#usd" class="dropdown-item text-sec-color">
                                    ر.ع
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="registration">
                    <NuxtLink :to="$localePath('/account/register?as=seller')">{{ $t("register.asSeller") }}</NuxtLink>
                    <NuxtLink :to="$localePath('/account/register?as=shipping')">{{ $t("register.asShipping") }}</NuxtLink>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped lang="scss">
.header-actions {
    padding: 10px;
    border-bottom: 1px solid #E5E5E5;

    @media (max-width:992px) {
        padding: 10px 0;
    }
}

.header-actions .actions {
    display: flex;
    justify-content: space-between;
}

.header-actions button {
    font-size: 12px;
    color: #4A4A4A;
    font-weight: 600;
    display: flex;
    align-items: center;

}

.dropdown-toggle::after {
    border-top-color: #8E90A7;
    margin-top: 2px;
}

.dropdown-menu a {
    font-size: 12px;
}

.header-actions .registration a:first-child {
    margin-inline-end: 15px;
}

.header-actions .registration a {
    display: inline-block;
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
    color: #B2B2B2;
    text-transform: capitalize;
    transition: var(--trans);
}

.header-actions .registration a:hover {
    text-decoration: underline;
    color: #888888;
}
</style>