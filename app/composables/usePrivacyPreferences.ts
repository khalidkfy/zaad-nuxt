import { ref } from 'vue'

interface PrivacyPreferences {
  id: number
  show_profile_picture: number
  show_mobile: number
  show_status: number
  show_email: number
  show_preferences: number
}

export const usePrivacyPreferences = () => {
  const preferences = ref<PrivacyPreferences | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const { locale } = useI18n();


  // Fetch privacy preferences
  const fetchPreferences = async () => {
    try {
      loading.value = true
      error.value = null
      
      const data = await $fetch('/api/profile/get-preferences', {
        headers: {
          Lang: locale.value
        }
      })

      if (data?.resources) {
        preferences.value = data.resources
      }
    } catch (err) {
      error.value = 'فشل في تحميل إعدادات الخصوصية'
      console.error('Error fetching preferences:', err)
    } finally {
      loading.value = false
    }
  }

  // Update single preference
  const updatePreference = async (key: keyof Omit<PrivacyPreferences, 'id'>, value: number) => {
    try {
      saving.value = true
      error.value = null
      successMessage.value = null
      
      // Convert boolean to 1/0 for API
      const numericValue = value ? 1 : 0
      
      const payload = { [key]: numericValue }
      
      const data = await $fetch('/api/profile/update-preferences', {
        method: 'POST',
        body: payload,
      
      })

      if (data?.resources) {
        preferences.value = data.resources
        successMessage.value = 'تم تحديث الإعداد بنجاح'
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage.value = null
        }, 3000)
      }
      
      return { success: true, data: data }
    } catch (err) {
      error.value = 'فشل في تحديث الإعداد'
      console.error('Error updating preference:', err)
      return { success: false, error: err }
    } finally {
      saving.value = false
    }
  }

  // Update all preferences at once
  const updateAllPreferences = async (newPreferences: PrivacyPreferences) => {
    try {
      saving.value = true
      error.value = null
      successMessage.value = null
      
      const { data } = await $fetch('/api/profile/update-preferences', {
        method: 'POST',
        body: newPreferences,
      })

      if (data?.resources) {
        preferences.value = data.resources
        successMessage.value = 'تم حفظ جميع الإعدادات بنجاح'
        
        setTimeout(() => {
          successMessage.value = null
        }, 3000)
      }
      
      return { success: true, data: data }
    } catch (err) {
      error.value = 'فشل في حفظ الإعدادات'
      console.error('Error updating all preferences:', err)
      return { success: false, error: err }
    } finally {
      saving.value = false
    }
  }

  // Reset to default (all off)
  const resetToDefault = async () => {
    const defaultPrefs: PrivacyPreferences = {
      id: preferences.value?.id || 0,
      show_profile_picture: 0,
      show_mobile: 0,
      show_status: 0,
      show_email: 0,
      show_preferences: 0
    }
    
    return await updateAllPreferences(defaultPrefs)
  }

  return {
    preferences,
    loading,
    saving,
    error,
    successMessage,
    fetchPreferences,
    updatePreference,
    updateAllPreferences,
    resetToDefault
  }
}