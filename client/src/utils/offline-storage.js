/**
 * Offline Storage Utilities for Kenyan Health App
 * Provides local data storage and synchronization capabilities
 */

// Storage keys for different data types
const STORAGE_KEYS = {
  GLUCOSE_READINGS: 'kenyan_health_glucose_readings',
  FOOD_LOG: 'kenyan_health_food_log',
  MEDICATIONS: 'kenyan_health_medications',
  EXERCISE_LOG: 'kenyan_health_exercise_log',
  USER_PREFERENCES: 'kenyan_health_user_preferences',
  OFFLINE_QUEUE: 'kenyan_health_offline_queue',
  LAST_SYNC: 'kenyan_health_last_sync',
  CACHED_FOODS: 'kenyan_health_cached_foods',
  CULTURAL_EVENTS: 'kenyan_health_cultural_events',
  COMMUNITY_TIPS: 'kenyan_health_community_tips'
};

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Check if IndexedDB is available
const isIndexedDBAvailable = () => {
  return 'indexedDB' in window;
};

// Local Storage wrapper with error handling
class LocalStorageManager {
  static set(key, value) {
    if (!isLocalStorageAvailable()) return false;
    
    try {
      const serializedValue = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: '1.0'
      });
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }
  
  static get(key) {
    if (!isLocalStorageAvailable()) return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
  
  static remove(key) {
    if (!isLocalStorageAvailable()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
  
  static clear() {
    if (!isLocalStorageAvailable()) return false;
    
    try {
      // Only clear our app's data
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
  
  static getStorageSize() {
    if (!isLocalStorageAvailable()) return 0;
    
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        total += item.length;
      }
    });
    return total;
  }
}

// IndexedDB wrapper for larger data storage
class IndexedDBManager {
  constructor() {
    this.dbName = 'KenyanHealthApp';
    this.version = 1;
    this.db = null;
  }
  
  async init() {
    if (!isIndexedDBAvailable()) {
      throw new Error('IndexedDB not available');
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('glucose_readings')) {
          const glucoseStore = db.createObjectStore('glucose_readings', { keyPath: 'id', autoIncrement: true });
          glucoseStore.createIndex('date', 'date', { unique: false });
          glucoseStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('food_logs')) {
          const foodStore = db.createObjectStore('food_logs', { keyPath: 'id', autoIncrement: true });
          foodStore.createIndex('date', 'date', { unique: false });
          foodStore.createIndex('meal_type', 'meal_type', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('exercise_logs')) {
          const exerciseStore = db.createObjectStore('exercise_logs', { keyPath: 'id', autoIncrement: true });
          exerciseStore.createIndex('date', 'date', { unique: false });
          exerciseStore.createIndex('type', 'type', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('offline_queue')) {
          db.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }
  
  async add(storeName, data) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add({
        ...data,
        timestamp: Date.now(),
        synced: false
      });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  async getAll(storeName) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  async getByDate(storeName, date) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index('date');
      const request = index.getAll(date);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  async update(storeName, data) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  async delete(storeName, id) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

// Main offline storage class
class OfflineStorage {
  constructor() {
    this.indexedDB = new IndexedDBManager();
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncWhenOnline();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  // Save glucose reading
  async saveGlucoseReading(reading) {
    const data = {
      value: reading.value,
      date: reading.date,
      time: reading.time,
      notes: reading.notes || '',
      meal_context: reading.meal_context || '',
      created_at: new Date().toISOString()
    };
    
    try {
      await this.indexedDB.add('glucose_readings', data);
      
      if (this.isOnline) {
        this.queueForSync('glucose_reading', data);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving glucose reading:', error);
      return false;
    }
  }
  
  // Save food log entry
  async saveFoodLog(foodEntry) {
    const data = {
      food_name: foodEntry.food_name,
      food_name_swahili: foodEntry.food_name_swahili || '',
      portion_size: foodEntry.portion_size,
      meal_type: foodEntry.meal_type, // breakfast, lunch, dinner, snack
      date: foodEntry.date,
      time: foodEntry.time,
      calories: foodEntry.calories || 0,
      carbs: foodEntry.carbs || 0,
      created_at: new Date().toISOString()
    };
    
    try {
      await this.indexedDB.add('food_logs', data);
      
      if (this.isOnline) {
        this.queueForSync('food_log', data);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving food log:', error);
      return false;
    }
  }
  
  // Save exercise log
  async saveExerciseLog(exercise) {
    const data = {
      type: exercise.type,
      duration_minutes: exercise.duration_minutes,
      intensity: exercise.intensity, // low, moderate, high
      date: exercise.date,
      time: exercise.time,
      notes: exercise.notes || '',
      created_at: new Date().toISOString()
    };
    
    try {
      await this.indexedDB.add('exercise_logs', data);
      
      if (this.isOnline) {
        this.queueForSync('exercise_log', data);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving exercise log:', error);
      return false;
    }
  }
  
  // Get glucose readings
  async getGlucoseReadings(date = null) {
    try {
      if (date) {
        return await this.indexedDB.getByDate('glucose_readings', date);
      } else {
        return await this.indexedDB.getAll('glucose_readings');
      }
    } catch (error) {
      console.error('Error getting glucose readings:', error);
      return [];
    }
  }
  
  // Get food logs
  async getFoodLogs(date = null) {
    try {
      if (date) {
        return await this.indexedDB.getByDate('food_logs', date);
      } else {
        return await this.indexedDB.getAll('food_logs');
      }
    } catch (error) {
      console.error('Error getting food logs:', error);
      return [];
    }
  }
  
  // Get exercise logs
  async getExerciseLogs(date = null) {
    try {
      if (date) {
        return await this.indexedDB.getByDate('exercise_logs', date);
      } else {
        return await this.indexedDB.getAll('exercise_logs');
      }
    } catch (error) {
      console.error('Error getting exercise logs:', error);
      return [];
    }
  }
  
  // Cache Kenyan foods data
  cacheKenyanFoods(foods) {
    return LocalStorageManager.set(STORAGE_KEYS.CACHED_FOODS, {
      foods,
      cached_at: new Date().toISOString()
    });
  }
  
  // Get cached Kenyan foods
  getCachedKenyanFoods() {
    const cached = LocalStorageManager.get(STORAGE_KEYS.CACHED_FOODS);
    if (!cached) return null;
    
    // Check if cache is older than 24 hours
    const cacheAge = Date.now() - new Date(cached.cached_at).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (cacheAge > maxAge) {
      LocalStorageManager.remove(STORAGE_KEYS.CACHED_FOODS);
      return null;
    }
    
    return cached.foods;
  }
  
  // Save user preferences
  saveUserPreferences(preferences) {
    return LocalStorageManager.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }
  
  // Get user preferences
  getUserPreferences() {
    return LocalStorageManager.get(STORAGE_KEYS.USER_PREFERENCES) || {
      language: 'english',
      units: 'metric',
      notifications: true,
      theme: 'light'
    };
  }
  
  // Queue data for sync when online
  async queueForSync(type, data) {
    try {
      await this.indexedDB.add('offline_queue', {
        type,
        data,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error queuing for sync:', error);
    }
  }
  
  // Sync queued data when online
  async syncWhenOnline() {
    if (!this.isOnline || this.syncInProgress) return;
    
    this.syncInProgress = true;
    
    try {
      const queuedItems = await this.indexedDB.getAll('offline_queue');
      
      for (const item of queuedItems) {
        try {
          // Simulate API call - replace with actual API endpoints
          await this.syncToServer(item.type, item.data);
          
          // Remove from queue after successful sync
          await this.indexedDB.delete('offline_queue', item.id);
        } catch (error) {
          console.error('Error syncing item:', error);
          // Keep in queue for retry
        }
      }
      
      // Update last sync timestamp
      LocalStorageManager.set(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }
  
  // Simulate server sync - replace with actual API calls
  async syncToServer(type, data) {
    // This would be replaced with actual API endpoints
    const endpoints = {
      glucose_reading: '/api/glucose-readings',
      food_log: '/api/food-logs',
      exercise_log: '/api/exercise-logs'
    };
    
    const endpoint = endpoints[type];
    if (!endpoint) throw new Error(`Unknown sync type: ${type}`);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Synced ${type} to server:`, data);
        resolve();
      }, 1000);
    });
  }
  
  // Get storage statistics
  async getStorageStats() {
    const stats = {
      localStorage: {
        used: LocalStorageManager.getStorageSize(),
        available: isLocalStorageAvailable()
      },
      indexedDB: {
        available: isIndexedDBAvailable(),
        glucose_readings: 0,
        food_logs: 0,
        exercise_logs: 0,
        offline_queue: 0
      },
      lastSync: LocalStorageManager.get(STORAGE_KEYS.LAST_SYNC)
    };
    
    if (isIndexedDBAvailable()) {
      try {
        stats.indexedDB.glucose_readings = (await this.getGlucoseReadings()).length;
        stats.indexedDB.food_logs = (await this.getFoodLogs()).length;
        stats.indexedDB.exercise_logs = (await this.getExerciseLogs()).length;
        stats.indexedDB.offline_queue = (await this.indexedDB.getAll('offline_queue')).length;
      } catch (error) {
        console.error('Error getting storage stats:', error);
      }
    }
    
    return stats;
  }
  
  // Clear all offline data
  async clearAllData() {
    try {
      LocalStorageManager.clear();
      
      if (this.indexedDB.db) {
        const stores = ['glucose_readings', 'food_logs', 'exercise_logs', 'offline_queue'];
        for (const store of stores) {
          const transaction = this.indexedDB.db.transaction([store], 'readwrite');
          const objectStore = transaction.objectStore(store);
          await objectStore.clear();
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

// Export singleton instance
const offlineStorage = new OfflineStorage();

export default offlineStorage;

// Export individual components for testing
export {
  LocalStorageManager,
  IndexedDBManager,
  OfflineStorage,
  STORAGE_KEYS,
  isLocalStorageAvailable,
  isIndexedDBAvailable
};
