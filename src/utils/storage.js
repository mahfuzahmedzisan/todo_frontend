// utils/storage.js - Fixed version
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

  // Simple decryption with better error handling
  decrypt(encryptedData) {
    try {
      // Check if encryptedData is valid - handle both actual values and string representations
      if (!encryptedData || 
          encryptedData === 'undefined' || 
          encryptedData === 'null' || 
          encryptedData === undefined || 
          encryptedData === null ||
          typeof encryptedData !== 'string' ||
          encryptedData.trim() === '') {
        return null
      }
      
      // Additional check for base64 validity
      const decoded = atob(encryptedData)
      if (!decoded || decoded === 'undefined' || decoded === 'null') {
        return null
      }
      
      return JSON.parse(decoded)
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
      
      // Return null if no value exists or value is invalid
      if (!encryptedValue || 
          encryptedValue === 'undefined' || 
          encryptedValue === 'null' || 
          encryptedValue === undefined || 
          encryptedValue === null ||
          typeof encryptedValue !== 'string' ||
          encryptedValue.trim() === '') {
        return null
      }
      
      return this.decrypt(encryptedValue)
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

  // Helper method to check if token exists
  hasToken() {
    const token = this.getItem('auth_token')
    // console.log('hasToken check:', { token, hasToken: token !== null && token !== undefined && token !== '' })
    return token !== null && token !== undefined && token !== ''
  }

  // Method to clean up corrupted storage
  cleanupCorruptedData() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key)
          if (value === 'undefined' || value === 'null' || value === '' || value === null) {
            localStorage.removeItem(key)
            console.log(`Removed corrupted storage key: ${key}`)
          }
        }
      })
    } catch (error) {
      console.error("Cleanup failed:", error)
    }
  }
}

export const secureStorage = new SecureStorage()