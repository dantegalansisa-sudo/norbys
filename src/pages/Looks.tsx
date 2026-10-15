import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { looks, getProduct } from '../data/products';
import { moneyShort } from '../data/commerce';
import { Footer, Header, Page } from '../components/Layout';
import { RevealText, EASE } from '../components/Motion';
import { IconPlus, IconCheck, IconArrow } from '../components/Icons';
import { useShop } from '../store/ShopContext';

function LookBlock({ look, index }: { look: (typeof looks)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const shop = useShop();
  const [added, setAdded] = useState<string[]>([]);
  const items = look.items.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);

  const quickAdd = (slug: string) => {
    const p = getProduct(slug)!;
    const v = p.colors[0];
    const size = p.sizes.length === 1 ? p.sizes[0] : p.sizes.find((s) => s === 'M' && v.stock[s] > 0) ?? p.sizes.find((s) => v.stock[s] > 0)!;
    shop.add(slug, v.name, size);
    setAdded((a) => [...a, slug]);
    shop.showToast({ title: `${p.name} (${size}) added`, image: v.images[0], action: { label: 'Bag', to: '/cart' } });
  };

  return (
    <section ref={ref} className="look">
      <div className="look__media">
        <motion.img src={look.image} alt={look.title} style={{ y, scale: 1.2 }} loading="lazy" />
        <div className="look__shade" />
        <div className="look__text">
          <em>
            0{index + 1} / 0{looks.length}
          </em>
          <RevealText className="look__title">{look.title.replace(' ', '\n')}</RevealText>
          <p>{look.subtitle}</p>
        </div>
      </div>
      <div className="look__items">
        {items.map((p, i) => (
          <motion.div key={p.slug} className="look__item" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, ease: EASE.premium, duration: 0.6 }}>
            <Link to={`/product/${p.slug}`}>
              <img src={p.colors[0].images[0]} alt="" loading="lazy" />
              <strong>{p.name}</strong>
              <span>{moneyShort(p.price)}</span>
            </Link>
            <motion.button whileTap={{ scale: 0.85 }} className={`quick ${added.includes(p.slug) ? 'is-on' : ''}`} onClick={() => quickAdd(p.slug)} aria-label={`Quick add ${p.name}`}>
              {added.includes(p.slug) ? <IconCheck size={16} /> : <IconPlus size={16} />}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function Looks() {
  return (
    <>
      <Header />
      <Page>
        <div className="page-head page-head--stack">
          <RevealText as="h1">Lookbook</RevealText>
          <p className="muted">Real people. Everyday looks. Tap + to quick add.</p>
        </div>
        {looks.map((l, i) => (
          <LookBlock key={l.id} look={l} index={i} />
        ))}
        <div className="pad center" style={{ paddingBottom: 32 }}>
          <Link to="/shop" className="btn btn--dark btn--pill">
            Shop All <IconArrow size={16} />
          </Link>
        </div>
        <Footer />
      </Page>
    </>
  );
}
