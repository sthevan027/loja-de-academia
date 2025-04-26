// Configurações do PWA
const pwaConfig = {
  name: 'Ritmoalpha',
  shortName: 'PowerFit',
  description: 'Loja de roupas e acessórios fitness',
  themeColor: '#000000',
  backgroundColor: '#ffffff',
  display: 'standalone',
  orientation: 'portrait',
  startUrl: '/',
  scope: '/',
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png'
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png'
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png'
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png'
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png'
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png'
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ],
  screenshots: [
    {
      src: '/screenshots/home.png',
      sizes: '1280x720',
      type: 'image/png',
      label: 'Página inicial do Ritmoalpha'
    },
    {
      src: '/screenshots/product.png',
      sizes: '1280x720',
      type: 'image/png',
      label: 'Página de produto'
    },
    {
      src: '/screenshots/cart.png',
      sizes: '1280x720',
      type: 'image/png',
      label: 'Carrinho de compras'
    }
  ],
  features: [
    'geolocation',
    'notifications',
    'payment',
    'offline',
    'push',
    'share'
  ],
  shareTarget: {
    action: '/share',
    method: 'GET',
    params: {
      title: 'title',
      text: 'text',
      url: 'url'
    }
  },
  shortcuts: [
    {
      name: 'Novidades',
      short_name: 'Novidades',
      description: 'Veja as novidades',
      url: '/novidades',
      icons: [{ src: '/icons/novidades.png', sizes: '192x192' }]
    },
    {
      name: 'Carrinho',
      short_name: 'Carrinho',
      description: 'Seu carrinho de compras',
      url: '/carrinho',
      icons: [{ src: '/icons/carrinho.png', sizes: '192x192' }]
    }
  ]
};

// Configurações de cache
const cacheConfig = {
  name: 'powerfit-cache-v1',
  urls: [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/pwa-config.js',
    '/sw.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
  ]
};

// Configurações de notificações
const notificationConfig = {
  defaultIcon: '/icons/icon-192x192.png',
  defaultBadge: '/icons/icon-72x72.png',
  defaultVibrate: [100, 50, 100],
  defaultSound: '/sounds/notification.mp3'
};

// Configurações de pagamento
const paymentConfig = {
  supportedMethods: [
    'pix',
    'credit-card',
    'google-pay',
    'apple-pay'
  ],
  defaultCurrency: 'BRL',
  defaultCountry: 'BR'
};

// Exportar configurações
export { pwaConfig, cacheConfig, notificationConfig, paymentConfig }; 