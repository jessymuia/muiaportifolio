// Modern PWA Installation Manager with Floating Button
class ModernPWAInstallManager {
  constructor() {
    this.deferredPrompt = null;
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    this.isAndroid = /android/i.test(navigator.userAgent);
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone || 
                       document.referrer.includes('android-app://');
    
    this.installToast = null;
    this.isInitialized = false;
    
    // Initialize only when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  init() {
    // Check if DOM elements exist before proceeding
    if (!this.checkDOMElements()) {
      console.warn('⚠️ Some DOM elements not found, retrying in 500ms');
      setTimeout(() => {
        if (this.checkDOMElements()) {
          this.setupManagers();
        } else {
          console.error('❌ Required DOM elements not found after retry');
        }
      }, 500);
      return;
    }
    
    this.setupManagers();
  }
  
  checkDOMElements() {
    // Check for essential DOM elements
    const floatingBtn = document.getElementById('floatingInstallBtn');
    const installModal = document.getElementById('installModal');
    
    if (!floatingBtn || !installModal) {
      console.log('Missing DOM elements:', {
        floatingBtn: !!floatingBtn,
        installModal: !!installModal
      });
      return false;
    }
    
    return true;
  }
  
  setupManagers() {
    this.setupEventListeners();
    this.setupInstallPrompt();
    this.checkIfAlreadyInstalled();
    this.setupDeviceSwitcher();
    this.showAutoInstallPrompt();
    this.setupFloatingButton();
    this.isInitialized = true;
    
    console.log('✅ PWA Install Manager initialized successfully');
  }
  
