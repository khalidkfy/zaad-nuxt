import { reactive, ref } from "vue";

type Rule = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: any) => boolean | string;
  message?: string;
};

export function useFormValidator<T extends Record<string, any>>(
  initialValues: T,
  rules: Record<keyof T, Rule[]>
) {
  const values = reactive({ ...initialValues });
  const errors = reactive<Record<string, string[]>>({});

  const validateField = (key: keyof T): boolean => {
    const fieldRules = rules[key] || [];
    const value = values[key];
    errors[key as string] = [];

    for (const rule of fieldRules) {
      if (rule.required && !value) {
        errors[key as string].push(rule.message || "This field is required.");
        continue;
      }
      if (rule.min && typeof value === "string" && value.length < rule.min) {
        errors[key as string].push(
          rule.message || `Minimum ${rule.min} characters.`
        );
        continue;
      }
      if (rule.max && typeof value === "string" && value.length > rule.max) {
        errors[key as string].push(
          rule.message || `Maximum ${rule.max} characters.`
        );
        continue;
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[key as string].push(rule.message || "Invalid format.");
        continue;
      }
      if (rule.validator) {
        const result = rule.validator(value);
        if (result !== true) {
          errors[key as string].push(
            typeof result === "string" ? result : rule.message || "Invalid."
          );
          continue;
        }
      }
    }

    return errors[key as string].length === 0;
  };

  const validateAll = (): boolean => {
    let isValid = true;
    for (const key in rules) {
      const valid = validateField(key as keyof T);
      if (!valid) isValid = false;
    }
    return isValid;
  };

  const reset = () => {
    for (const key in errors) {
      errors[key] = [];
    }
  };

  const hasErrors = computed(() =>
    Object.values(errors).some((arr) => arr?.length > 0)
  );

  return {
    values,
    errors,
    validateField,
    validateAll,
    reset,
    hasErrors,
  };
}
