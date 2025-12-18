<template>
    <section aria-label="Best Stores" class="best-stores mt-5 pt-5">
        <div class="container">
            <div class="section-header">
                <h3>{{ $t("general.bestStores") }}</h3>
                <NuxtLink href="/">{{ $t("general.showMore") }}</NuxtLink>
            </div>
            <div class="types mt-2">
                <button type="button" class="me-2 active">متاجر المنتجات</button>
                <button type="button">متاجر الخدمات</button>
            </div>
            <div class="groups mt-4" aria-label="store groups">
                <div class="row">
                    <div class="col-md-4 mb-2">
                        <div class="group">
                            <div class="section-header">
                                <h3>الإلكترونيات</h3>
                                <NuxtLink href="/">{{ $t("general.showMore") }}</NuxtLink>
                            </div>
                            <div class="stores mt-3">
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                     <div class="col-md-4 mb-2">
                        <div class="group">
                            <div class="section-header">
                                <h3>الإلكترونيات</h3>
                                <NuxtLink href="/">{{ $t("general.showMore") }}</NuxtLink>
                            </div>
                            <div class="stores mt-3">
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                     <div class="col-md-4 mb-2">
                        <div class="group">
                            <div class="section-header">
                                <h3>الإلكترونيات</h3>
                                <NuxtLink href="/">{{ $t("general.showMore") }}</NuxtLink>
                            </div>
                            <div class="stores mt-3">
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                                <NuxtLink href="/" class="store">
                                    <NuxtImg width="65" height="65" src="/assets/images/hartna-store.png" />
                                    <span>حارتنا</span>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped lang="scss">
.types {
    button {
        border: 1px solid #D1D1D1;
        outline: none;
        background-color: transparent;
        padding: 8px;
        border-radius: 8px;
        color: #4A4A4A;
        transition: var(--trans);
        font-size: 14px;
        font-weight: 500;

        &:hover,
        &.active {
            color: var(--main-color);
            border: 1px solid var(--main-color);
        }
    }
}

.group {
    padding: 25px 18px;
    background-color: #F9F9F9;
    border-radius: 16px;

    h3 {
        font-size: 16px;
    }
}

.stores {
    display: flex;
    justify-content: space-around;

    .store {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        transition: var(--trans);
        span {
            color: #4A4A4A;
            font-size: 14px;
        }
        &:hover {
            transform: translateY(-2px);
            img {
                box-shadow: 0px 1px 9px 0 #00000040;
            }
        }

        img {
            transition: var(--trans);
            border-radius: 50%;
            transition: var(--trans);
        }
    }
}
</style>