  setupEventListeners() {
    // Floating install button
    const floatingBtn = document.getElementById('floatingInstallBtn');
    if (floatingBtn) {
      floatingBtn.addEventListener('click', () => {
        this.showInstallModal();
      });
    } else {
      console.warn('⚠️ Floating install button not found');
    }
    
    // Install Now button in modal
    const installNowBtn = document.getElementById('installNowBtn');
    if (installNowBtn) {
      installNowBtn.addEventListener('click', () => {
        this.triggerInstall();
      });
    }
    
    // Remind Later button in modal
    const remindLaterBtn = document.getElementById('remindLaterBtn');
    if (remindLaterBtn) {
      remindLaterBtn.addEventListener('click', () => {
        this.hideInstallModal();
        this.showToast('Reminder set! Will ask again later.', 'info', 3000);
        localStorage.setItem('installPromptDismissed', 'true');
      });
    }
    
    // Close modal
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        this.hideInstallModal();
      });
    }
    
    // Close modal on background click
    const installModal = document.getElementById('installModal');
    if (installModal) {
      installModal.addEventListener('click', (e) => {
        if (e.target.id === 'installModal') {
          this.hideInstallModal();
        }
      });
    }
  }
  
  setupFloatingButton() {
    // Hide floating button if app is already installed
    if (this.isStandalone) {
      this.hideFloatingButton();
      return;
    }
    
    // Add pulse animation to badge
    const badge = document.getElementById('installBadge');
    if (badge) {
      // Initial animation
      badge.style.animation = 'pulseBadge 2s infinite';
      
      // Refresh animation periodically to keep it smooth
      setInterval(() => {
        badge.style.animation = 'none';
        setTimeout(() => {
          badge.style.animation = 'pulseBadge 2s infinite';
        }, 10);
      }, 8000);
    }
  }
  
  hideFloatingButton() {
    const floatingBtn = document.getElementById('floatingInstallBtn');
    if (floatingBtn) {
      floatingBtn.style.display = 'none';
    }
    
    // Also hide the download nav link
    const downloadNav = document.querySelector('.download-app-nav');
    if (downloadNav) {
      downloadNav.style.display = 'none';
    }
  }
  
  setupDeviceSwitcher() {
    const deviceButtons = document.querySelectorAll('.device-btn');
    const instructions = document.querySelectorAll('.device-instructions');
    
    if (deviceButtons.length === 0 || instructions.length === 0) {
      console.warn('⚠️ Device switcher elements not found');
      return;
    }
    
    deviceButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        deviceButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Hide all instructions
        instructions.forEach(instruction => {
          instruction.classList.remove('active');
        });
        
        // Show selected instruction
        const device = button.getAttribute('data-device');
        const deviceInstruction = document.getElementById(`${device}Instructions`);
        if (deviceInstruction) {
          deviceInstruction.classList.add('active');
          
          // Update Install Now button based on device
          this.updateInstallButton(device);
        }
      });
    });
    
    // Set default device
    const defaultDevice = this.isIOS ? 'ios' : this.isAndroid ? 'android' : 'desktop';
    const defaultBtn = document.querySelector(`.device-btn[data-device="${defaultDevice}"]`);
    if (defaultBtn) {
      defaultBtn.click();
    }
  }
  
  updateInstallButton(device) {
    const installBtn = document.getElementById('installNowBtn');
    if (!installBtn) return;
    
    switch(device) {
      case 'ios':
        installBtn.innerHTML = '<i class="fas fa-share-square"></i> Open Share Menu';
        installBtn.onclick = () => {
          this.showToast('Tap the share button in Safari', 'info', 4000);
        };
        break;
      case 'desktop':
        installBtn.innerHTML = '<i class="fas fa-desktop"></i> Check Browser Menu';
        installBtn.onclick = () => {
          if (this.deferredPrompt) {
            this.triggerInstall();
          } else {
            this.showToast('Look for install icon in address bar', 'info', 4000);
          }
        };
        break;
      case 'android':
      default:
        installBtn.innerHTML = '<i class="fas fa-download"></i> Install Now';
        installBtn.onclick = () => this.triggerInstall();
    }
  }
  
  setupInstallPrompt() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      
      console.log('✅ PWA install prompt available');
      
      // Update floating button with excitement
      this.animateFloatingButton();
      
      // Show auto prompt after 3 seconds
      setTimeout(() => {
        if (!this.isStandalone && !localStorage.getItem('installPromptDismissed')) {
          this.showAutoInstallToast();
        }
      }, 3000);
    });
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA installed successfully');
      this.isStandalone = true;
      this.hideInstallModal();
      this.hideFloatingButton();
      this.showToast('App installed successfully! 🎉', 'success', 5000);
      localStorage.setItem('appInstalled', 'true');
    });
  }
  
  animateFloatingButton() {
    const floatingBtn = document.getElementById('floatingInstallBtn');
    if (floatingBtn) {
      // Add bounce animation
      floatingBtn.style.animation = 'floatAnimation 0.8s ease-in-out 3';
      
      // Change badge text
      const badge = document.getElementById('installBadge');
      if (badge) {
        badge.textContent = 'HOT';
        badge.style.background = '#FF5722';
        badge.style.color = 'white';
        
        // Reset after animation
        setTimeout(() => {
          badge.textContent = 'FREE';
          badge.style.background = 'white';
          badge.style.color = 'var(--skin-color)';
          floatingBtn.style.animation = 'floatAnimation 3s ease-in-out infinite';
        }, 2400);
      }
    }
  }
  
  showInstallModal() {
    const modal = document.getElementById('installModal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }
  
  hideInstallModal() {
    const modal = document.getElementById('installModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
  
  triggerInstall() {
    if (this.deferredPrompt) {
      // For Android/Desktop with install prompt
      this.deferredPrompt.prompt();
      
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ User accepted installation');
          this.showToast('Starting installation...', 'info', 2000);
        } else {
          console.log('❌ User declined installation');
          this.showToast('Installation cancelled', 'warning', 3000);
        }
        this.deferredPrompt = null;
      });
    } else if (this.isIOS) {
      // For iOS, show specific instructions
      this.showToast('Use Safari → Share → Add to Home Screen', 'info', 4000);
    } else {
      // For browsers without prompt
      this.showToast('Check browser menu for install option', 'info', 4000);
    }
  }
  
  showAutoInstallToast() {
    if (this.isStandalone || localStorage.getItem('installPromptDismissed')) {
      return;
    }
    
    // Create modern auto-install toast
    const toast = document.createElement('div');
    toast.className = 'install-toast info';
    toast.style.display = 'none';
    toast.innerHTML = `
      <div class="install-toast-content">
        <div class="install-toast-icon">
          <i class="fas fa-rocket"></i>
        </div>
        <div class="install-toast-text">
          <h4>Boost Your Experience! 🚀</h4>
          <p>Install this app for quick access and better performance</p>
        </div>
        <button class="install-toast-close">&times;</button>
      </div>
      <div class="install-toast-progress">
        <div class="install-toast-progress-bar"></div>
      </div>
    `;
    
    document.body.appendChild(toast);
    this.installToast = toast;
    
    // Show toast with slight delay
    setTimeout(() => {
      toast.style.display = 'block';
    }, 100);
    
    // Close button
    toast.querySelector('.install-toast-close').addEventListener('click', () => {
      this.hideToast();
      localStorage.setItem('installPromptDismissed', 'true');
    });
    
    // Install on click
    toast.addEventListener('click', (e) => {
      if (!e.target.closest('.install-toast-close')) {
        this.triggerInstall();
        this.hideToast();
      }
    });
    
    // Auto hide after 10 seconds
    setTimeout(() => {
      this.hideToast();
      localStorage.setItem('installPromptDismissed', 'true');
    }, 10000);
  }
  
  hideToast() {
    if (this.installToast) {
      this.installToast.style.animation = 'slideOutRight 0.5s ease forwards';
      setTimeout(() => {
        if (this.installToast && this.installToast.parentNode) {
          this.installToast.parentNode.removeChild(this.installToast);
          this.installToast = null;
        }
      }, 500);
    }
  }
  
  showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast if any
    if (this.installToast) {
      this.hideToast();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `install-toast ${type}`;
    toast.style.display = 'none';
    
    let icon = 'info-circle';
    switch(type) {
      case 'success': icon = 'check-circle'; break;
      case 'warning': icon = 'exclamation-triangle'; break;
      case 'info': 
      default: 
        icon = 'info-circle';
    }
    
    toast.innerHTML = `
      <div class="install-toast-content">
        <div class="install-toast-icon">
          <i class="fas fa-${icon}"></i>
        </div>
        <div class="install-toast-text">
          <p>${message}</p>
        </div>
        <button class="install-toast-close">&times;</button>
      </div>
      <div class="install-toast-progress">
        <div class="install-toast-progress-bar" style="animation-duration: ${duration/1000}s"></div>
      </div>
    `;
    
    document.body.appendChild(toast);
    this.installToast = toast;
    
    // Show toast with slight delay
    setTimeout(() => {
      toast.style.display = 'block';
    }, 100);
    
    // Close button
    toast.querySelector('.install-toast-close').addEventListener('click', () => {
      this.hideToast();
    });
    
    // Auto hide
    setTimeout(() => {
      this.hideToast();
    }, duration);
  }
  
  checkIfAlreadyInstalled() {
    if (this.isStandalone) {
      console.log('✅ App is already installed');
      this.hideFloatingButton();
    }
  }
  
  showAutoInstallPrompt() {
    // Show auto prompt on first visit after 8 seconds
    if (!localStorage.getItem('installPromptShown')) {
      setTimeout(() => {
        if (!this.isStandalone && this.isInitialized) {
          this.showAutoInstallToast();
          localStorage.setItem('installPromptShown', 'true');
        }
      }, 8000);
    }
  }
}

