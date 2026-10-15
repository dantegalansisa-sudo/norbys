import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';
import Sheet from '../components/Sheet';
import { AppleGlyph } from '../components/Layout';
import { IconBack, IconCheck, IconDown, IconLock, IconShield, IconTag, IconTruck } from '../components/Icons';
import { useShop, type Order } from '../store/ShopContext';
import {
  deliveryWindow, money, promoCodes, shippingCost, shippingMethods, states, taxRateFor, REWARDS_POINTS_PER_DOLLAR,
} from '../data/commerce';
import { EASE } from '../components/Motion';

type Step = 1 | 2 | 3;

interface Info {
  email: string;
  newsOptIn: boolean;
  smsOptIn: boolean;
  first: string;
  last: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

const emptyInfo: Info = { email: '', newsOptIn: true, smsOptIn: false, first: '', last: '', address1: '', address2: '', city: '', state: '', zip: '', phone: '' };

// Fictional customer for presenting the demo quickly
const demoInfo: Info = {
  email: 'alex.rivera@example.com', newsOptIn: true, smsOptIn: false, first: 'Alex', last: 'Rivera', address1: '350 5th Ave', address2: 'Apt 12B', city: 'New York', state: 'NY', zip: '10118', phone: '(212) 555-0147',
};

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};
const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExp = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};
const cardBrand = (n: string) => {
  const d = n.replace(/\D/g, '');
  if (/^4/.test(d)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
  if (/^3[47]/.test(d)) return 'Amex';
  if (/^6(011|5)/.test(d)) return 'Discover';
  return '';
};
const luhn = (n: string) => {
  const d = n.replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let x = +d[d.length - 1 - i];
    if (i % 2) {
      x *= 2;
      if (x > 9) x -= 9;
    }
    sum += x;
  }
  return d.length >= 15 && sum % 10 === 0;
};

function Field({
  label, value, onChange, error, type = 'text', autoComplete, inputMode, half = false, placeholder, maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'numeric' | 'tel';
  half?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className={`field ${half ? 'field--half' : ''} ${value ? 'has-value' : ''} ${error ? 'has-error' : ''}`}>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} inputMode={inputMode} placeholder={placeholder ?? ' '} maxLength={maxLength} aria-invalid={!!error} />
      <span>{label}</span>
      {error && <em>{error}</em>}
    </label>
  );
}

