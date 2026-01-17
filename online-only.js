// Online-Only PWA Implementation - NO VISUAL INDICATOR
class OnlineOnlyPWA {
  constructor() {
    this.isOnline = navigator.onLine;
    this.deferredPrompt = null;
    
    this.init();
  }
  
  init() {
    this.setupNetworkDetection();
    this.checkInitialConnection();
  }
  
  setupNetworkDetection() {
    // Listen for network changes
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.hideOfflineWarning();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineWarning();
    });
    
    // Retry connection button
    document.getElementById('retryConnection')?.addEventListener('click', () => {
      this.checkConnection();
    });
  }
  
  showOfflineWarning() {
    const offlineWarning = document.getElementById('offlineWarning');
    if (offlineWarning) {
      offlineWarning.style.display = 'flex';
      this.disableInteractiveElements(true);
    }
  }
  
  hideOfflineWarning() {
    const offlineWarning = document.getElementById('offlineWarning');
    if (offlineWarning) {
      offlineWarning.style.display = 'none';
      this.disableInteractiveElements(false);
    }
  }
  
  disableInteractiveElements(disable) {
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
    interactiveElements.forEach(element => {
      if (element.id !== 'retryConnection') {
        if (disable) {
          element.setAttribute('disabled', 'true');
          element.style.opacity = '0.5';
          element.style.pointerEvents = 'none';
        } else {
          element.removeAttribute('disabled');
          element.style.opacity = '';
          element.style.pointerEvents = '';
        }
      }
    });
  }
  
  checkConnection() {
    this.showLoading(true);
    
    fetch('https://www.google.com/favicon.ico', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    })
    .then(() => {
      this.isOnline = true;
      this.hideOfflineWarning();
    })
    .catch(() => {
      this.isOnline = false;
      this.showOfflineWarning();
    })
    .finally(() => {
      this.showLoading(false);
    });
  }
  
  showLoading(show) {
    let spinner = document.querySelector('.loading-spinner');
    
    if (show && !spinner) {
      spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(spinner);
    }
    
    if (spinner) {
      spinner.style.display = show ? 'block' : 'none';
    }
  }
  
  checkInitialConnection() {
    if (!this.isOnline) {
      setTimeout(() => {
        this.showOfflineWarning();
      }, 1000);
    }
  }
  
  // Block offline access attempts
  blockOfflineAccess() {
    if (!this.isOnline) {
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
      }
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
          });
        });
      }
    }
  }
}

// Initialize Online-Only PWA
document.addEventListener('DOMContentLoaded', () => {
  const onlineApp = new OnlineOnlyPWA();
  
  // Block offline access
  onlineApp.blockOfflineAccess();
  
  // Prevent any caching
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
    });
  }
  
  // Clear any existing caches
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
});