// Safe initialization with error handling
function initializePWAInstallManager() {
  try {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        try {
          window.pwaManager = new ModernPWAInstallManager();
        } catch (error) {
          console.error('❌ Failed to initialize PWA Manager:', error);
        }
      });
    } else {
      window.pwaManager = new ModernPWAInstallManager();
    }
    
    // Trigger via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('install') === 'true') {
      setTimeout(() => {
        if (window.pwaManager && window.pwaManager.showInstallModal) {
          window.pwaManager.showInstallModal();
        }
      }, 1500);
    }
  } catch (error) {
    console.error('❌ Error initializing PWA Install Manager:', error);
  }
}

// Start initialization after a short delay to ensure DOM is ready
setTimeout(initializePWAInstallManager, 100);

// Service Worker Registration with error handling
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.register('/sw-light.js')
        .then(registration => {
          console.log('✅ ServiceWorker registered');
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 New service worker found');
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New update available
                  if (window.pwaManager && window.pwaManager.showToast) {
                    window.pwaManager.showToast('New update available! Refreshing...', 'info', 3000);
                    setTimeout(() => location.reload(), 3000);
                  }
                }
              });
            }
          });
        })
        .catch(error => {
          console.log('❌ ServiceWorker registration failed:', error);
        });
    } catch (error) {
      console.log('❌ ServiceWorker registration error:', error);
    }
  });
}