import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { Header, Page } from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { stagger } from '../components/Motion';
import { IconHeart, IconArrow } from '../components/Icons';
import { useShop } from '../store/ShopContext';

export default function Saved() {
  const { wishlist } = useShop();
  const items = products.filter((p) => wishlist.includes(p.slug));
  return (
    <>
      <Header />
      <Page>
        <div className="page-head">
          <h1>Saved</h1>
          <span className="muted small">{items.length} items</span>
        </div>
        {items.length === 0 ? (
          <div className="empty empty--big">
            <span className="empty__icon">
              <IconHeart size={32} />
            </span>
            <h2>No saved items</h2>
            <p className="muted">Tap the heart on any product to save it for later.</p>
            <Link to="/shop" className="btn btn--dark btn--pill">
              Explore the Shop <IconArrow size={16} />
            </Link>
          </div>
        ) : (
          <motion.div className="grid2 pad" variants={stagger} initial="hidden" animate="visible">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        )}
      </Page>
    </>
  );
}
