import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Footer, Header, Page } from '../components/Layout';
import { IconCrown, IconChevron, IconBox, IconPin, IconHeart, IconReturn, IconChat, IconGift, IconLock, IconUser } from '../components/Icons';
import { useShop } from '../store/ShopContext';
import { money } from '../data/commerce';
import { EASE } from '../components/Motion';

const tiers = [
  { name: 'Member', min: 0 },
  { name: 'Insider', min: 500 },
  { name: 'Elite', min: 1500 },
];

export default function Account() {
  const { points, orders, wishlist } = useShop();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? 'overview';
  const [signedIn, setSignedIn] = useState(true);
  const tier = [...tiers].reverse().find((t) => points >= t.min)!;
  const next = tiers.find((t) => t.min > points);
  const pct = next ? ((points - tier.min) / (next.min - tier.min)) * 100 : 100;

  if (!signedIn) {
    return (
      <>
        <Header />
        <Page>
          <div className="signin">
            <IconUser size={36} />
            <h1>Sign in</h1>
            <p className="muted">Track orders, save addresses and earn rewards.</p>
            <button className="btn btn--dark btn--lg" onClick={() => setSignedIn(true)}>
              Continue with Email
            </button>
            <button className="btn btn--ghost btn--lg" onClick={() => setSignedIn(true)}>
              Continue with Apple
            </button>
            <button className="btn btn--ghost btn--lg" onClick={() => setSignedIn(true)}>
              Continue with Google
            </button>
            <p className="fine fine--dark center">Demo — sign-in is simulated.</p>
          </div>
        </Page>
      </>
    );
  }

  return (
    <>
      <Header />
      <Page>
        <div className="page-head page-head--stack">
          <p className="muted small">Welcome back</p>
          <h1>Alex Rivera</h1>
        </div>

        <div className="pad">
          <motion.div className="member-card" initial={{ rotateX: 18, opacity: 0, y: 20 }} animate={{ rotateX: 0, opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE.premium }}>
            <div className="member-card__top">
              <span>
                <IconCrown size={18} /> NORBYS Rewards
              </span>
              <em>{tier.name}</em>
            </div>
            <strong className="member-card__pts">
              {points.toLocaleString()} <small>pts</small>
            </strong>
            <div className="member-card__bar">
              <motion.i initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3, ease: EASE.premium }} />
            </div>
            <span className="member-card__next">{next ? `${next.min - points} pts to ${next.name}` : 'Top tier unlocked'}</span>
          </motion.div>

          <div className="perks perks--3">
            <div className="perk">
              <IconGift size={20} />
              <strong>$10 off</strong>
              <span>every 500 pts</span>
            </div>
            <div className="perk">
              <IconLock size={20} />
              <strong>Early access</strong>
              <span>to new drops</span>
            </div>
            <div className="perk">
              <IconCrown size={20} />
              <strong>Birthday</strong>
              <span>double points</span>
            </div>
          </div>
        </div>

        <div className="seg seg--3" role="tablist">
          {['overview', 'orders'].map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-on' : ''} onClick={() => setParams(t === 'overview' ? {} : { tab: t }, { replace: true })}>
              {tab === t && <motion.span layoutId="acc-seg" className="seg__bg" />}
              <span>{t === 'overview' ? 'Account' : `Orders (${orders.length})`}</span>
            </button>
          ))}
        </div>

        {tab === 'orders' ? (
          <div className="pad">
            {orders.length === 0 && (
              <div className="empty">
                <p className="muted">No orders yet.</p>
                <Link to="/shop" className="btn btn--dark btn--sm">
                  Start Shopping
                </Link>
              </div>
            )}
            {orders.map((o) => (
              <Link key={o.number} to={`/order/${o.number}`} className="order-row">
                <div className="order-row__imgs">
                  {o.lines.slice(0, 3).map((l, i) => (
                    <img key={i} src={l.image} alt="" />
                  ))}
                </div>
                <div>
                  <strong>#{o.number}</strong>
                  <span className="muted small">
                    {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {money(o.total)}
                  </span>
                  <span className="status">Processing · Arrives {o.delivery}</span>
                </div>
                <IconChevron size={18} />
              </Link>
            ))}
          </div>
        ) : (
          <ul className="menu-list pad">
            {[
              { i: IconBox, l: 'Orders & Tracking', to: '/account?tab=orders' },
              { i: IconHeart, l: `Saved Items (${wishlist.length})`, to: '/saved' },
              { i: IconPin, l: 'Addresses', to: '/account' },
              { i: IconReturn, l: 'Start a Return', to: '/help/returns' },
              { i: IconChat, l: 'Help & Contact', to: '/help/contact' },
            ].map(({ i: I, l, to }) => (
              <li key={l}>
                <Link to={to}>
                  <I size={20} />
                  {l}
                  <IconChevron size={17} />
                </Link>
              </li>
            ))}
            <li>
              <button onClick={() => setSignedIn(false)}>
                <IconUser size={20} /> Sign out
                <IconChevron size={17} />
              </button>
            </li>
          </ul>
        )}
        <Footer />
      </Page>
    </>
  );
}
