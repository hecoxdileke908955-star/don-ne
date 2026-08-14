export interface AttributionData {
  sessionId: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
  landingPage: string;
  deviceType: 'MOBILE' | 'DESKTOP' | 'TABLET';
}

const STORAGE_KEY = 'don_ne_attribution';

export function parseAttributionClient(): AttributionData {
  if (typeof window === 'undefined') {
    return {
      sessionId: 'sess_server_fallback',
      utmSource: 'direct',
      utmMedium: 'none',
      utmCampaign: '',
      referrer: '',
      landingPage: '/',
      deviceType: 'DESKTOP'
    };
  }

  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (e) {
      // fallback to regenerating
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isTablet = /iPad|Tablet/i.test(navigator.userAgent);

  const attribution: AttributionData = {
    sessionId: 'sess_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    utmSource: urlParams.get('utm_source') || (document.referrer ? new URL(document.referrer).hostname : 'direct'),
    utmMedium: urlParams.get('utm_medium') || 'organic',
    utmCampaign: urlParams.get('utm_campaign') || '',
    referrer: document.referrer || '',
    landingPage: window.location.pathname + window.location.search,
    deviceType: isTablet ? 'TABLET' : isMobile ? 'MOBILE' : 'DESKTOP'
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch (err) {
    // storage restricted
  }
  return attribution;
}

export function trackClientEvent(eventName: string, meta: Record<string, any> = {}) {
  const attr = parseAttributionClient();
  const payload = {
    sessionId: attr.sessionId,
    eventName,
    pageUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
    meta: {
      ...meta,
      device: attr.deviceType,
      utmSource: attr.utmSource
    }
  };

  // Dispatch browser custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('don_ne_analytics', { detail: payload }));
    
    // Call server endpoint in background
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  }
}
