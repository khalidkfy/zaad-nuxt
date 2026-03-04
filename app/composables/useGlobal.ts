export const useGlobal = () => {
    const { locale } = useI18n();
    
    const joinTexts = (...texts: any[]) => texts.filter(Boolean).join(" - ");

    return {
        joinTexts
    };
};
