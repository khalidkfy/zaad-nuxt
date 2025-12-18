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
                        <NuxtImg width="50" src="/assets/images/van.svg" alt="fast shipping" />
                        <p>تسجيل شركة شحن</p>
                        <NuxtLink href="/">تسجيل</NuxtLink>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="shipping-register seller">
                        <NuxtImg width="50" src="/assets/images/user-gear.svg" alt="fast shipping" />
                        <p>تسجيل كبائع</p>
                        <NuxtLink href="/">تسجيل</NuxtLink>
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
        color: #FFFFFFCF;
    }
}

.shipping-register {
    background-color: #F9F9F9;
    padding: 33px 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    border-radius: 16px;
    height: 250px;

    &.seller {
        background-color: #004A980D;
    }

    p {
        color: #4A4A4A;
        font-size: 20px;
        font-weight: 500;
    }

    a {
        border: 1px solid #D4D4D4;
        border-radius: 12px;
        color: #4A4A4A;
        padding: 10px 30px;
        transition: var(--trans);

        &:hover {
            background-color: #4A4A4A;
            color: #fff;
        }
    }
}
</style>