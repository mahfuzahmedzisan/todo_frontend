import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

// Encryption key - in production, this should be from environment variables
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-key-here';

class EncryptedStorage {
  constructor() {
    this.storageType = 'cookie'; // Options: 'localStorage', 'sessionStorage', 'cookie'
  }

  // Encrypt data
  encrypt(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  // Decrypt data
  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  // Set encrypted data
  setItem(key, value, options = {}) {
    const encryptedValue = this.encrypt(value);
    if (!encryptedValue) return false;

    try {
      switch (this.storageType) {
        case 'localStorage':
          localStorage.setItem(key, encryptedValue);
          break;
        case 'sessionStorage':
          sessionStorage.setItem(key, encryptedValue);
          break;
        case 'cookie':
          Cookies.set(key, encryptedValue, {
            expires: options.expires || 7, // 7 days default
            secure: options.secure || false, // Set to true in production with HTTPS
            sameSite: options.sameSite || 'lax',
            httpOnly: false, // Can't be true for client-side access
            ...options
          });
          break;
        default:
          localStorage.setItem(key, encryptedValue);
      }
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  // Get and decrypt data
  getItem(key) {
    try {
      let encryptedValue;

      switch (this.storageType) {
        case 'localStorage':
          encryptedValue = localStorage.getItem(key);
          break;
        case 'sessionStorage':
          encryptedValue = sessionStorage.getItem(key);
          break;
        case 'cookie':
          encryptedValue = Cookies.get(key);
          break;
        default:
          encryptedValue = localStorage.getItem(key);
      }

      if (!encryptedValue) return null;
      return this.decrypt(encryptedValue);
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  // Remove item
  removeItem(key) {
    try {
      switch (this.storageType) {
        case 'localStorage':
          localStorage.removeItem(key);
          break;
        case 'sessionStorage':
          sessionStorage.removeItem(key);
          break;
        case 'cookie':
          Cookies.remove(key);
          break;
        default:
          localStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  // Clear all auth related data
  clearAll() {
    const authKeys = ['auth_token', 'auth_user', 'refresh_token'];
    authKeys.forEach(key => this.removeItem(key));
  }

  // Set authentication token
  setToken(token, options = {}) {
    return this.setItem('auth_token', token, {
      expires: 7, // 7 days
      secure: window.location.protocol === 'https:',
      ...options
    });
  }

  // Get authentication token
  getToken() {
    return this.getItem('auth_token');
  }

  // Set user data
  setUser(user, options = {}) {
    return this.setItem('auth_user', user, {
      expires: 7, // 7 days
      secure: window.location.protocol === 'https:',
      ...options
    });
  }

  // Get user data
  getUser() {
    return this.getItem('auth_user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Set storage type
  setStorageType(type) {
    if (['localStorage', 'sessionStorage', 'cookie'].includes(type)) {
      this.storageType = type;
    }
  }
}

// Alternative storage methods for different security levels
class MultiLayerStorage extends EncryptedStorage {
  constructor() {
    super();
    this.primaryStorage = 'cookie';
    this.backupStorage = 'localStorage';
  }

  // Store in multiple locations for redundancy
  setItem(key, value, options = {}) {
    const success1 = super.setItem(key, value, options);

    // Backup storage
    const originalType = this.storageType;
    this.storageType = this.backupStorage;
    const success2 = super.setItem(key + '_backup', value, options);
    this.storageType = originalType;

    return success1 || success2;
  }

  // Try primary first, then backup
  getItem(key) {
    let data = super.getItem(key);

    if (!data) {
      // Try backup storage
      const originalType = this.storageType;
      this.storageType = this.backupStorage;
      data = super.getItem(key + '_backup');
      this.storageType = originalType;
    }

    return data;
  }

  cleanupCorruptedData() {
    const authKeys = ['auth_token', 'auth_user', 'refresh_token'];
    authKeys.forEach(key => super.removeItem(key + '_backup'));
  }
}

// Export storage instance
export const encryptedStorage = new EncryptedStorage();
export const multiLayerStorage = new MultiLayerStorage();

// Utility functions
export const storageUtils = {
  // Persist data even after Ctrl+Shift+R (hard refresh)
  setupPersistence() {
    // Store critical auth data in multiple places
    const authData = {
      token: encryptedStorage.getToken(),
      user: encryptedStorage.getUser()
    };

    if (authData.token && authData.user) {
      // Store in cookies with longer expiration for persistence
      encryptedStorage.setToken(authData.token, { expires: 30 });
      encryptedStorage.setUser(authData.user, { expires: 30 });
    }
  },

  // Initialize storage on app start
  initStorage() {
    // Set secure cookies in production
    if (window.location.protocol === 'https:') {
      encryptedStorage.setStorageType('cookie');
    }

    // Setup persistence
    this.setupPersistence();

    // Listen for beforeunload to save data
    window.addEventListener('beforeunload', () => {
      this.setupPersistence();
    });
  },

  // Clear all storage (for logout)
  clearAllStorage() {
    encryptedStorage.clearAll();
    multiLayerStorage.clearAll();

    // Also clear backup keys
    ['auth_token_backup', 'auth_user_backup'].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      Cookies.remove(key);
    });
  }
};