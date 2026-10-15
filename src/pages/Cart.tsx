import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Page, PaymentIcons, AppleGlyph } from '../components/Layout';
import { IconMinus, IconPlus, IconTrash, IconTag, IconLock, IconArrow, IconCrown, IconChevron, IconBag, IconHeart } from '../components/Icons';
import { useShop } from '../store/ShopContext';
import { money, moneyShort, promoCodes, DEFAULT_TAX_RATE, REWARDS_POINTS_PER_DOLLAR } from '../data/commerce';
import { products } from '../data/products';
import { FreeShipBar } from './Product';
import ProductCard from '../components/ProductCard';
import { stagger } from '../components/Motion';

export default function Cart() {
  const shop = useShop();
  const nav = useNavigate();
  const [tab, setTab] = useState<'cart' | 'saved'>('cart');
  const [promoOpen, setPromoOpen] = useState(false);
  const [code, setCode] = useState('');
  const [promoErr, setPromoErr] = useState('');
  const estTax = Math.round((shop.subtotal - shop.discount) * DEFAULT_TAX_RATE) / 100;
  const saved = products.filter((p) => shop.wishlist.includes(p.slug));
  const promoFreeShip = shop.promo && promoCodes[shop.promo]?.freeShipping;
  const upsell = products.filter((p) => !shop.lines.some((l) => l.slug === p.slug) && p.price <= 50).slice(0, 4);

  return (
    <>
      <Header back title="Your Bag" />
      <Page className="cart">
        <div className="seg" role="tablist">
          {(['cart', 'saved'] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-on' : ''} onClick={() => setTab(t)}>
              {tab === t && <motion.span layoutId="seg" className="seg__bg" />}
              <span>{t === 'cart' ? `Bag (${shop.count})` : `Saved (${saved.length})`}</span>
            </button>
          ))}
        </div>

        {tab === 'saved' && (
          <motion.div className="grid2 pad" variants={stagger} initial="hidden" animate="visible">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {saved.length === 0 && <p className="muted pad">Nothing saved yet.</p>}
          </motion.div>
        )}

        {tab === 'cart' && shop.lines.length === 0 && (
          <motion.div className="empty empty--big" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <span className="empty__icon">
              <IconBag size={34} />
            </span>
            <h2>Your bag is empty</h2>
            <p className="muted">Looks like you haven’t added anything yet.</p>
            <Link to="/shop" className="btn btn--dark btn--pill">
              Start Shopping <IconArrow size={16} />
            </Link>
          </motion.div>
        )}

        {tab === 'cart' && shop.lines.length > 0 && (
          <>
            <div className="pad">
              <FreeShipBar />
            </div>
            <ul className="lines">
              <AnimatePresence initial={false}>
                {shop.lines.map((l) => (
                  <motion.li key={l.key} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }} className="line">
                    <Link to={`/product/${l.slug}`} className="line__img">
                      <img src={l.variant.images[0]} alt="" />
                    </Link>
                    <div className="line__info">
                      <div className="line__top">
                        <strong>{l.product.name}</strong>
                        <span>{money(l.lineTotal)}</span>
                      </div>
                      <span className="muted small">
                        {l.color} / {l.size}
                      </span>
                      <span className="muted small">{moneyShort(l.product.price)} each</span>
                      <div className="line__bottom">
                        <div className="qty" role="group" aria-label="Quantity">
                          <button aria-label="Decrease quantity" onClick={() => (l.qty === 1 ? shop.remove(l.key) : shop.setQty(l.key, l.qty - 1))}>
                            {l.qty === 1 ? <IconTrash size={15} /> : <IconMinus size={15} />}
                          </button>
                          <motion.span key={l.qty} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            {l.qty}
                          </motion.span>
                          <button aria-label="Increase quantity" onClick={() => shop.setQty(l.key, l.qty + 1)}>
                            <IconPlus size={15} />
                          </button>
                        </div>
                        <button
                          className="link-btn small"
                          onClick={() => {
                            if (!shop.isWished(l.slug)) shop.toggleWish(l.slug);
                            shop.remove(l.key);
                            shop.showToast({ title: 'Moved to Saved', image: l.variant.images[0] });
                          }}
                        >
                          <IconHeart size={14} /> Save for later
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="pad">
              {shop.promo ? (
                <div className="promo-applied">
                  <IconTag size={17} />
                  <span>
                    <b>{shop.promo}</b> · {promoCodes[shop.promo].label}
                  </span>
                  <button className="link-btn" onClick={shop.removePromo}>
                    Remove
                  </button>
                </div>
              ) : (
                <div className="promo">
                  <button className="promo__head" onClick={() => setPromoOpen(!promoOpen)} aria-expanded={promoOpen}>
                    <IconTag size={17} /> Add promo code
                    <motion.span animate={{ rotate: promoOpen ? 90 : 0 }} style={{ marginLeft: 'auto', display: 'flex' }}>
                      <IconChevron size={17} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {promoOpen && (
                      <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (shop.applyPromo(code)) {
                            setPromoErr('');
                            shop.showToast({ title: `Code ${code.toUpperCase()} applied` });
                          } else setPromoErr('That code isn’t valid. Try NORBYS10.');
                        }}
                      >
                        <div className="promo__row">
                          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" aria-label="Promo code" autoCapitalize="characters" />
                          <button className="btn btn--dark btn--sm">Apply</button>
                        </div>
                        {promoErr && <p className="err small">{promoErr}</p>}
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <dl className="totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{money(shop.subtotal)}</dd>
                </div>
                {shop.discount > 0 && (
                  <div className="totals__disc">
                    <dt>Discount</dt>
                    <dd>−{money(shop.discount)}</dd>
                  </div>
                )}
                <div>
                  <dt>Shipping</dt>
                  <dd>{shop.freeShipRemaining === 0 || promoFreeShip ? 'Free' : 'Calculated at checkout'}</dd>
                </div>
                <div>
                  <dt>Estimated Tax</dt>
                  <dd>{money(estTax)}</dd>
                </div>
                <div className="totals__total">
                  <dt>Estimated Total</dt>
                  <dd>{money(shop.subtotal - shop.discount + estTax)}</dd>
                </div>
              </dl>
              <p className="bnpl small center">
                or 4 interest-free payments of <b>{money((shop.subtotal - shop.discount + estTax) / 4)}</b> with <span className="bnpl__a">afterpay</span>
              </p>

              <motion.button whileTap={{ scale: 0.97 }} className="btn btn--dark btn--lg" onClick={() => nav('/checkout')}>
                <IconLock size={17} /> Checkout Securely <IconArrow size={17} />
              </motion.button>
              <div className="express">
                <span className="express__label">Express checkout</span>
                <div className="express__btns">
                  <button className="xbtn xbtn--apple" onClick={() => nav('/checkout?express=apple')} aria-label="Apple Pay">
                    <AppleGlyph size={15} /> Pay
                  </button>
                  <button className="xbtn xbtn--shop" onClick={() => nav('/checkout?express=shop')} aria-label="Shop Pay">
                    shop<b>Pay</b>
                  </button>
                  <button className="xbtn xbtn--paypal" onClick={() => nav('/checkout?express=paypal')} aria-label="PayPal">
                    <b>Pay</b>Pal
                  </button>
                </div>
              </div>

              <Link to="/account" className="rewards rewards--sm">
                <IconCrown size={24} />
                <div>
                  <strong>Earn {Math.floor((shop.subtotal - shop.discount) * REWARDS_POINTS_PER_DOLLAR)} NORBYS points</strong>
                  <span>with this order</span>
                </div>
                <IconChevron size={17} />
              </Link>
              <PaymentIcons dark={false} />
            </div>

            {upsell.length > 0 && (
              <section className="section">
                <div className="section__head">
                  <h2>Add to your order</h2>
                </div>
                <div className="hscroll">
                  {upsell.map((p) => (
                    <ProductCard key={p.id} product={p} width={150} animate={false} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </Page>
    </>
  );
}
