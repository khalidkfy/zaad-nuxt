<script setup lang="ts">
const { footerData, constants } = useConstants();

const getMenuLink = (item: any) => {
  let itemUrl = item?.url;

  switch (itemUrl) {
    case "pages/201":
      return "/terms-and-conditions";
      break;
    case "pages/202":
      return "/privacy-policy";
      break;
    case "pages/203":
      return "/return-policy";
      break;
    case "pages/204":
      return "/terms-and-conditions";
      break;
    case "faq":
      return "/faq";
      break;
    case "pages/200":
      return "/about-us";
      break;
    case "contact-us":
      return "/contact-us";
      break;
    case "blog":
      return "/blog";
      break;
    default:
      return "/";
      break;
  }
};
</script>
<template>
  <footer class="footer mt-5 border-top" aria-label="Zaad Footer">
    <div class="footer-bg pb-5">
      <div class="container overflow-hidden">
        <div class="row justify-content-between gy-4">
          <div class="col-md-2">
            <NuxtLink href="/">
              <NuxtImg
                width="134"
                height="113"
                src="/assets/images/logo/zaad-logo.svg"
                alt="Zaad"
                class="footer-logo"
              />
            </NuxtLink>
          </div>

          <div class="col-md-10">
            <div class="row justify-content-between">
              <template v-for="value in footerData?.resource?.items">
                <div v-if="value?.items?.length" class="col-6 col-md-2 mt-5">
                  <h5 class="mb-4">{{ value?.title }}</h5>
                  <ul class="list-unstyled">
                    <li v-for="(item, i) in value?.items" :key="i" class="mb-3">
                      <NuxtLink :href="$localePath(getMenuLink(item))">{{
                        item?.title
                      }}</NuxtLink>
                    </li>
                  </ul>
                </div>
              </template>

              <div class="col-6 col-md-4 mt-5">
                <h5 class="mb-4">{{ $t("footer.downloadApp") }}</h5>
                <div class="row">
                  <div class="col-md-6">
                    <NuxtLink href="/" class="download">
                      <NuxtImg
                        width="20"
                        height="20"
                        src="/assets/images/google-play-store.svg"
                        alt="Google Play"
                      />
                      <div class="d-flex flex-column ms-2">
                        <span>{{ $t("footer.downloadApp") }}</span>
                        <span>Google Play</span>
                      </div>
                    </NuxtLink>
                  </div>
                  <div class="col-md-6">
                    <NuxtLink href="/" class="download">
                      <NuxtImg
                        width="20"
                        height="20"
                        src="/assets/images/apple.svg"
                        alt="App Store"
                      />
                      <div class="d-flex flex-column ms-2">
                        <span>{{ $t("footer.downloadApp") }}</span>
                        <span>App Store</span>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-md-6">
                    <NuxtImg
                      width="112"
                      height="112"
                      src="/assets/images/qr.png"
                      alt="Google Play"
                    />
                  </div>
                  <div class="col-md-6">
                    <NuxtImg
                      width="112"
                      height="112"
                      src="/assets/images/qr.png"
                      alt="Google Play"
                    />
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-3 mt-5">
                <h5 class="mb-4">{{ $t("footer.followUs") }}</h5>
                <div class="d-flex gap-3">
                  <NuxtLink
                    v-if="constants?.resources?.social.youtube"
                    :href="constants?.resources?.social.youtube"
                    class="social"
                  >
                    <NuxtImg
                      width="24"
                      height="24"
                      src="/assets/images/youtube.svg"
                      alt="youtube"
                    />
                  </NuxtLink>
                  <NuxtLink
                    v-if="constants?.resources?.social.linkedin"
                    :href="constants?.resources?.social.linkedin"
                    class="social"
                  >
                    <NuxtImg
                      width="24"
                      height="24"
                      src="/assets/images/in.svg"
                      alt="linkedin"
                    />
                  </NuxtLink>
                  <NuxtLink
                    v-if="constants?.resources?.social.instagram"
                    :href="constants?.resources?.social.instagram"
                    class="social"
                  >
                    <NuxtImg
                      width="24"
                      height="24"
                      src="/assets/images/insta.svg"
                      alt="instagram"
                    />
                  </NuxtLink>
                  <NuxtLink
                    v-if="constants?.resources?.social.twitter"
                    :href="constants?.resources?.social.twitter"
                    class="social"
                  >
                    <NuxtImg
                      width="24"
                      height="24"
                      src="/assets/images/x.svg"
                      alt="x twitter"
                    />
                  </NuxtLink>
                  <!-- TODO Facebook icon -->
                </div>
                <div
                  v-if="constants?.resources?.contacts?.hotline"
                  class="d-flex gap-2 mt-4"
                >
                  <NuxtImg
                    width="20"
                    height="20"
                    src="/assets/images/telephone.svg"
                    alt="telephone"
                  />
                  <span class="follow">{{
                    constants?.resources?.contacts?.hotline
                  }}</span>
                </div>
                <div
                  v-if="constants?.resources?.contacts?.email"
                  class="d-flex gap-2 mt-4"
                >
                  <NuxtImg
                    width="20"
                    height="20"
                    src="/assets/images/message.svg"
                    alt="email"
                  />
                  <span class="follow">{{
                    constants?.resources?.contacts?.email
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom py-3 border-top">
      <div class="container">
        <div class="footer-bottom-content">
          <p class="m-0 text-center text-lg-start">
            جميع الحقوق محفوظة ل زاد عمان © {{ new Date().getFullYear() }}.
          </p>
          <NuxtImg
            class="img-fluid"
            height="46"
            width="680"
            src="/assets/images/footer-bottom.png"
            alt="company"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  @media (max-width: 992px) {
   flex-direction: column;
  }
}
footer {
  @media (max-width: 992px) {
    margin-bottom: 70px;
  }
}
.border-top {
  border-top: 1px solid #cccccc;
  overflow: hidden;
  img {
    max-width: 100%;
  }
}
.footer-bg {
  background-color: #f7f7f7;

  ul li a {
    color: #4a4a4a;
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
    color: #1e1e1e;
  }

  a.download {
    border: 1px solid #e2e2e2;
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
        color: #2b2932;
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
    word-break: break-all;
  }

  .footer-bottom {
    p {
      color: #9a9a9a;
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
