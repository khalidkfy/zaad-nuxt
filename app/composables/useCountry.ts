export const useCountry = () => {
    const countryRes = useState("countries-res", () => []);
    const getCountriesLoading = useState("countries-loading", () => true);

    const getCountriesRes = async () => {
        // if (countryRes.value) return
        getCountriesLoading.value = true;

        try {
            countryRes.value = await $fetch("/api/countries/get");
        } catch (error) {
            console.log(error);
        } finally {
            getCountriesLoading.value = false;
        }
    }
    return {
        getCountriesRes,
        getCountriesLoading,
        countryRes
    }
}