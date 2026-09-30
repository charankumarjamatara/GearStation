/**
 * Detects if the current client is a mobile / handheld phone-calling device.
 * Uses a combination of User Agent testing, Client Hints, and touch capabilities.
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';

  // 1. User Agent inspection (primary for mobile OS detection: iOS, Android, etc.)
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS/i;
  if (mobileRegex.test(ua)) {
    return true;
  }

  // 2. Modern Client Hints API
  const navAny = navigator as unknown as { userAgentData?: { mobile?: boolean } };
  if (navAny.userAgentData?.mobile !== undefined && navAny.userAgentData.mobile) {
    return true;
  }

  // 3. Touch + viewport dimension check (e.g. iPadOS masquerading as Mac)
  const isTouch = (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) || 'ontouchstart' in window;
  const isSmallViewport = typeof window !== 'undefined' && window.innerWidth <= 1024;
  if (isTouch && isSmallViewport) {
    if (!/Windows NT/i.test(ua)) {
      return true;
    }
  }

  return false;
};

/**
 * Copies text to clipboard with fallback for older browsers or restricted environments.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Navigator clipboard failed, attempting fallback...', err);
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
};
