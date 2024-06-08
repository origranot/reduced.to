interface Limit {
  marketingText?: string;
  enabled: boolean;
  description?: string;
  value?: number;
}

export const FEATURES = {
  LINKS_COUNT: {
    tooltip: 'Number of new links you can create each month',
    displayName: 'Short Links',
  },
  TRACKED_CLICKS: {
    tooltip: 'Number of clicks that will be tracked in the dashboard',
    displayName: 'Tracked Clicks',
  },
  ANALYTICS: {
    tooltip: 'The number of days you can see analytics for your links',
    displayName: 'Analytics reports',
  },
  CLICK_COUNT: {
    tooltip: 'Number of redirects on your links, it will be unlimited for all plans',
    displayName: 'Link Clicks',
  },
  UTM_BUILDER: {
    displayName: 'UTM Builder',
    tooltip: 'Add UTM parameters to your links',
    apiGuard: /^utm_.*$/,
  },
  QR_CODES: {
    displayName: 'QR Code',
    tooltip: 'Generate QR codes for your links',
  },
  PASSWORD_PROTECTION: {
    displayName: 'Password Protection',
    tooltip: 'Protect your links with a password',
    apiGuard: 'password',
  },
  LINK_EXPIRATION: {
    displayName: 'Link Expiration',
    tooltip: 'Set an expiration date for your links',
    apiGuard: 'expirationTime',
  },
  CUSTOM_SHORT_KEY: {
    displayName: 'Custom Short Key',
    tooltip: 'Create custom short keys for your links',
    apiGuard: 'key',
  },
};
export type FeatureKey = keyof typeof FEATURES;
export interface Plan {
  DISPLAY_NAME: string;
  LEVEL: number;
  FEATURES: {
    [key in FeatureKey]: Limit;
  };
  MONTHLY_PRICE: number;
  YEARLY_PRICE: number;
  PADDLE_PLAN_ID?: string;
  PADDLE_YEARLY_PRICE_ID?: string;
  PADDLE_MONTHLY_PRICE_ID?: string;
}
const BASE_PLAN: Plan = {
  DISPLAY_NAME: 'Free',
  LEVEL: 1,
  FEATURES: {
    LINKS_COUNT: {
      marketingText: '5 new links/mo',
      description: '5/month',
      value: 5,
      enabled: true,
    },
    TRACKED_CLICKS: {
      marketingText: '250 tracked clicks/mo',
      description: '250/month',
      value: 250,
      enabled: true,
    },
    ANALYTICS: {
      description: '7 days analytics',
      marketingText: '7 days analytics',
      value: 7,
      enabled: true,
    },
    CLICK_COUNT: {
      marketingText: 'Unlimited link clicks',
      description: 'Unlimited',
      value: 1,
      enabled: true,
    },
    LINK_EXPIRATION: {
      enabled: false,
    },
    UTM_BUILDER: { enabled: true },
    PASSWORD_PROTECTION: { enabled: false },
    QR_CODES: { enabled: false },
    CUSTOM_SHORT_KEY: { enabled: false },
  },
  MONTHLY_PRICE: 0,
  YEARLY_PRICE: 0,
};

const PRO_PLAN: Plan = {
  DISPLAY_NAME: 'Pro',
  LEVEL: 2,
  FEATURES: {
    ...BASE_PLAN.FEATURES,
    LINKS_COUNT: {
      marketingText: '500 new links/mo',
      enabled: true,
      description: '500/month',
      value: 500,
    },
    TRACKED_CLICKS: {
      marketingText: '20,000 tracked clicks/mo',
      enabled: true,
      description: '20,000/month',
      value: 20000,
    },
    ANALYTICS: {
      marketingText: '30 days analytics',
      enabled: true,
      description: '30 days analytics',
      value: 30,
    },
    LINK_EXPIRATION: { enabled: true },
    PASSWORD_PROTECTION: { enabled: true },
    UTM_BUILDER: { enabled: true },
    QR_CODES: { enabled: true },
    CUSTOM_SHORT_KEY: { enabled: true },
  },
  MONTHLY_PRICE: 9,
  YEARLY_PRICE: 90,
  PADDLE_PLAN_ID: 'pro_01hzvm0mb71zk0905we6ar99p4',
  PADDLE_YEARLY_PRICE_ID: 'pri_01hzvm27c3qdgkrtkcsxkwy461',
  PADDLE_MONTHLY_PRICE_ID: 'pri_01hzvm1pbcy8zfeygzrt56vwmh',
};

const BUSINESS_PLAN: Plan = {
  DISPLAY_NAME: 'Business',
  LEVEL: 3,
  FEATURES: {
    ...PRO_PLAN.FEATURES,
    LINKS_COUNT: {
      marketingText: '2000 new links/mo',
      enabled: true,
      description: '2000/month',
      value: 2000,
    },
    TRACKED_CLICKS: {
      marketingText: '100,000 tracked clicks/mo',
      enabled: true,
      description: '100,000/month',
      value: 100000,
    },
    ANALYTICS: {
      marketingText: '1 year analytics',
      enabled: true,
      description: '1 year analytics',
      value: 365,
    },
  },
  MONTHLY_PRICE: 30,
  YEARLY_PRICE: 300,
  PADDLE_PLAN_ID: 'pro_01hzvm2etgk8fjb92ej6dgjrdc',
  PADDLE_YEARLY_PRICE_ID: 'pri_01hzvm39s39nh5m9mwg4dewxw5',
  PADDLE_MONTHLY_PRICE_ID: 'pri_01hzw1dg677v5f4nsbjc4djx6k',
};

export const PLAN_LEVELS: Record<string, Plan> = {
  FREE: BASE_PLAN,
  PRO: PRO_PLAN,
  BUSINESS: BUSINESS_PLAN,
};

export function getPlanByPaddleId(id: string): Plan | undefined {
  return Object.values(PLAN_LEVELS).find((plan) => plan.PADDLE_PLAN_ID == id);
}
