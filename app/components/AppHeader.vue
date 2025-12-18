<script setup lang="ts">
const props = defineProps({
    layout: {
        required: false,
        type: String,
        default: "app"
    }
});
const { user, loggedIn } = useUserSession();

</script>
<template>
    <header>
        <!-- Cookie box -->
        <ClientOnly>
            <section>
                <CookieBox />
            </section>
        </ClientOnly>

        <!-- Header Actions -->
        <section>
            <HeaderActions />
        </section>

        <!-- Navbar -->
        <div v-if="layout === 'app'" class="container">
            <nav class="main-navbar" aria-label="Main menu">
                <div class="brand">
                    <NuxtLink :to="$localePath('index')">
                        <NuxtImg alt="Zaad Logo" width="132" height="38" src="/assets/images/logo/zaad-logo.svg" />
                    </NuxtLink>
                </div>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasOptions" aria-controls="offcanvasOptions">
                    <NuxtImg class="me-2" width="30" height="30" alt="location" src="/assets/images/categs.svg" />
                </button>
                <div class="offcanvas offcanvas-start overflow-y-auto" tabindex="-1" id="offcanvasOptions"
                    aria-labelledby="offcanvasOptionsLabel">

                    <div class="offcanvas-header justify-content-between w-100">

                    </div>
                    <div class="offcanvas-body">
                        <div class="location">
                            <NuxtImg class="me-2" width="24" height="24" alt="location"
                                src="/assets/images/location.svg" />
                            <a href="#deliver">
                                <div class="d-flex">
                                    <span>{{ $t("navbar.deliverOrReceive") }}</span>
                                    <span
                                        title="مصر-مدينتي-مجموعة الابراج الخامسة والستين واي نص عشان نجرب الطول والنقط"
                                        class="truncate">مصر-مدينتي-مجموعة الابراج الخامسة والستين واي نص عشان نجرب
                                        الطول والنقط</span>
                                </div>
                            </a>
                        </div>

                        <!-- Search Component -->
                        <ClientOnly>
                            <Search />
                        </ClientOnly>

                        <!-- Login State -->
                        <NuxtLink v-if="!loggedIn" :href="$localePath('/account/login')" class="no-auth ms-4">
                            <NuxtImg class="me-2" width="28" height="28" alt="location" src="/assets/images/user.svg" />
                            <div class="d-flex">
                                <span>{{ $t("general.hello") }}</span>
                                <span class="fw-bold">{{ $t("navbar.signInUp") }}</span>
                            </div>
                        </NuxtLink>
                        <div v-else class="auth cursor-pointer ms-4">
                            <NuxtImg class="me-2" width="28" height="28" alt="location" :src="user?.image || '/assets/images/user.svg'" />
                            <div class="d-flex">
                                <span>{{ $t("general.hello") }}</span>
                                <span class="fw-bold">{{ user?.name }}</span>
                            </div>
                        </div>

                        <!-- Whish -->
                        <WhishListComponent  v-if="loggedIn"/>

                        <!-- Cart -->
                        <!-- <ClientOnly> -->
                        <CartComponent v-if="loggedIn" class="ms-3" />
                        <!-- </ClientOnly> -->
                    </div>

                </div>
            </nav>
        </div>


    </header>
</template>
<style scoped lang="scss">
.main-nav {
    position: fixed;
    bottom: 0;
    z-index: var(--bs-offcanvas-zindex);
    display: flex;
    flex-direction: column;
    max-width: 100%;
    color: var(--bs-offcanvas-color);
    visibility: hidden;
    background-color: var(--bs-offcanvas-bg);
    background-clip: padding-box;
    outline: 0;
    transition: var(--bs-offcanvas-transition);
}

.main-navbar {
    padding: 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .offcanvas {
        &.offcanvas.offcanvas-start {
            @media (min-width: 992px) {
                transform: unset !important;
                width: auto;
                border: 0;
                overflow-y: hidden;
            }
        }

        @media (min-width: 992px) {
            display: block;
            position: unset !important;
            visibility: visible;
            // width: 100%;
        }

        .offcanvas-header {
            @media (min-width: 992px) {
                display: none;

            }

        }

        .offcanvas-body {
            @media (max-width:992px) {
                display: flex;
                flex-direction: column;
                gap: 40px;
            }

            @media (min-width: 992px) {
                display: flex;
                padding: 0;
            }
        }

    }

    >.location {
        margin-inline-end: 60px;
    }

    .collabse {
        @media (max-width: 992px) {
            display: none;
        }
    }

    .navbar-toggler {
        display: none;

        @media (max-width: 992px) {
            display: block;
        }
    }
}

.brand {
    margin-inline-end: 25px;
}

.location {
    display: flex;
    align-items: center;
    text-decoration: none;
    margin-inline-end: 63px;

    div {
        display: flex;
        font-size: 10px;
        flex-direction: column;

        span {
            &:first-child {
                font-size: 10px;
                color: #8E90A7;
            }

            &:last-child {
                font-size: 12px;
                color: #4A4A4A;

            }
        }

        .location {
            img {
                margin-inline-end: 10px;

            }
        }
    }

}

.no-auth,
.auth {
    display: flex;
    align-items: center;
    text-decoration: none;
    width: 180px;
    cursor: pointer;

    div {
        display: flex;
        font-size: 10px;
        flex-direction: column;

        span {
            &:first-child {
                font-size: 10px;
                color: #8E90A7;
            }

            &:last-child {
                font-size: 12px;
                color: #4A4A4A;

                @media(max-width: 1200px) {
                    font-size: 10px;
                }

            }
        }

        .location {
            img {
                margin-inline-end: 10px;

            }
        }
    }

}

.truncate {
    white-space: nowrap;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>