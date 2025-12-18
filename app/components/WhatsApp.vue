<template>
    <NuxtLink href="/" class="float-contact" aria-label="WhatsApp contact">
        <NuxtImg width="24" height="24" src="/assets/images/whatsapp.svg" alt="whatsapp" />
    </NuxtLink>
</template>
<style scoped lang="scss">
.float-contact {
    position: fixed;
    background-color: #fff;
    bottom: 10%;
    // inset-inline-start:0;
    inset-inline-end: 44px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 0 1px 4px 0 #00000040;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--trans);

    &:hover {
        box-shadow: 0px 1px 9px 0 #00000040;
    }
}
</style>