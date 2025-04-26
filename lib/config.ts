export const config = {
  // Configurações de Pagamento
  payment: {
    gateways: {
      mercadopago: {
        publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      },
      pagseguro: {
        email: process.env.PAGSEGURO_EMAIL,
        token: process.env.PAGSEGURO_TOKEN,
      },
      picpay: {
        token: process.env.PICPAY_TOKEN,
        sellerToken: process.env.PICPAY_SELLER_TOKEN,
      },
      pagbank: {
        clientId: process.env.PAGBANK_CLIENT_ID,
        clientSecret: process.env.PAGBANK_CLIENT_SECRET,
      },
    },
  },

  // Configurações de Logística
  shipping: {
    providers: {
      correios: {
        cepOrigem: process.env.CORREIOS_CEP_ORIGEM,
        contrato: process.env.CORREIOS_CONTRATO,
        senha: process.env.CORREIOS_SENHA,
      },
      mercadoenvios: {
        accessToken: process.env.MERCADOENVIOS_ACCESS_TOKEN,
      },
      loggi: {
        apiKey: process.env.LOGGI_API_KEY,
      },
    },
  },

  // Configurações de Marketing
  marketing: {
    email: {
      provider: process.env.EMAIL_PROVIDER,
      apiKey: process.env.EMAIL_API_KEY,
      from: process.env.EMAIL_FROM,
    },
    social: {
      facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
      },
      instagram: {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
      },
    },
    analytics: {
      google: process.env.GOOGLE_ANALYTICS_ID,
      facebook: process.env.FACEBOOK_PIXEL_ID,
    },
  },

  // Configurações de Segurança
  security: {
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
  },

  // Configurações de Armazenamento
  storage: {
    provider: process.env.STORAGE_PROVIDER,
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET,
    },
  },

  // Configurações de Notificações
  notifications: {
    email: {
      enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true',
      templateDir: process.env.EMAIL_TEMPLATE_DIR,
    },
    push: {
      enabled: process.env.PUSH_NOTIFICATIONS_ENABLED === 'true',
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    },
    sms: {
      enabled: process.env.SMS_NOTIFICATIONS_ENABLED === 'true',
      provider: process.env.SMS_PROVIDER,
      apiKey: process.env.SMS_API_KEY,
    },
  },

  // Configurações de Integração
  integrations: {
    erp: {
      enabled: process.env.ERP_INTEGRATION_ENABLED === 'true',
      apiKey: process.env.ERP_API_KEY,
      endpoint: process.env.ERP_ENDPOINT,
    },
    crm: {
      enabled: process.env.CRM_INTEGRATION_ENABLED === 'true',
      apiKey: process.env.CRM_API_KEY,
      endpoint: process.env.CRM_ENDPOINT,
    },
    wearables: {
      enabled: process.env.WEARABLES_INTEGRATION_ENABLED === 'true',
      providers: {
        fitbit: {
          clientId: process.env.FITBIT_CLIENT_ID,
          clientSecret: process.env.FITBIT_CLIENT_SECRET,
        },
        garmin: {
          consumerKey: process.env.GARMIN_CONSUMER_KEY,
          consumerSecret: process.env.GARMIN_CONSUMER_SECRET,
        },
      },
    },
  },

  // Configurações de Performance
  performance: {
    cache: {
      enabled: process.env.CACHE_ENABLED === 'true',
      ttl: parseInt(process.env.CACHE_TTL || '3600'),
    },
    cdn: {
      enabled: process.env.CDN_ENABLED === 'true',
      domain: process.env.CDN_DOMAIN,
    },
  },

  // Configurações de Suporte
  support: {
    chat: {
      enabled: process.env.CHAT_ENABLED === 'true',
      provider: process.env.CHAT_PROVIDER,
      apiKey: process.env.CHAT_API_KEY,
    },
    ticket: {
      enabled: process.env.TICKET_SYSTEM_ENABLED === 'true',
      provider: process.env.TICKET_PROVIDER,
      apiKey: process.env.TICKET_API_KEY,
    },
  },
}; 