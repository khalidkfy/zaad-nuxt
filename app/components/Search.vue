<template>
    <div class="search-container">
        <form action="#">
            <input id="main-search" name="main-search" type="search" :placeholder="$t('search.whatLookingFor')">
            <button class="btn-zaad" type="submit">{{ $t("search.button") }}</button>
        </form>
    </div>

</template>
<style scoped lang="scss">
.search-container {
    font-size: 12px;
    border-radius: 8px;
    background-color: #F2F3F7;
    width: 530px;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-inline-end: 3px;
    padding-inline-start: 8px;
    margin: 0 40px;
    @media (max-width:1200px) and (min-width:992px) {
        margin: 0;
        width: auto;
    }
    @media (max-width:992px) {
        margin: 0;
        width: 100%;
    }

    form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        button {
            padding: 8px 17px;
        }
    }

    input {
        background-color: transparent;
        border: 0;
        width: 100%;

        &:focus-visible {
            outline: none;

        }

        &::placeholder {
            color: #8E90A7;
        }
    }
}
</style>