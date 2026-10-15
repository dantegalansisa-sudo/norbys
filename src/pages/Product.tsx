import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getProduct, looks, products, sampleReviews } from '../data/products';
import { FREE_SHIPPING_THRESHOLD, RETURN_WINDOW_DAYS, deliveryWindow, money, moneyShort, sizeChart } from '../data/commerce';
import { Header, Page, Footer } from '../components/Layout';
import Sheet from '../components/Sheet';
import ProductCard from '../components/ProductCard';
import { FadeUp, stagger, EASE } from '../components/Motion';
import { IconBag, IconArrow, IconHeart, IconShare, IconStar, IconRuler, IconTruck, IconReturn, IconCheck, IconPin } from '../components/Icons';
import { useShop } from '../store/ShopContext';

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="acc">
      <button className="acc__head" onClick={() => setOpen(!open)} aria-expanded={open}>
        {title}
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="acc__plus">
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="acc__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="acc__inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductPage() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);
  const nav = useNavigate();
  const shop = useShop();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [guide, setGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const [zip, setZip] = useState('');
  const [zipOk, setZipOk] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaVisible = useInView(ctaRef, { amount: 0.3 });

  useEffect(() => {
    setColorIdx(0);
    setSize(product && product.sizes.length === 1 ? product.sizes[0] : null);
    setImgIdx(0);
    galleryRef.current?.scrollTo({ left: 0 });
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return <Navigate to="/shop" replace />;

  const variant = product.colors[colorIdx];
  const wished = shop.isWished(product.slug);
  const stockLeft = size ? variant.stock[size] ?? 0 : null;
  const look = looks.find((l) => l.items.includes(product.slug));
  const related = products.filter((p) => p.slug !== product.slug && (p.category === product.category || look?.items.includes(p.slug))).slice(0, 4);

  const onScroll = () => {
    const el = galleryRef.current;
    if (el) setImgIdx(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goImg = (n: number) => galleryRef.current?.scrollTo({ left: n * galleryRef.current.clientWidth, behavior: 'smooth' });

  const addToBag = (buyNow = false) => {
    if (!size) {
      setSizeError(true);
      document.getElementById('size-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    shop.add(product.slug, variant.name, size);
    if (buyNow) nav('/checkout');
    else setAdded(true);
  };

  const share = async () => {
    const data = { title: `NORBYS — ${product.name}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        shop.showToast({ title: 'Link copied to clipboard' });
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <>
      <Header back />
      <Page className="pdp">
        <div className="gallery">
          <div className="gallery__track" ref={galleryRef} onScroll={onScroll}>
            {variant.images.map((src, n) => (
              <motion.div key={src + variant.name} className="gallery__slide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <img src={src} alt={`${product.name} ${variant.name} view ${n + 1}`} />
              </motion.div>
            ))}
          </div>
          <div className="gallery__actions">
            <motion.button
              whileTap={{ scale: 0.8 }}
              className={`round-btn ${wished ? 'is-on' : ''}`}
              aria-label={wished ? 'Remove from saved' : 'Save'}
              aria-pressed={wished}
              onClick={() => shop.toggleWish(product.slug)}
            >
              <IconHeart size={19} fill={wished ? 'currentColor' : 'none'} />
            </motion.button>
            <button className="round-btn" aria-label="Share" onClick={share}>
              <IconShare size={18} />
            </button>
          </div>
          {product.badge && <span className={`badge badge--lg badge--${product.badge.toLowerCase().replace(' ', '-')}`}>{product.badge}</span>}
          <div className="gallery__count">
            {imgIdx + 1} / {variant.images.length}
          </div>
        </div>
        <div className="thumbs">
          {variant.images.map((src, n) => (
            <button key={src} className={`thumb ${n === imgIdx ? 'is-on' : ''}`} onClick={() => goImg(n)} aria-label={`View image ${n + 1}`}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>

        <div className="pdp__body">
          <div className="pdp__title">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE.premium, duration: 0.6 }}>
                {product.name}
              </motion.h1>
              <button className="rating" onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}>
                <IconStar /> {product.rating} <em>({product.reviews} reviews)</em>
              </button>
            </div>
            <div className="pdp__price">
              {moneyShort(product.price)}
              {product.compareAt && <s>{moneyShort(product.compareAt)}</s>}
            </div>
          </div>
          <p className="bnpl">
            or 4 interest-free payments of <b>{money(product.price / 4)}</b> with <span className="bnpl__k">Klarna</span> or <span className="bnpl__a">afterpay</span>
          </p>
          <p className="pdp__desc">{product.description}</p>

          <div className="label-row">
            <p className="label">
              Color: <b>{variant.name}</b>
            </p>
          </div>
          <div className="colors">
            {product.colors.map((c, n) => (
              <button
                key={c.name}
                className={`color ${n === colorIdx ? 'is-on' : ''}`}
                style={{ ['--c' as string]: c.hex }}
                aria-label={c.name}
                aria-pressed={n === colorIdx}
                onClick={() => {
                  setColorIdx(n);
                  setImgIdx(0);
                  galleryRef.current?.scrollTo({ left: 0 });
                }}
              />
            ))}
          </div>

          <div className="label-row" id="size-picker">
            <p className="label">
              Size: <b>{size ?? (sizeError ? <span className="err">Please select a size</span> : 'Select')}</b>
            </p>
            {product.sizes.length > 1 && (
              <button className="link-btn" onClick={() => setGuide(true)}>
                <IconRuler size={17} /> Size Guide
              </button>
            )}
          </div>
          <motion.div className="size-grid" animate={sizeError && !size ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}>
            {product.sizes.map((s) => {
              const out = (variant.stock[s] ?? 0) === 0;
              return (
                <button
                  key={s}
                  disabled={out}
                  className={`size ${size === s ? 'is-on' : ''} ${out ? 'is-out' : ''} ${product.sizes.length === 1 ? 'size--wide' : ''}`}
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  aria-label={out ? `${s}, sold out` : s}
                >
                  {s}
                </button>
              );
            })}
          </motion.div>
          <AnimatePresence>
            {stockLeft !== null && stockLeft > 0 && stockLeft <= 3 && (
              <motion.p className="low-stock" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <i /> Only {stockLeft} left in {size} — order soon
              </motion.p>
            )}
          </AnimatePresence>

          <div className="cta" ref={ctaRef}>
            <motion.button whileTap={{ scale: 0.97 }} className="btn btn--dark btn--lg" onClick={() => addToBag(false)}>
              <IconBag size={19} /> Add to Bag
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} className="btn btn--olive btn--lg" onClick={() => addToBag(true)}>
              Buy Now <IconArrow size={18} />
            </motion.button>
          </div>

          <div className="ship-box">
            <div className="ship-box__row">
              <IconTruck size={20} />
              <div>
                <strong>{product.price >= FREE_SHIPPING_THRESHOLD ? 'Free shipping' : `Free shipping on orders $${FREE_SHIPPING_THRESHOLD}+`}</strong>
                <span>
                  Order today, get it <b>{deliveryWindow([3, 5])}</b>
                  {zipOk && <> to {zip}</>}
                </span>
              </div>
            </div>
            <form
              className="zip"
              onSubmit={(e) => {
                e.preventDefault();
                setZipOk(/^\d{5}$/.test(zip));
              }}
            >
              <IconPin size={17} />
              <input inputMode="numeric" maxLength={5} placeholder="Enter ZIP for delivery date" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} aria-label="ZIP code" />
              <button className="link-btn">Check</button>
            </form>
            <div className="ship-box__row">
              <IconReturn size={20} />
              <div>
                <strong>Free {RETURN_WINDOW_DAYS}-day returns & exchanges</strong>
                <span>Prepaid label · Refund to original payment</span>
              </div>
            </div>
          </div>

          <Accordion title="Details" defaultOpen>
            <ul className="bullets">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Accordion>
          <Accordion title="Fit">
            <p>{product.fit}</p>
          </Accordion>
          <Accordion title="Fabric & Care">
            <p>{product.fabric}</p>
          </Accordion>
          <Accordion title="Shipping & Returns">
            <p>
              Standard (3–5 business days) is free on orders over ${FREE_SHIPPING_THRESHOLD}, otherwise $6.95. Express and Overnight available at checkout. Ships to all 50 states, APO/FPO. Returns accepted within {RETURN_WINDOW_DAYS} days in original condition.
            </p>
          </Accordion>
        </div>

        {look && (
          <section className="section">
            <div className="section__head">
              <h2>Complete the Look</h2>
            </div>
            <FadeUp>
              <Link to="/looks" className="ctl">
                <img src={look.image} alt="" />
                <div>
                  <em>Lookbook</em>
                  <strong>{look.title}</strong>
                  <span>
                    {look.items.length} pieces · Shop the look <IconArrow size={14} />
                  </span>
                </div>
              </Link>
            </FadeUp>
          </section>
        )}

        <section className="section reviews" id="reviews">
          <div className="section__head">
            <h2>Reviews</h2>
          </div>
          <div className="reviews__summary">
            <div className="reviews__score">
              <strong>{product.rating}</strong>
              <span className="stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <IconStar key={n} size={16} filled={n <= Math.round(product.rating)} />
                ))}
              </span>
              <em>{product.reviews} reviews</em>
            </div>
            <div className="reviews__bars">
              {[
                [5, 86],
                [4, 10],
                [3, 3],
                [2, 1],
                [1, 0],
              ].map(([s, pct]) => (
                <div key={s} className="bar">
                  <span>{s}</span>
                  <div>
                    <motion.i initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE.premium }} />
                  </div>
                </div>
              ))}
              <p className="fit-meter">
                Fit: <b>True to size</b> (78%)
              </p>
            </div>
          </div>
          {sampleReviews.map((r) => (
            <FadeUp key={r.name} className="review">
              <div className="review__top">
                <span className="stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <IconStar key={n} size={13} filled={n <= r.rating} />
                  ))}
                </span>
                <span className="muted small">{r.date}</span>
              </div>
              <strong>{r.title}</strong>
              <p>{r.body}</p>
              <span className="muted small">
                {r.name} · {r.location} · Size {r.size} {r.verified && <em className="verified"><IconCheck size={12} /> Verified Buyer</em>}
              </span>
            </FadeUp>
          ))}
        </section>

        <section className="section">
          <div className="section__head">
            <h2>You May Also Like</h2>
          </div>
          <motion.div className="hscroll" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} width={160} />
            ))}
          </motion.div>
        </section>
        <Footer />
      </Page>

      <AnimatePresence>
        {!ctaVisible && (
          <motion.div className="sticky-cta" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
            <div className="sticky-cta__info">
              <img src={variant.images[0]} alt="" />
              <div>
                <strong>{product.name}</strong>
                <span>
                  {moneyShort(product.price)} · {variant.name}
                  {size ? ` · ${size}` : ''}
                </span>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} className="btn btn--dark" onClick={() => addToBag(false)}>
              {size ? 'Add to Bag' : 'Select Size'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={guide} onClose={() => setGuide(false)} title="Size Guide">
        <p className="muted small">Garment measurements in inches. Between sizes? Size down for a closer fit, up for oversized.</p>
        <table className="size-table">
          <thead>
            <tr>
              {sizeChart.tops.headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeChart.tops.rows.map((r) => (
              <tr key={r[0]} className={r[0] === size ? 'is-on' : ''}>
                {r.map((c, i) => (
                  <td key={i}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="fit-tip">
          <strong>How to measure</strong>
          <p>Chest: lay flat and measure armpit to armpit, then double. Length: from highest shoulder point to hem.</p>
        </div>
      </Sheet>

      <Sheet
        open={added}
        onClose={() => setAdded(false)}
        footer={
          <div className="row gap">
            <Link to="/cart" className="btn btn--ghost grow">
              View Bag ({shop.count})
            </Link>
            <Link to="/checkout" className="btn btn--dark grow">
              Checkout
            </Link>
          </div>
        }
      >
        <div className="added">
          <motion.span className="added__check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}>
            <IconCheck size={18} />
          </motion.span>
          <strong>Added to your bag</strong>
        </div>
        <div className="added__item">
          <img src={variant.images[0]} alt="" />
          <div>
            <strong>{product.name}</strong>
            <span className="muted small">
              {variant.name} / {size}
            </span>
            <span>{moneyShort(product.price)}</span>
          </div>
        </div>
        {shop.freeShipRemaining > 0 ? (
          <FreeShipBar />
        ) : (
          <p className="free-ok">
            <IconTruck size={18} /> You’ve unlocked <b>free shipping</b>
          </p>
        )}
      </Sheet>
    </>
  );
}

export function FreeShipBar() {
  const { subtotal, freeShipRemaining } = useShop();
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div className="freebar">
      <p>
        {freeShipRemaining > 0 ? (
          <>
            You’re <b>{money(freeShipRemaining)}</b> away from free shipping
          </>
        ) : (
          <>
            <IconTruck size={16} /> You’ve unlocked <b>free shipping</b>
          </>
        )}
      </p>
      <div className="freebar__track">
        <motion.i initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: EASE.premium }} />
      </div>
    </div>
  );
}
