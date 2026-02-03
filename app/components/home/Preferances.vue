<script setup lang="ts">

</script>
<template>
    <section class="preferances mt-5 pt-5" aria-label="Preferances Products">
       

    </section>
</template>
<style scoped lang="scss">
.preferances {
    .categs {
        display: flex;
        overflow-x: scroll;
        .categ:not(:last-child) {
            margin-inline-end: 10px;
        }

        .categ {
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

}
</style>