export default function Checkout() {
  const shop = useShop();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [info, setInfo] = useState<Info>(emptyInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [methodId, setMethodId] = useState('standard');
  const [pay, setPay] = useState<'card' | 'paypal' | 'afterpay' | 'klarna'>('card');
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', name: '' });
  const [billingSame, setBillingSame] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [express, setExpress] = useState<string | null>(params.get('express'));
  const [code, setCode] = useState('');
  const [codeErr, setCodeErr] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const method = shippingMethods.find((m) => m.id === methodId)!;
  const taxable = shop.subtotal - shop.discount;
  const promoFree = !!(shop.promo && promoCodes[shop.promo]?.freeShipping);
  const shipping = step >= 2 || express ? (promoFree ? 0 : shippingCost(method, shop.subtotal)) : null;
  const taxRate = taxRateFor(info.state || (express ? 'NY' : undefined));
  const tax = info.state || express ? Math.round(taxable * taxRate) / 100 : null;
  const total = taxable + (shipping ?? 0) + (tax ?? 0);

  const set = (k: keyof Info) => (v: string | boolean) => {
    setInfo((i) => ({ ...i, [k]: k === 'phone' ? formatPhone(v as string) : k === 'zip' ? (v as string).replace(/\D/g, '').slice(0, 5) : v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(info.email)) e.email = 'Enter a valid email';
    if (!info.first.trim()) e.first = 'Required';
    if (!info.last.trim()) e.last = 'Required';
    if (!info.address1.trim()) e.address1 = 'Enter an address';
    if (!info.city.trim()) e.city = 'Required';
    if (!info.state) e.state = 'Select a state';
    if (!/^\d{5}$/.test(info.zip)) e.zip = 'Enter a 5-digit ZIP';
    if (info.smsOptIn && info.phone.replace(/\D/g, '').length !== 10) e.phone = 'Enter a 10-digit phone for SMS';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCard = () => {
    if (pay !== 'card') return true;
    const e: Record<string, string> = {};
    if (!luhn(card.number)) e.number = 'Enter a valid card number';
    const [mm, yy] = card.exp.split(' / ').map(Number);
    const now = new Date();
    if (!mm || mm > 12 || !yy || 2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1)) e.exp = 'Invalid date';
    if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = 'Invalid';
    if (!card.name.trim()) e.name = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = (payment: string, who: Info = info) => {
    setProcessing(true);
    const num = `NB${Math.floor(100000 + Math.random() * 900000)}`;
    const order: Order = {
      number: num,
      createdAt: new Date().toISOString(),
      email: who.email,
      name: `${who.first} ${who.last}`,
      address: `${who.address1}${who.address2 ? ', ' + who.address2 : ''}, ${who.city}, ${who.state} ${who.zip}`,
      shippingLabel: `${method.label} · ${method.carrier}`,
      delivery: deliveryWindow(method.days),
      payment,
      lines: shop.lines.map((l) => ({ name: l.product.name, color: l.color, size: l.size, qty: l.qty, price: l.product.price, image: l.variant.images[0] })),
      subtotal: shop.subtotal,
      discount: shop.discount,
      shipping: promoFree ? 0 : shippingCost(method, shop.subtotal),
      tax: Math.round(taxable * taxRateFor(who.state)) / 100,
      total: 0,
      points: Math.floor(taxable * REWARDS_POINTS_PER_DOLLAR),
    };
    order.total = order.subtotal - order.discount + order.shipping + order.tax;
    window.setTimeout(() => {
      shop.addOrder(order);
      shop.clear();
      nav(`/order/${num}`, { replace: true });
    }, 2200);
  };

  const paymentLabel = useMemo(() => {
    if (pay === 'card') return `${cardBrand(card.number) || 'Card'} •••• ${card.number.replace(/\D/g, '').slice(-4)}`;
    return { paypal: 'PayPal', afterpay: 'Afterpay (4 payments)', klarna: 'Klarna (4 payments)' }[pay];
  }, [pay, card.number]);

  if (shop.lines.length === 0 && !processing) return <Navigate to="/cart" replace />;

  const steps = ['Information', 'Shipping', 'Payment'];

  return (
    <div className="checkout">
      <header className="co-head">
        <button className="icon-btn" onClick={() => (step > 1 ? setStep((step - 1) as Step) : nav('/cart'))} aria-label="Back">
          <IconBack />
        </button>
        <Link to="/" aria-label="NORBYS home">
          <Logo />
        </Link>
        <span className="co-head__lock" aria-label="Secure checkout">
          <IconLock size={18} />
        </span>
      </header>

      <button className="co-summary-toggle" onClick={() => setSummaryOpen(!summaryOpen)} aria-expanded={summaryOpen}>
        <span>
          {summaryOpen ? 'Hide' : 'Show'} order summary
          <motion.span animate={{ rotate: summaryOpen ? 180 : 0 }} style={{ display: 'inline-flex' }}>
            <IconDown size={16} />
          </motion.span>
        </span>
        <b>{money(total)}</b>
      </button>
      <AnimatePresence initial={false}>
        {summaryOpen && (
          <motion.div className="co-summary" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: EASE.smooth }}>
            <div className="co-summary__inner">
              {shop.lines.map((l) => (
                <div key={l.key} className="co-line">
                  <span className="co-line__img">
                    <img src={l.variant.images[0]} alt="" />
                    <b>{l.qty}</b>
                  </span>
                  <div>
                    <strong>{l.product.name}</strong>
                    <span className="muted small">
                      {l.color} / {l.size}
                    </span>
                  </div>
                  <span>{money(l.lineTotal)}</span>
                </div>
              ))}
              {!shop.promo ? (
                <form
                  className="promo__row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (shop.applyPromo(code)) setCodeErr('');
                    else setCodeErr('Invalid code');
                  }}
                >
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code or gift card" aria-label="Discount code" />
                  <button className="btn btn--ghost btn--sm">Apply</button>
                </form>
              ) : (
                <div className="promo-applied">
                  <IconTag size={16} /> <b>{shop.promo}</b>
                  <button className="link-btn" onClick={shop.removePromo}>
                    Remove
                  </button>
                </div>
              )}
              {codeErr && <p className="err small">{codeErr}</p>}
              <Totals subtotal={shop.subtotal} discount={shop.discount} shipping={shipping} tax={tax} total={total} taxRate={taxRate} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ol className="stepper" aria-label="Checkout steps">
        {steps.map((s, i) => (
          <li key={s} className={`${step === i + 1 ? 'is-on' : ''} ${step > i + 1 ? 'is-done' : ''}`}>
            <button disabled={step <= i + 1} onClick={() => setStep((i + 1) as Step)}>
              <span className="stepper__n">{step > i + 1 ? <IconCheck size={13} /> : i + 1}</span>
              {s}
            </button>
          </li>
        ))}
        <motion.i className="stepper__bar" animate={{ width: `${((step - 1) / 2) * 100}%` }} transition={{ ease: EASE.premium, duration: 0.6 }} />
      </ol>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section key="s1" className="co-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: EASE.smooth }}>
            <div className="express">
              <span className="express__label">Express checkout</span>
              <div className="express__btns">
                <button className="xbtn xbtn--apple" onClick={() => setExpress('apple')} aria-label="Apple Pay">
                  <AppleGlyph size={15} /> Pay
                </button>
                <button className="xbtn xbtn--shop" onClick={() => setExpress('shop')} aria-label="Shop Pay">
                  shop<b>Pay</b>
                </button>
                <button className="xbtn xbtn--paypal" onClick={() => setExpress('paypal')} aria-label="PayPal">
                  <b>Pay</b>Pal
                </button>
              </div>
              <div className="or">
                <span>OR</span>
              </div>
            </div>

            <div className="co-title">
              <h2>Contact</h2>
              <button className="link-btn small" onClick={() => setInfo(demoInfo)}>
                Fill demo details
              </button>
            </div>
            <p className="muted small">Checking out as a guest. <Link to="/account">Sign in</Link> for faster checkout.</p>
            <Field label="Email" type="email" inputMode="email" autoComplete="email" value={info.email} onChange={set('email')} error={errors.email} />
            <label className="check">
              <input type="checkbox" checked={info.newsOptIn} onChange={(e) => set('newsOptIn')(e.target.checked)} />
              <span>Email me with news and offers</span>
            </label>

            <h2 className="co-h2">Shipping address</h2>
            <div className="field field--select has-value">
              <select value="US" disabled aria-label="Country">
                <option value="US">United States</option>
              </select>
              <span>Country/Region</span>
            </div>
            <div className="fields-row">
              <Field half label="First name" autoComplete="given-name" value={info.first} onChange={set('first')} error={errors.first} />
              <Field half label="Last name" autoComplete="family-name" value={info.last} onChange={set('last')} error={errors.last} />
            </div>
            <Field label="Address" autoComplete="address-line1" value={info.address1} onChange={set('address1')} error={errors.address1} />
            <Field label="Apartment, suite, etc. (optional)" autoComplete="address-line2" value={info.address2} onChange={set('address2')} />
            <Field label="City" autoComplete="address-level2" value={info.city} onChange={set('city')} error={errors.city} />
            <div className="fields-row">
              <label className={`field field--select field--half ${info.state ? 'has-value' : ''} ${errors.state ? 'has-error' : ''}`}>
                <select value={info.state} onChange={(e) => set('state')(e.target.value)} autoComplete="address-level1" aria-invalid={!!errors.state}>
                  <option value="" disabled>
                    {' '}
                  </option>
                  {states.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <span>State</span>
                {errors.state && <em>{errors.state}</em>}
              </label>
              <Field half label="ZIP code" inputMode="numeric" autoComplete="postal-code" value={info.zip} onChange={set('zip')} error={errors.zip} />
            </div>
            <Field label="Phone (for delivery updates)" type="tel" inputMode="tel" autoComplete="tel" value={info.phone} onChange={set('phone')} error={errors.phone} />
            <label className="check">
              <input type="checkbox" checked={info.smsOptIn} onChange={(e) => set('smsOptIn')(e.target.checked)} />
              <span>Text me with news and offers</span>
            </label>
            <AnimatePresence>
              {info.smsOptIn && (
                <motion.p className="fine fine--dark" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  By checking this box, you agree to receive recurring automated marketing text messages from NORBYS at the number provided. Consent is not a condition of purchase. Msg & data rates may apply. Msg frequency varies. Reply HELP for help and STOP to cancel.
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button whileTap={{ scale: 0.97 }} className="btn btn--dark btn--lg" onClick={() => validateInfo() && setStep(2)}>
              Continue to shipping
            </motion.button>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section key="s2" className="co-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: EASE.smooth }}>
            <Review info={info} onEdit={() => setStep(1)} />
            <h2 className="co-h2">Shipping method</h2>
            <div className="radios">
              {shippingMethods.map((m) => {
                const cost = promoFree ? 0 : shippingCost(m, shop.subtotal);
                return (
                  <label key={m.id} className={`radio ${methodId === m.id ? 'is-on' : ''}`}>
                    <input type="radio" name="ship" checked={methodId === m.id} onChange={() => setMethodId(m.id)} />
                    <span className="radio__dot" />
                    <span className="radio__main">
                      <strong>{m.label}</strong>
                      <span>
                        {m.carrier} · Arrives {deliveryWindow(m.days)}
                      </span>
                    </span>
                    <b>{cost === 0 ? 'FREE' : money(cost)}</b>
                  </label>
                );
              })}
            </div>
            <p className="muted small note">
              <IconTruck size={15} /> Orders placed before 1 PM ET ship same business day. Tracking sent by email{info.phone ? ' & SMS' : ''}.
            </p>
            <motion.button whileTap={{ scale: 0.97 }} className="btn btn--dark btn--lg" onClick={() => setStep(3)}>
              Continue to payment
            </motion.button>
          </motion.section>
        )}

        {step === 3 && (
          <motion.section key="s3" className="co-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: EASE.smooth }}>
            <Review info={info} onEdit={() => setStep(1)} method={`${method.label} · ${shipping === 0 ? 'Free' : money(shipping ?? 0)}`} onEditMethod={() => setStep(2)} />
            <h2 className="co-h2">Payment</h2>
            <p className="muted small">
              <IconShield size={14} /> All transactions are secure and encrypted.
            </p>
            <div className="radios radios--pay">
              {(
                [
                  ['card', 'Credit or debit card', <span className="mini-cards" key="c"><i>VISA</i><i>MC</i><i>AMEX</i><i>DISC</i></span>],
                  ['paypal', 'PayPal', <span className="xlogo xlogo--paypal" key="p"><b>Pay</b>Pal</span>],
                  ['afterpay', `Afterpay — 4 × ${money(total / 4)}`, <span className="xlogo xlogo--afterpay" key="a">afterpay</span>],
                  ['klarna', `Klarna — 4 × ${money(total / 4)}`, <span className="xlogo xlogo--klarna" key="k">Klarna.</span>],
                ] as const
              ).map(([k, label, logo]) => (
                <div key={k} className={`radio-group ${pay === k ? 'is-on' : ''}`}>
                  <label className="radio">
                    <input type="radio" name="pay" checked={pay === k} onChange={() => setPay(k)} />
                    <span className="radio__dot" />
                    <span className="radio__main">
                      <strong>{label}</strong>
                    </span>
                    {logo}
                  </label>
                  <AnimatePresence initial={false}>
                    {pay === k && (
                      <motion.div className="radio-group__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        {k === 'card' ? (
                          <div className="card-form">
                            <div className="test-hint">
                              Demo mode — use test card <button className="link-btn" onClick={() => setCard({ number: '4242 4242 4242 4242', exp: '12 / 30', cvc: '123', name: `${info.first} ${info.last}`.trim() || 'Alex Rivera' })}>4242 4242 4242 4242</button>
                            </div>
                            <label className={`field ${card.number ? 'has-value' : ''} ${errors.number ? 'has-error' : ''}`}>
                              <input inputMode="numeric" autoComplete="cc-number" value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} placeholder=" " />
                              <span>Card number</span>
                              {cardBrand(card.number) && <b className="card-brand">{cardBrand(card.number)}</b>}
                              {errors.number && <em>{errors.number}</em>}
                            </label>
                            <div className="fields-row">
                              <label className={`field field--half ${card.exp ? 'has-value' : ''} ${errors.exp ? 'has-error' : ''}`}>
                                <input inputMode="numeric" autoComplete="cc-exp" value={card.exp} onChange={(e) => setCard({ ...card, exp: formatExp(e.target.value) })} placeholder=" " />
                                <span>Expiration (MM / YY)</span>
                                {errors.exp && <em>{errors.exp}</em>}
                              </label>
                              <label className={`field field--half ${card.cvc ? 'has-value' : ''} ${errors.cvc ? 'has-error' : ''}`}>
                                <input inputMode="numeric" autoComplete="cc-csc" maxLength={4} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '') })} placeholder=" " />
                                <span>Security code</span>
                                {errors.cvc && <em>{errors.cvc}</em>}
                              </label>
                            </div>
                            <label className={`field ${card.name ? 'has-value' : ''} ${errors.name ? 'has-error' : ''}`}>
                              <input autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder=" " />
                              <span>Name on card</span>
                              {errors.name && <em>{errors.name}</em>}
                            </label>
                            <label className="check">
                              <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} />
                              <span>Billing address same as shipping</span>
                            </label>
                          </div>
                        ) : (
                          <p className="redirect-note">
                            After clicking “{k === 'paypal' ? 'Pay with PayPal' : 'Complete order'}”, you’ll be redirected to {k === 'paypal' ? 'PayPal' : k === 'afterpay' ? 'Afterpay' : 'Klarna'} to complete your purchase securely.
                            {k !== 'paypal' && ' 4 interest-free payments, every 2 weeks. No impact to credit score to check eligibility.'}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="co-final">
              <Totals subtotal={shop.subtotal} discount={shop.discount} shipping={shipping} tax={tax} total={total} taxRate={taxRate} />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} className="btn btn--dark btn--lg" onClick={() => validateCard() && placeOrder(paymentLabel ?? 'Card')}>
              <IconLock size={17} /> {pay === 'paypal' ? 'Pay with PayPal' : `Pay ${money(total)}`}
            </motion.button>
            <p className="fine fine--dark center">
              By placing your order, you agree to NORBYS’s <Link to="/help/terms">Terms of Service</Link> and <Link to="/help/privacy">Privacy Policy</Link>. Payments processed by Stripe — card data never touches our servers (PCI-DSS Level 1).
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="co-foot">
        <Link to="/help/returns">Refund policy</Link>
        <Link to="/help/shipping">Shipping</Link>
        <Link to="/help/privacy">Privacy</Link>
        <Link to="/help/terms">Terms</Link>
      </footer>

      <Sheet open={!!express && !processing} onClose={() => setExpress(null)}>
        <ExpressPay kind={express ?? 'apple'} total={total} onPay={() => placeOrder(express === 'apple' ? 'Apple Pay' : express === 'shop' ? 'Shop Pay' : 'PayPal', demoInfo)} />
      </Sheet>

      <AnimatePresence>
        {processing && (
          <motion.div className="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="processing__ring" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
            <strong>Processing payment…</strong>
            <span>Please don’t close this window</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Totals({ subtotal, discount, shipping, tax, total, taxRate }: { subtotal: number; discount: number; shipping: number | null; tax: number | null; total: number; taxRate: number }) {
  return (
    <dl className="totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{money(subtotal)}</dd>
      </div>
      {discount > 0 && (
        <div className="totals__disc">
          <dt>Discount</dt>
          <dd>−{money(discount)}</dd>
        </div>
      )}
      <div>
        <dt>Shipping</dt>
        <dd>{shipping === null ? 'Calculated next step' : shipping === 0 ? 'FREE' : money(shipping)}</dd>
      </div>
      <div>
        <dt>Sales tax {tax !== null && <em>({taxRate}%)</em>}</dt>
        <dd>{tax === null ? 'Enter address' : money(tax)}</dd>
      </div>
      <div className="totals__total">
        <dt>Total</dt>
        <dd>
          <small>USD</small> {money(total)}
        </dd>
      </div>
    </dl>
  );
}

function Review({ info, onEdit, method, onEditMethod }: { info: Info; onEdit: () => void; method?: string; onEditMethod?: () => void }) {
  return (
    <div className="review-box">
      <div>
        <span>Contact</span>
        <p>{info.email}</p>
        <button className="link-btn small" onClick={onEdit}>
          Change
        </button>
      </div>
      <div>
        <span>Ship to</span>
        <p>
          {info.address1}
          {info.address2 && `, ${info.address2}`}, {info.city}, {info.state} {info.zip}
        </p>
        <button className="link-btn small" onClick={onEdit}>
          Change
        </button>
      </div>
      {method && (
        <div>
          <span>Method</span>
          <p>{method}</p>
          <button className="link-btn small" onClick={onEditMethod}>
            Change
          </button>
        </div>
      )}
    </div>
  );
}

function ExpressPay({ kind, total, onPay }: { kind: string; total: number; onPay: () => void }) {
  const [auth, setAuth] = useState(false);
  const title = kind === 'apple' ? <><AppleGlyph size={18} /> Pay</> : kind === 'shop' ? <>shop<b>Pay</b></> : <><b>Pay</b>Pal</>;
  return (
    <div className={`xpay xpay--${kind}`}>
      <div className="xpay__brand">{title}</div>
      <div className="xpay__rows">
        <div>
          <span>Card</span>
          <p>Visa •••• 4242</p>
        </div>
        <div>
          <span>Ship to</span>
          <p>{demoInfo.first} {demoInfo.last}, {demoInfo.address1}, {demoInfo.city}, {demoInfo.state} {demoInfo.zip}</p>
        </div>
        <div>
          <span>Method</span>
          <p>Standard · USPS Ground Advantage</p>
        </div>
        <div>
          <span>Contact</span>
          <p>{demoInfo.email}</p>
        </div>
      </div>
      <div className="xpay__total">
        <span>Pay NORBYS USA</span>
        <strong>{money(total)}</strong>
      </div>
      {kind === 'apple' ? (
        <motion.button
          className="xpay__face"
          onClick={() => {
            setAuth(true);
            window.setTimeout(onPay, 900);
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span className={`face ${auth ? 'is-ok' : ''}`} animate={auth ? { scale: [1, 1.15, 1] } : {}}>
            {auth ? <IconCheck size={28} /> : <FaceIdGlyph />}
          </motion.span>
          {auth ? 'Done' : 'Confirm with Face ID'}
        </motion.button>
      ) : (
        <motion.button whileTap={{ scale: 0.97 }} className={`btn btn--lg ${kind === 'paypal' ? 'btn--paypal' : 'btn--shop'}`} onClick={onPay}>
          {kind === 'paypal' ? 'Complete Purchase' : 'Pay now'}
        </motion.button>
      )}
      <p className="fine fine--dark center">Demo simulation — no real payment is made.</p>
    </div>
  );
}

function FaceIdGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M2 10V6a4 4 0 0 1 4-4h4M24 2h4a4 4 0 0 1 4 4v4M32 24v4a4 4 0 0 1-4 4h-4M10 32H6a4 4 0 0 1-4-4v-4" />
      <path d="M11 12v3M23 12v3M17 12v7h-2M12 24c3 2.5 7 2.5 10 0" />
    </svg>
  );
}
