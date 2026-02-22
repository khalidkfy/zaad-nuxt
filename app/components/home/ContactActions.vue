<template>
  <section class="my-5 pt-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mb-3">
          <div class="contact">
            <h3>هيا نتعرف على بعضنا البعض</h3>
            <p>حدد لماذا تريد حسابك وانضم معنا سريعا وسعداء لذلك وبانتظاركك</p>
          </div>
        </div>
        <div class="col-lg-4 mb-3">
          <div class="shipping-register">
            <img
              loading="lazy"
              width="50"
              src="/assets/images/van.svg"
              alt="fast shipping"
            />
            <p>{{ $t("register.asShipping") }}</p>
            <NuxtLink href="https://api.zaad.om/carrier">{{
              $t("register.register")
            }}</NuxtLink>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="shipping-register seller">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="currentColor"
              class="bi bi-person-gear"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"
              />
            </svg>
            <p>{{ $t("register.asSeller") }}</p>
            <NuxtLink href="https://sellers.zaad.om/">{{
              $t("register.register")
            }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.contact {
  background-color: var(--main-color-2);
  padding: 33px 20px;
  display: flex;
  border-radius: 16px;
  height: 250px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    font-size: 32px;
    color: #fff;
  }

  p {
    color: #ffffffcf;
  }
}

.shipping-register {
  background-color: #f9f9f9;
  padding: 33px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-radius: 16px;
  height: 250px;

  &.seller {
    background-color: #004a980d;
  }

  p {
    color: #4a4a4a;
    font-size: 20px;
    font-weight: 500;
  }

  a {
    border: 1px solid #d4d4d4;
    border-radius: 12px;
    color: #4a4a4a;
    padding: 10px 30px;
    transition: var(--trans);

    &:hover {
      background-color: #4a4a4a;
      color: #fff;
    }
  }
}
</style>
