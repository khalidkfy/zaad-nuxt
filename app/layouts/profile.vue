<script setup lang="ts">
const { getCategs } = useCategs();

await getCategs();
const route = useRoute();
const breadcrumbs = route.meta.breadcrumbs;


const { getProfileRes, getProfileLoading, profileData } = useProfile();

onMounted(async () => {
    await getProfileRes();
    console.log(profileData.value);

})
</script>
<template>

    <AppHeader layout="app" />



    <main>

        <LazyWhatsApp />

        <section class="mt-3">
            <div class="container">
                <div class="breadcrumbs">
                    <NuxtLink :href="$localePath('index')">{{ $t("links.home") }}</NuxtLink>
                    <div>/</div>
                    <template v-for="(breadcrumb, i) in breadcrumbs">
                        <NuxtLink class="active" :href="$localePath(breadcrumb?.url)">
                            {{ $t(breadcrumb?.name) }}
                        </NuxtLink>
                        <div v-if="i + 1 != breadcrumbs.length">/</div>
                    </template>

                </div>
            </div>
        </section>
        <section class="mt-3">
            <div class="container">
                <div class="content">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="user-info-card">
                                <template v-if="!getProfileLoading">
                                    <div class="info text-center">
                                        <NuxtImg width="117" height="117" src="/assets/images/user.svg"
                                            :alt="profileData?.name" />
                                        <div class="name">{{ profileData?.name }}</div>
                                        <div class="id">#{{ profileData?.id }}</div>
                                    </div>
                                    <div class="contact">
                                        <div>
                                            <NuxtImg width="20" height="20" src="/assets/images/phone.svg"
                                                alt="phone" />
                                            <span dir="ltr">+{{ profileData?.mobile }}</span>
                                        </div>
                                        <div>
                                            <NuxtImg width="20" height="20" src="/assets/images/message.svg"
                                                alt="email" />
                                            <span dir="ltr">{{ profileData?.email }}</span>
                                        </div>
                                    </div>
                                    <hr class="my-5">
                                    <div class="address" v-for="(address, i) in profileData?.address" :key="i">
                                        <NuxtImg width="20" height="20" src="/assets/images/loca.svg" alt="location" />
                                        <div>
                                            <span>العنوان</span>
                                            <span>مصر - الشاهرة الجديده</span>
                                        </div>
                                    </div>
                                    <button class="add-address">اضافة عنوان جديد</button>

                                </template>
                                <template v-else>
                                    <div>
                                        <div class="info text-center">
                                            <div style="width:117px;height:117px" class="skeleton circular mx-auto">
                                            </div>
                                            <div class="skeleton my-3 name text"></div>
                                            <div class="skeleton id  text"></div>
                                        </div>
                                        <div class="contact">
                                            <div class="skeleton  text"></div>
                                        </div>
                                        <div class="skeleton  rectangular"></div>

                                    </div>
                                </template>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <slot></slot>

    <AppFooter />
</template>
<style lang="scss" scoped>
.skeleton {
    background-color: #d7d7d7;
}

.content {
    min-height: 500px;
}

.breadcrumbs {
    display: flex;

    a {
        font-size: 14px;
        color: #888888;
        transition: var(--trans);
        font-weight: 500;

        &:hover {
            color: #4A4A4A;
        }

        &:last-of-type {
            color: #4A4A4A;
            font-weight: 600;
        }
    }

    div {
        color: #888888;
        margin: 0 7px;
    }
}

.user-info-card {
    background-color: #F9F9F9;
    border-radius: 10px;
    padding: 40px;

    .name {
        font-weight: 500;
        font-size: 20px;
        margin-bottom: 12px;
    }

    .id {
        color: #888888;
        font-weight: 500;
    }

    .contact {
        display: flex;
        justify-content: space-around;
        margin-top: 25px;

        >div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            span {
                color: #717171;

            }
        }
    }

    .address {
        display: flex;
        gap: 15px;

        div {
            display: flex;
            flex-direction: column;
            color: #717171;
            font-weight: 500;

        }

    }

    button.add-address {
        width: 100%;
        border: 1px solid #CDCDCD;
        border-radius: 16px;
        padding: 14px;
        background-color: transparent;
        color: #4A4A4A;
        margin-top: 20px;
        font-weight: 700;
        transition: var(--trans);

        &:hover {
            background-color: #e2e2e2;
        }
    }
}
</style>