export const useConstants = () => {
    const { locale } = useI18n();

    const constants = useState('app-constants', () => null)
    const getConstants = async () => {
        try {
            constants.value = await $fetch("/api/constants", {
                headers: {
                    Lang: locale.value,
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
        }
    }


    const footerData = useState('footer-constants', () => null)
    const getFooter = async () => {
        try {
            footerData.value = await $fetch("/api/menus-2", {
                headers: {
                    Lang: locale.value,
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
        }
    }
    return {
        getConstants,
        footerData,
        constants,
        getFooter

    };
};
