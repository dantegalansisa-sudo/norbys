import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, looks, products } from '../data/products';
import { FREE_SHIPPING_THRESHOLD, RETURN_WINDOW_DAYS } from '../data/commerce';
import { AnnouncementBar, Footer, Header, Page } from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { FadeUp, ParallaxImage, RevealText, rise, stagger, EASE } from '../components/Motion';
import { IconArrow, IconCrown, IconLock, IconReturn, IconTruck, IconStar, IconCheck } from '../components/Icons';
import { NMark } from '../components/Logo';
import { useShop } from '../store/ShopContext';

const heroSlides = [
  { img: './images/model-black-hoodie.webp', eyebrow: 'New Drop · FW26', title: 'Built\nDifferent', copy: 'Essential pieces for a bolder tomorrow.', to: '/shop?c=hoodies' },
  { img: './images/model-olive-hoodie.webp', eyebrow: 'Signature Series', title: 'Earth\nTones', copy: 'Garment-dyed olive, made to wear in.', to: '/product/signature-hoodie' },
  { img: './images/model-woman-black-tee.webp', eyebrow: 'Core Collection', title: 'Minimal\nImpact', copy: 'Heavyweight tees. Zero noise.', to: '/shop?c=tees' },
];

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const s = heroSlides[i];

  return (
    <section ref={ref} className="hero">
      <motion.div className="hero__media" style={{ scale, y }}>
        {heroSlides.map((h, n) => (
          <motion.img
            key={h.img}
            src={h.img}
            alt=""
            initial={false}
            animate={{ opacity: n === i ? 1 : 0, scale: n === i ? 1 : 1.06 }}
            transition={{ duration: 1.1, ease: EASE.smooth }}
          />
        ))}
      </motion.div>
      <div className="hero__shade" />
      <motion.div className="hero__content" style={{ opacity: fade }}>
        <motion.p key={`e${i}`} className="eyebrow eyebrow--light" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {s.eyebrow}
        </motion.p>
        <RevealText key={`t${i}`} as="h1" className="hero__title" delay={0.1}>
          {s.title}
        </RevealText>
        <motion.p key={`c${i}`} className="hero__copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {s.copy}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, ease: EASE.premium, duration: 0.7 }}>
          <Link to={s.to} className="btn btn--light btn--pill">
            Shop Now <IconArrow size={18} />
          </Link>
        </motion.div>
      </motion.div>
      <div className="hero__dots" role="tablist" aria-label="Featured drops">
        {heroSlides.map((h, n) => (
          <button key={h.img} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}`} className={n === i ? 'is-on' : ''} onClick={() => setI(n)}>
            {n === i && <motion.i layoutId="hero-dot" />}
          </button>
        ))}
      </div>
      <motion.button className="hero__next" onClick={() => setI((i + 1) % heroSlides.length)} aria-label="Next slide" whileTap={{ scale: 0.9 }}>
        <span>0{i + 1}</span>
        <em>/ 0{heroSlides.length}</em>
      </motion.button>
    </section>
  );
}

function Marquee() {
  const words = ['NORBYS USA', 'BUILT DIFFERENT', 'CLOTHING', 'PEOPLE', 'A LIFESTYLE'];
  const row = [...words, ...words];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[...row, ...row].map((w, i) => (
          <span key={i}>
            {w} <NMark size={14} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { points } = useShop();
  const trending = products.slice(0, 6);
  const recommended = [...products].reverse().slice(0, 4);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      <AnnouncementBar />
      <Header transparent />
      <Page className="home">
        <Hero />

        <section className="section cats">
          <motion.div className="cats__row" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {categories.map((c) => (
              <motion.div key={c.key} variants={rise}>
                <Link to={`/shop?c=${c.key}`} className="cat">
                  <span className="cat__img">
                    <img src={c.image} alt="" />
                  </span>
                  <span>{c.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="section">
          <div className="section__head">
            <RevealText>Trending Now</RevealText>
            <Link to="/shop" className="view-all">
              View All <IconArrow size={16} />
            </Link>
          </div>
          <motion.div className="hscroll" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} width={168} />
            ))}
          </motion.div>
        </section>

        <Marquee />

        <section className="section">
          <div className="editorial">
            <ParallaxImage src="./images/model-grey-hoodie-cap.webp" alt="Model wearing the Heather Grey Essential Hoodie and Classic Cap" className="editorial__img" />
            <div className="editorial__text">
              <p className="eyebrow eyebrow--light">The Lookbook · 01/04</p>
              <RevealText className="editorial__title">{'City\nEssentials'}</RevealText>
              <p>Modern streetwear for everyday movement.</p>
              <Link to="/looks" className="btn btn--light btn--pill btn--sm">
                Shop the Look <IconArrow size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section__head">
            <RevealText>Shop the Hoodie</RevealText>
          </div>
          <FadeUp>
            <Link to="/product/essential-hoodie" className="spotlight">
              <div className="spotlight__imgs">
                <img src="./images/hoodie-black.webp" alt="" />
                <img src="./images/hoodie-olive.webp" alt="" />
                <img src="./images/hoodie-grey.webp" alt="" />
              </div>
              <div className="spotlight__info">
                <div>
                  <strong>Essential Hoodie</strong>
                  <span className="rating">
                    <IconStar /> 4.9 <em>(320 reviews)</em>
                  </span>
                </div>
                <span className="spotlight__price">$90</span>
              </div>
              <p className="muted small">400 GSM heavyweight fleece · 3 colorways · XS–XXL</p>
            </Link>
          </FadeUp>
        </section>

        <section className="section">
          <motion.div className="perks" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            {[
              { i: IconTruck, t: 'Free Shipping', d: `On US orders $${FREE_SHIPPING_THRESHOLD}+` },
              { i: IconReturn, t: 'Easy Returns', d: `${RETURN_WINDOW_DAYS} days, free label` },
              { i: IconLock, t: 'Secure Checkout', d: 'SSL encrypted · PCI-DSS' },
              { i: IconCrown, t: 'Rewards', d: 'Earn 1 pt per $1' },
            ].map(({ i: I, t, d }) => (
              <motion.div className="perk" key={t} variants={rise}>
                <I size={22} />
                <strong>{t}</strong>
                <span>{d}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="section">
          <div className="section__head">
            <RevealText>Recommended For You</RevealText>
          </div>
          <motion.div className="grid2" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </section>

        <section className="section">
          <div className="looks-strip">
            {looks.slice(1).map((l, i) => (
              <FadeUp key={l.id} delay={i * 0.08} className="look-tile">
                <Link to="/looks">
                  <img src={l.image} alt="" loading="lazy" />
                  <span>
                    <em>0{i + 2} / 04</em>
                    {l.title}
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </section>

        <section className="section">
          <FadeUp>
            <Link to="/account" className="rewards">
              <IconCrown size={30} />
              <div>
                <strong>NORBYS Rewards</strong>
                <span>Earn points. Get exclusive drops. You have {points} pts.</span>
              </div>
              <IconArrow size={18} />
            </Link>
          </FadeUp>
        </section>

        <section className="section">
          <FadeUp className="newsletter">
            <p className="eyebrow eyebrow--light">Join the list</p>
            <h2>Get 15% off your first order</h2>
            <p className="muted-light">First access to drops, restocks and members-only sales.</p>
            {subscribed ? (
              <motion.p className="newsletter__ok" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <IconCheck size={18} /> You’re in. Use code <b>WELCOME15</b> at checkout.
              </motion.p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (/\S+@\S+\.\S+/.test(email)) setSubscribed(true);
                }}
              >
                <input type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" />
                <button className="btn btn--light">Sign Up</button>
              </form>
            )}
            <p className="fine">
              By signing up you agree to receive marketing emails from NORBYS. Unsubscribe anytime. See our <Link to="/help/privacy">Privacy Policy</Link>.
            </p>
          </FadeUp>
        </section>

        <Footer />
      </Page>
    </>
  );
}
