export class SessionStorageManager {
  setItem(key, value) {
      try {
          const valueToStore = JSON.stringify(value);
          sessionStorage.setItem(key, valueToStore);
      } catch (error) {
          console.error('Fail to save sessionStorage:', error);
      }
  }

  getItem(key) {
      try {
          const storedValue = sessionStorage.getItem(key);
          return storedValue ? JSON.parse(storedValue) : null;
      } catch (error) {
          console.error('Fail to get sessionStorage:', error);
          return null;
      }
  }

  removeItem(key) {
      try {
          sessionStorage.removeItem(key);
      } catch (error) {
          console.error('Fail in remove sessionStorage:', error);
      }
  }

  clear() {
      try {
          sessionStorage.clear();
      } catch (error) {
          console.error('Fail to clean all sessionStorage:', error);
      }
  }
}
