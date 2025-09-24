// Secure local storage utilities
class SecureStorage {
  constructor() {
    this.prefix = "ecommerce_"
    this.encryptionKey = "your-encryption-key" // In production, use environment variable
  }

  // Simple encryption (in production, use a proper encryption library)
  encrypt(data) {
    try {
      return btoa(JSON.stringify(data))
    } catch (error) {
      console.error("Encryption failed:", error)
      return null
    }
  }

  // Simple decryption
  decrypt(encryptedData) {
    try {
      return JSON.parse(atob(encryptedData))
    } catch (error) {
      console.error("Decryption failed:", error)
      return null
    }
  }

  setItem(key, value) {
    try {
      const encryptedValue = this.encrypt(value)
      if (encryptedValue) {
        localStorage.setItem(this.prefix + key, encryptedValue)
        return true
      }
      return false
    } catch (error) {
      console.error("Storage set failed:", error)
      return false
    }
  }

  getItem(key) {
    try {
      const encryptedValue = localStorage.getItem(this.prefix + key)
      if (encryptedValue) {
        return this.decrypt(encryptedValue)
      }
      return null
    } catch (error) {
      console.error("Storage get failed:", error)
      return null
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(this.prefix + key)
      return true
    } catch (error) {
      console.error("Storage remove failed:", error)
      return false
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error("Storage clear failed:", error)
      return false
    }
  }
}

export const secureStorage = new SecureStorage()
