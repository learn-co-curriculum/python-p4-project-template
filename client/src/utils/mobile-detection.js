/**
 * Mobile Detection and Responsive Utilities
 * Detects device type and provides mobile-optimized functionality
 */

// Device detection utilities
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTablet = () => {
  return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
};

export const isDesktop = () => {
  return !isMobile() && !isTablet();
};

export const getScreenSize = () => {
  const width = window.innerWidth;
  if (width < 576) return 'xs';
  if (width < 768) return 'sm';
  if (width < 992) return 'md';
  if (width < 1200) return 'lg';
  return 'xl';
};

export const getTouchCapability = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Mobile-optimized component styles
export const getMobileStyles = () => ({
  container: {
    padding: isMobile() ? '10px' : '20px',
    maxWidth: '100%',
    margin: '0 auto'
  },
  
  card: {
    padding: isMobile() ? '15px' : '20px',
    margin: isMobile() ? '10px 0' : '15px 0',
    borderRadius: isMobile() ? '8px' : '12px',
    boxShadow: isMobile() ? '0 2px 4px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.1)'
  },
  
  button: {
    padding: isMobile() ? '12px 16px' : '10px 20px',
    fontSize: isMobile() ? '16px' : '14px',
    minHeight: isMobile() ? '44px' : 'auto', // Touch-friendly size
    borderRadius: '8px',
    cursor: 'pointer'
  },
  
  input: {
    padding: isMobile() ? '12px' : '8px 12px',
    fontSize: isMobile() ? '16px' : '14px', // Prevents zoom on iOS
    minHeight: isMobile() ? '44px' : 'auto',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '100%'
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: isMobile() ? '15px' : '20px'
  },
  
  flexContainer: {
    display: 'flex',
    flexDirection: isMobile() ? 'column' : 'row',
    gap: isMobile() ? '10px' : '15px',
    alignItems: isMobile() ? 'stretch' : 'center'
  }
});

// Responsive breakpoints
export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px'
};

// Mobile-specific event handlers
export const addTouchEvents = (element, handlers) => {
  if (!getTouchCapability()) return;
  
  let touchStartX = 0;
  let touchStartY = 0;
  
  element.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    if (handlers.onTouchStart) handlers.onTouchStart(e);
  });
  
  element.addEventListener('touchmove', (e) => {
    if (handlers.onTouchMove) handlers.onTouchMove(e);
  });
  
  element.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Detect swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50 && handlers.onSwipeRight) handlers.onSwipeRight(e);
      if (deltaX < -50 && handlers.onSwipeLeft) handlers.onSwipeLeft(e);
    } else {
      if (deltaY > 50 && handlers.onSwipeDown) handlers.onSwipeDown(e);
      if (deltaY < -50 && handlers.onSwipeUp) handlers.onSwipeUp(e);
    }
    
    if (handlers.onTouchEnd) handlers.onTouchEnd(e);
  });
};

// Viewport utilities
export const getViewportHeight = () => {
  return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
};

export const getViewportWidth = () => {
  return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
};

// Safe area utilities for mobile devices
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: style.getPropertyValue('--sat') || style.getPropertyValue('env(safe-area-inset-top)') || '0px',
    right: style.getPropertyValue('--sar') || style.getPropertyValue('env(safe-area-inset-right)') || '0px',
    bottom: style.getPropertyValue('--sab') || style.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
    left: style.getPropertyValue('--sal') || style.getPropertyValue('env(safe-area-inset-left)') || '0px'
  };
};

// Orientation detection
export const getOrientation = () => {
  if (screen.orientation) {
    return screen.orientation.angle === 0 || screen.orientation.angle === 180 ? 'portrait' : 'landscape';
  }
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

// Performance utilities for mobile
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Network detection for mobile optimization
export const getNetworkInfo = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  return null;
};

export const isSlowNetwork = () => {
  const network = getNetworkInfo();
  if (!network) return false;
  return network.effectiveType === 'slow-2g' || network.effectiveType === '2g' || network.saveData;
};

// Mobile-optimized image loading
export const createResponsiveImageSrc = (baseSrc, sizes = [320, 640, 1024, 1280]) => {
  const screenWidth = getViewportWidth();
  const devicePixelRatio = window.devicePixelRatio || 1;
  const targetWidth = screenWidth * devicePixelRatio;
  
  // Find the best size
  const bestSize = sizes.find(size => size >= targetWidth) || sizes[sizes.length - 1];
  
  return `${baseSrc}?w=${bestSize}&q=${isSlowNetwork() ? 60 : 80}`;
};

// Accessibility helpers for mobile
export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Mobile keyboard handling
export const handleVirtualKeyboard = () => {
  if (!isMobile()) return;
  
  let initialViewportHeight = getViewportHeight();
  
  const handleResize = debounce(() => {
    const currentHeight = getViewportHeight();
    const heightDifference = initialViewportHeight - currentHeight;
    
    // Keyboard is likely open if height decreased significantly
    const keyboardOpen = heightDifference > 150;
    
    document.body.classList.toggle('keyboard-open', keyboardOpen);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('keyboardToggle', {
      detail: { isOpen: keyboardOpen, heightDifference }
    }));
  }, 100);
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

// Touch-friendly component wrapper
export const withMobileOptimization = (Component) => {
  return function MobileOptimizedComponent(props) {
    const mobileStyles = getMobileStyles();
    
    return React.createElement(Component, {
      ...props,
      isMobile: isMobile(),
      isTablet: isTablet(),
      screenSize: getScreenSize(),
      mobileStyles,
      orientation: getOrientation()
    });
  };
};

export default {
  isMobile,
  isTablet,
  isDesktop,
  getScreenSize,
  getTouchCapability,
  getMobileStyles,
  addTouchEvents,
  getViewportHeight,
  getViewportWidth,
  getSafeAreaInsets,
  getOrientation,
  debounce,
  throttle,
  getNetworkInfo,
  isSlowNetwork,
  createResponsiveImageSrc,
  announceToScreenReader,
  handleVirtualKeyboard,
  withMobileOptimization
};
