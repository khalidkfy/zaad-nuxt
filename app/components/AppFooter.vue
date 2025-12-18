<template>
    <footer class="footer mt-5 border-top" aria-label="Zaad Footer">
        <div class="footer-bg pb-5">
            <div class="  container overflow-hidden">
                <div class="row justify-content-between gy-4">

                    <div class="col-md-2">
                        <NuxtLink href="/">
                            <NuxtImg width="134" height="113" src="/assets/images/logo/zaad-logo.svg" alt="Roya"
                                class="footer-logo" />

                        </NuxtLink>

                    </div>

                    <div class="col-md-10">
                        <div class="row justify-content-between">
                            <div class="col-6 col-md-2 mt-5">
                                <h5 class="mb-4">معلومات عنا</h5>
                                <ul class="list-unstyled">
                                    <li class="mb-3">
                                        <NuxtLink :href="$localePath('/')">{{ $t("links.home") }}</NuxtLink>
                                    </li>
                                    <li class="mb-3">
                                        <NuxtLink :href="$localePath('/about-us')">{{ $t("links.aboutUs") }}</NuxtLink>
                                    </li>
                                    <li class="mb-3">
                                        <NuxtLink :href="$localePath('/blog')">{{$t("links.blog")}}</NuxtLink>
                                    </li>
                                    <li class="mb-3">
                                        <NuxtLink :href="$localePath('/contact-us')">{{ $t("links.contactUs") }}</NuxtLink>
                                    </li>
                                </ul>
                            </div>

                            <div class="col-6 col-md-2 mt-5">
                                <h5 class="mb-4">روابط سريعة</h5>
                                <ul class="list-unstyled">
                                    <li class="mb-3">
                                        <NuxtLink :href="$localePath('terms-and-conditions')">{{$t("links.terms")}}</NuxtLink>
                                    </li>
                                    <li class="mb-3">
                                        <NuxtLink :href="$localePath('privacy-policy')">{{$t("links.privacyPolicy")}}</NuxtLink>
                                    </li>
                                    <li class="mb-3">
                                        <NuxtLink :href="$localePath('return-policy')">{{$t("links.returnPolicy")}}</NuxtLink>
                                    </li>
                                    <li class="mb-3">
                                        <NuxtLink :href="$localePath('faq')">{{$t("links.faq")}}</NuxtLink>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-6 col-md-4 mt-5">
                                <h5 class="mb-4">تحميل التطبيق</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <NuxtLink href="/" class="download">
                                            <NuxtImg width="20" height="20" src="/assets/images/google-play-store.svg"
                                                alt="Google Play" />
                                            <div class="d-flex flex-column ms-2">
                                                <span>{{ $t("footer.downloadApp") }}</span>
                                                <span>Google Play</span>
                                            </div>

                                        </NuxtLink>
                                    </div>
                                    <div class="col-md-6">
                                        <NuxtLink href="/" class="download">
                                            <NuxtImg width="20" height="20" src="/assets/images/apple.svg"
                                                alt="App Store" />
                                            <div class="d-flex flex-column ms-2">
                                                <span>{{ $t("footer.downloadApp") }}</span>
                                                <span>App Store</span>
                                            </div>

                                        </NuxtLink>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <NuxtImg width="112" height="112" src="/assets/images/qr.png"
                                            alt="Google Play" />
                                    </div>
                                    <div class="col-md-6">
                                        <NuxtImg width="112" height="112" src="/assets/images/qr.png"
                                            alt="Google Play" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 col-md-3 mt-5">
                                <h5 class="mb-4">تابعنا على السوشيل ميديا</h5>
                                <div class="d-flex gap-3">
                                    <NuxtLink href="/" class="social">
                                        <NuxtImg width="24" height="24" src="/assets/images/youtube.svg"
                                            alt="youtube" />
                                    </NuxtLink>
                                    <NuxtLink href="/" class="social">
                                        <NuxtImg width="24" height="24" src="/assets/images/in.svg" alt="linkedin" />
                                    </NuxtLink>
                                    <NuxtLink href="/" class="social">
                                        <NuxtImg width="24" height="24" src="/assets/images/insta.svg"
                                            alt="instagram" />
                                    </NuxtLink>
                                    <NuxtLink href="/" class="social">
                                        <NuxtImg width="24" height="24" src="/assets/images/x.svg" alt="x twitter" />
                                    </NuxtLink>
                                </div>
                                <div class="d-flex gap-2 mt-4">
                                    <NuxtImg width="20" height="20" src="/assets/images/telephone.svg"
                                        alt="telephone" />
                                    <span class="follow">+23243424234</span>
                                </div>
                                <div class="d-flex gap-2 mt-4">
                                    <NuxtImg width="20" height="20" src="/assets/images/message.svg" alt="email" />
                                    <span class="follow">Ibfo@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="footer-bottom py-3 border-top">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center gap-3">
                    <p class="m-0 text-center text-lg-start">جميع الحقوق محفوظة ل زاد عمان © {{ new Date().getFullYear()
                        }}.
                    </p>
                    <NuxtImg class="img-fluid" height="46" width="680" src="/assets/images/footer-bottom.png" alt="company" />
                </div>
            </div>
        </div>
    </footer>

</template>
<style lang="scss" scoped>
.border-top {
    border-top: 1px solid #CCCCCC;
    overflow: hidden;
    img {
        max-width: 100%;
    }
}
.footer-bg {
    background-color: #F7F7F7;

    ul li a {
        color: #4A4A4A;
        font-size: 14px;
        font-weight: 500;
        transition: var(--trans);

        &:hover {
            color: var(--main-color);
        }
    }

    h5 {
        font-size: 14px;
        font-weight: 700;
        color: #1E1E1E;
    }

    a.download {
        border: 1px solid #E2E2E2;
        border-radius: 8px;
        display: flex;
        transition: var(--trans);
        padding: 8px 10px;

        &:hover {
            background-color: #fff;
        }

        img {
            margin-top: 7px;
        }

        span {
            white-space: nowrap;
        }

        div {
            span:first-child {
                font-size: 10px;
                color: #464646;
            }

            span:last-child {
                font-size: 14px;
                color: #2B2932;
                font-weight: 500;
            }
        }
    }

    a.social {

        img {
            transition: var(--trans);

            &:hover {
                transform: translateY(-2px);
            }
        }
    }

    .follow {
        color: #717171;
        font-weight: 500;
    }

    .footer-bottom {
        p {
            color: #9A9A9A;
            font-size: 14px;
            font-weight: 500;
        }
    }
}
</style>