// US commerce rules for the demo. In production these come from the platform
// (Shopify / Stripe Tax / TaxJar) — never hard-coded.

export const FREE_SHIPPING_THRESHOLD = 100;
export const RETURN_WINDOW_DAYS = 30;
export const REWARDS_POINTS_PER_DOLLAR = 1;

export interface ShippingMethod {
  id: string;
  label: string;
  carrier: string;
  days: [number, number];
  price: number;
}

export const shippingMethods: ShippingMethod[] = [
  { id: 'standard', label: 'Standard', carrier: 'USPS Ground Advantage', days: [3, 5], price: 6.95 },
  { id: 'express', label: 'Express', carrier: 'UPS 2nd Day Air', days: [2, 2], price: 14.95 },
  { id: 'overnight', label: 'Overnight', carrier: 'FedEx Priority Overnight', days: [1, 1], price: 29.95 },
];

export const shippingCost = (method: ShippingMethod, subtotal: number) =>
  method.id === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : method.price;

/** Business-day delivery window from today, e.g. "Mon, Oct 19 – Wed, Oct 21". */
export function deliveryWindow(days: [number, number], from = new Date()) {
  const add = (n: number) => {
    const d = new Date(from);
    let left = n;
    while (left > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) left--;
    }
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  const a = add(days[0]);
  const b = add(days[1]);
  return a === b ? a : `${a} – ${b}`;
}

// Approximate combined state + avg. local sales tax rates (demo only).
// Clothing is exempt in a few states (e.g. PA, NJ, MN) and under thresholds in NY/MA/RI.
export const states: { code: string; name: string; tax: number }[] = [
  ['AL', 'Alabama', 9.29], ['AK', 'Alaska', 1.82], ['AZ', 'Arizona', 8.38], ['AR', 'Arkansas', 9.45],
  ['CA', 'California', 8.85], ['CO', 'Colorado', 7.81], ['CT', 'Connecticut', 6.35], ['DE', 'Delaware', 0],
  ['DC', 'District of Columbia', 6.0], ['FL', 'Florida', 7.0], ['GA', 'Georgia', 7.38], ['HI', 'Hawaii', 4.5],
  ['ID', 'Idaho', 6.03], ['IL', 'Illinois', 8.89], ['IN', 'Indiana', 7.0], ['IA', 'Iowa', 6.94],
  ['KS', 'Kansas', 8.65], ['KY', 'Kentucky', 6.0], ['LA', 'Louisiana', 9.56], ['ME', 'Maine', 5.5],
  ['MD', 'Maryland', 6.0], ['MA', 'Massachusetts', 6.25], ['MI', 'Michigan', 6.0], ['MN', 'Minnesota', 0],
  ['MS', 'Mississippi', 7.06], ['MO', 'Missouri', 8.39], ['MT', 'Montana', 0], ['NE', 'Nebraska', 6.97],
  ['NV', 'Nevada', 8.24], ['NH', 'New Hampshire', 0], ['NJ', 'New Jersey', 0], ['NM', 'New Mexico', 7.62],
  ['NY', 'New York', 8.53], ['NC', 'North Carolina', 7.0], ['ND', 'North Dakota', 7.04], ['OH', 'Ohio', 7.24],
  ['OK', 'Oklahoma', 8.99], ['OR', 'Oregon', 0], ['PA', 'Pennsylvania', 0], ['RI', 'Rhode Island', 7.0],
  ['SC', 'South Carolina', 7.5], ['SD', 'South Dakota', 6.11], ['TN', 'Tennessee', 9.55], ['TX', 'Texas', 8.2],
  ['UT', 'Utah', 7.25], ['VT', 'Vermont', 6.36], ['VA', 'Virginia', 5.77], ['WA', 'Washington', 9.38],
  ['WV', 'West Virginia', 6.57], ['WI', 'Wisconsin', 5.7], ['WY', 'Wyoming', 5.44],
].map(([code, name, tax]) => ({ code: code as string, name: name as string, tax: tax as number }));

export const DEFAULT_TAX_RATE = 7.0;

export const taxRateFor = (code?: string) => states.find((s) => s.code === code)?.tax ?? DEFAULT_TAX_RATE;

export const promoCodes: Record<string, { label: string; percent?: number; freeShipping?: boolean }> = {
  NORBYS10: { label: '10% off your order', percent: 10 },
  WELCOME15: { label: '15% off first order', percent: 15 },
  FREESHIP: { label: 'Free shipping', freeShipping: true },
};

export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export const moneyShort = (n: number) => (Number.isInteger(n) ? `$${n}` : money(n));

export const sizeChart = {
  tops: {
    headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
    rows: [
      ['XS', '40', '26', '23'],
      ['S', '42', '27', '24'],
      ['M', '44', '28', '25'],
      ['L', '46', '29', '26'],
      ['XL', '48', '30', '27'],
      ['XXL', '50', '31', '28'],
    ],
  },
};
