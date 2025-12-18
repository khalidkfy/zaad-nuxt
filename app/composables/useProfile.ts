export const useProfile = () => {
  const profileRes = useState("profile-res", () => []);
  const { locale } = useI18n();

  const getProfileLoading = ref(false);

  const profileData = computed(() => {
    if (!profileRes.value) return {};
    return profileRes?.value?.resource;
  });
  const getProfileRes = async () => {
    getProfileLoading.value = true;

    try {
      profileRes.value = await $fetch("/api/profile/get", {
        headers: {
          Lang: locale.value,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      getProfileLoading.value = false;
    }
  };
  return {
    getProfileRes,
    getProfileLoading,
    profileData
  };
};
