import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { products, categories } from '../data/products';
import { FREE_SHIPPING_THRESHOLD, RETURN_WINDOW_DAYS, moneyShort } from '../data/commerce';
import { useShop } from '../store/ShopContext';
import Logo, { NMark } from './Logo';
import {
  IconBack, IconBag, IconChat, IconClose, IconHeart, IconHome, IconInstagram, IconLooks, IconMenu, IconSearch, IconShop, IconTiktok, IconUser, IconChevron,
} from './Icons';

const announcements = [
  `Free US shipping on orders $${FREE_SHIPPING_THRESHOLD}+`,
  `Free ${RETURN_WINDOW_DAYS}-day returns & exchanges`,
  'Pay in 4 interest-free with Klarna or Afterpay',
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % announcements.length), 3800);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="announce" role="region" aria-label="Store announcements">
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.35 }}>
          {announcements[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function Header({ back = false, title, transparent = false }: { back?: boolean; title?: string; transparent?: boolean }) {
  const { count } = useShop();
  const nav = useNavigate();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''} ${transparent && !scrolled ? 'is-clear' : ''}`}>
        <div className="header__side">
          {back ? (
            <button className="icon-btn" aria-label="Go back" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))}>
              <IconBack />
            </button>
          ) : (
            <button className="icon-btn" aria-label="Open menu" onClick={() => setMenu(true)}>
              <IconMenu />
            </button>
          )}
          <button className="icon-btn" aria-label="Search" onClick={() => setSearch(true)}>
            <IconSearch size={20} />
          </button>
        </div>
        <Link to="/" className="header__logo" aria-label="NORBYS home">
          {title ? <span className="header__title">{title}</span> : <Logo />}
        </Link>
        <div className="header__side header__side--end">
          <Link to="/saved" className="icon-btn" aria-label="Saved items">
            <IconHeart size={21} />
          </Link>
          <Link to="/cart" className="icon-btn bag-btn" aria-label={`Bag, ${count} items`}>
            <IconBag />
            <AnimatePresence>
              {count > 0 && (
                <motion.span key={count} className="bag-count" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </header>
      <MenuDrawer open={menu} onClose={() => setMenu(false)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}

function MenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const loc = useLocation();
  useEffect(() => {
    onClose();
  }, [loc.pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  const links: [string, string][] = [
    ['New Arrivals', '/shop?sort=new'],
    ['Hoodies', '/shop?c=hoodies'],
    ['Tees', '/shop?c=tees'],
    ['Crewnecks', '/shop?c=crewnecks'],
    ['Caps', '/shop?c=caps'],
    ['Lookbook', '/looks'],
    ['Sale', '/shop?c=sale'],
  ];
  return (
    <AnimatePresence>
      {open && (
        <div className="drawer-root">
          <motion.div className="sheet-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.nav className="drawer" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 280 }} aria-label="Main menu">
            <div className="drawer__head">
              <Logo />
              <button className="icon-btn" onClick={onClose} aria-label="Close menu">
                <IconClose />
              </button>
            </div>
            <ul className="drawer__links">
              {links.map(([l, to], i) => (
                <motion.li key={l} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.04 }}>
                  <Link to={to}>
                    {l}
                    <IconChevron size={18} />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="drawer__sub">
              <Link to="/account">My Account</Link>
              <Link to="/account?tab=orders">Track Order</Link>
              <Link to="/help/shipping">Shipping</Link>
              <Link to="/help/returns">Returns & Exchanges</Link>
              <Link to="/help/faq">Help Center</Link>
            </div>
            <div className="drawer__foot">
              <span>United States (USD $)</span>
              <span className="social">
                <IconInstagram size={20} />
                <IconTiktok size={20} />
              </span>
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const loc = useLocation();
  useEffect(() => {
    onClose();
  }, [loc.pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return products.filter((p) => `${p.name} ${p.category} ${p.colors.map((c) => c.name).join(' ')}`.toLowerCase().includes(t));
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-label="Search">
          <div className="search__bar">
            <IconSearch size={20} />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hoodies, tees, caps..." aria-label="Search products" />
            <button className="link-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
          {!q && (
            <div className="search__empty">
              <p className="eyebrow">Popular searches</p>
              <div className="chips">
                {['Hoodie', 'Black', 'Cap', 'Tee', 'Olive'].map((s) => (
                  <button key={s} className="chip" onClick={() => setQ(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="eyebrow" style={{ marginTop: 28 }}>
                Shop by category
              </p>
              <div className="search__cats">
                {categories.map((c) => (
                  <Link key={c.key} to={`/shop?c=${c.key}`} className="search__cat">
                    <img src={c.image} alt="" />
                    <span>{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {q && (
            <div className="search__results">
              <p className="muted small">
                {results.length} result{results.length === 1 ? '' : 's'} for “{q}”
              </p>
              {results.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="search__row">
                  <img src={p.colors[0].images[0]} alt="" />
                  <div>
                    <strong>{p.name}</strong>
                    <span className="muted small">
                      {p.colors.length} color{p.colors.length > 1 ? 's' : ''} · {moneyShort(p.price)}
                    </span>
                  </div>
                  <IconChevron size={18} />
                </Link>
              ))}
              {results.length === 0 && <p className="muted">No matches. Try “hoodie” or “cap”.</p>}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TabBar() {
  const { wishlist } = useShop();
  const tabs = [
    { to: '/', label: 'Home', icon: IconHome, end: true },
    { to: '/shop', label: 'Shop', icon: IconShop },
    { to: '/looks', label: 'Looks', icon: IconLooks },
    { to: '/saved', label: 'Saved', icon: IconHeart, dot: wishlist.length > 0 },
    { to: '/account', label: 'Profile', icon: IconUser },
  ];
  return (
    <nav className="tabbar" aria-label="Primary">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab ${isActive ? 'is-active' : ''}`}>
          {({ isActive }) => (
            <>
              {isActive && <motion.span layoutId="tab-pill" className="tab__pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
              <span className="tab__icon">
                <t.icon size={21} />
                {t.dot && <i className="tab__dot" />}
              </span>
              <span className="tab__label">{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function Toast() {
  const { toast } = useShop();
  return (
    <div className="toast-wrap" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className="toast" initial={{ y: -30, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
            {toast.image && <img src={toast.image} alt="" />}
            <span>{toast.title}</span>
            {toast.action && (
              <Link to={toast.action.to} className="toast__action">
                {toast.action.label}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Footer() {
  const [open, setOpen] = useState<string | null>(null);
  const groups: [string, [string, string][]][] = [
    ['Help', [['Help Center / FAQ', '/help/faq'], ['Track Your Order', '/account?tab=orders'], ['Shipping', '/help/shipping'], ['Returns & Exchanges', '/help/returns'], ['Size Guide', '/help/size-guide'], ['Contact Us', '/help/contact']]],
    ['Shop', [['New Arrivals', '/shop?sort=new'], ['Hoodies', '/shop?c=hoodies'], ['Tees', '/shop?c=tees'], ['Caps', '/shop?c=caps'], ['Gift Cards', '/help/faq']]],
    ['Company', [['About NORBYS', '/help/about'], ['NORBYS Rewards', '/account'], ['Accessibility', '/help/accessibility']]],
  ];
  return (
    <footer className="footer">
      <div className="footer__brand">
        <NMark size={36} color="#fff" />
        <p>Clothing. People. A lifestyle.</p>
      </div>
      {groups.map(([g, links]) => (
        <div key={g} className="acc acc--dark">
          <button className="acc__head" onClick={() => setOpen(open === g ? null : g)} aria-expanded={open === g}>
            {g}
            <motion.span animate={{ rotate: open === g ? 45 : 0 }} className="acc__plus">
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === g && (
              <motion.ul className="acc__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                {links.map(([l, to]) => (
                  <li key={l}>
                    <Link to={to}>{l}</Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
      <div className="footer__social">
        <a href="#" aria-label="Instagram" onClick={(e) => e.preventDefault()}>
          <IconInstagram />
        </a>
        <a href="#" aria-label="TikTok" onClick={(e) => e.preventDefault()}>
          <IconTiktok />
        </a>
        <Link to="/help/contact" aria-label="Chat with us">
          <IconChat />
        </Link>
      </div>
      <PaymentIcons />
      <div className="footer__legal">
        <span>© 2026 NORBYS USA, LLC</span>
        <Link to="/help/privacy">Privacy Policy</Link>
        <Link to="/help/terms">Terms of Service</Link>
        <Link to="/help/privacy#do-not-sell">Do Not Sell or Share My Personal Information</Link>
        <Link to="/help/accessibility">Accessibility</Link>
      </div>
    </footer>
  );
}

export function PaymentIcons({ dark = true }: { dark?: boolean }) {
  return (
    <div className={`pay-icons ${dark ? '' : 'pay-icons--light'}`} aria-label="Accepted payment methods">
      {['VISA', 'Mastercard', 'AMEX', 'Discover', ' Pay', 'G Pay', 'PayPal', 'Klarna', 'Afterpay'].map((p) => (
        <span key={p}>{p === ' Pay' ? <><AppleGlyph /> Pay</> : p}</span>
      ))}
    </div>
  );
}

export function AppleGlyph({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size + 2} viewBox="0 0 17 20" aria-hidden="true" style={{ marginRight: 1, verticalAlign: '-1px' }}>
      <path
        fill="currentColor"
        d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.4-.9-2.4-3.5ZM11.6 3c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z"
      />
    </svg>
  );
}

export function CookieBanner() {
  const [show, setShow] = useState(() => {
    try {
      return !localStorage.getItem('norbys.consent');
    } catch {
      return true;
    }
  });
  const decide = (v: string) => {
    try {
      localStorage.setItem('norbys.consent', v);
    } catch {
      /* ignore */
    }
    setShow(false);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="cookie" initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} transition={{ delay: 1.6, type: 'spring', damping: 26 }}>
          <p>
            We use cookies to improve your experience and for marketing. See our <Link to="/help/privacy">Privacy Policy</Link>. California residents: <Link to="/help/privacy#do-not-sell">Do Not Sell or Share</Link>.
          </p>
          <div className="cookie__btns">
            <button className="btn btn--ghost btn--sm" onClick={() => decide('essential')}>
              Essential only
            </button>
            <button className="btn btn--dark btn--sm" onClick={() => decide('all')}>
              Accept all
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      className={`page ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {children}
    </motion.main>
  );
}
