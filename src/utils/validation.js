// Input validation utilities
export const validators = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    },

    password: (password) => {
        // At least 8 characters only.
        const passwordRegex = /^.{8,}$/
        // // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
        return passwordRegex.test(password)
    },

    name: (name) => {
        return name && name.trim().length >= 2 && name.trim().length <= 50
    },

    required: (value) => {
        return value && value.toString().trim().length > 0
    },

    sanitizeInput: (input) => {
        if (typeof input !== "string") return input

        // Remove potentially dangerous characters
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<[^>]*>/g, "")
            .trim()
    },

    validateForm: (formData, rules) => {
        const errors = {}

        Object.keys(rules).forEach((field) => {
            const value = formData[field]
            const fieldRules = rules[field]

            fieldRules.forEach((rule) => {
                if (typeof rule === "function") {
                    if (!rule(value)) {
                        errors[field] = errors[field] || []
                        errors[field].push(`Invalid ${field}`)
                    }
                } else if (rule.validator && !rule.validator(value)) {
                    errors[field] = errors[field] || []
                    errors[field].push(rule.message || `Invalid ${field}`)
                }
            })
        })

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        }
    },
}
