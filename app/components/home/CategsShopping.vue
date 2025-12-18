<script setup lang="ts">
const { productsCategs: categs } = useCategs();
</script>
<template>
    <section class="mt-5 pt-5" aria-label="shopping by categ Section">
        <div class="container">
            <div aria-label="Categories" aria-hidden="false" class="categs-shopping">
                <div class="section-header">
                    <h3>{{ $t("general.shopByCateg") }}</h3>
                    <NuxtLink href="/">{{ $t("general.showMore") }}</NuxtLink>
                </div>
                <div class="categs">
                    <NuxtLink href="/" v-for="categ in categs" :key="categ.id">
                        <!-- <div class="img">
                            <NuxtImg width="40" height="30" :src="categ.img" :alt="categ.name" />
                        </div> -->

                        <span> {{ categ.name }}</span>
                    </NuxtLink>
                    
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped lang="scss">
.categs-shopping {
    background-color: #004A980D;
    border-radius: 16px;
    padding: 20px;

    .categs {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 2px 15px;
        align-items: center;
        width: calc(50% - var(--gap));
        padding: 6px 8px;

        margin-top: 20px;

        a {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            margin-bottom: 18px;
            &:hover {
                .img {
                    box-shadow: 0px 1px 9px 0 #00000040;
                }
            }

            .img {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                background-color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--trans);

            }

            span {
                color: #4A4A4A;
                font-size: 14px;
                font-weight: 500;
                padding-top: 9px;
            }
        }
    }
}
</style>