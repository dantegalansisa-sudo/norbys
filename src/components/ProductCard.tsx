import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { moneyShort } from '../data/commerce';
import { useShop } from '../store/ShopContext';
import { IconHeart } from './Icons';
import { rise } from './Motion';

export default function ProductCard({ product, width, animate = true }: { product: Product; width?: number; animate?: boolean }) {
  const { isWished, toggleWish, showToast } = useShop();
  const wished = isWished(product.slug);
  const cover = product.colors[0].images[0];
  const hover = product.colors[0].images[1];

  return (
    <motion.article className="pcard" style={width ? { width, flex: `0 0 ${width}px` } : undefined} variants={animate ? rise : undefined}>
      <Link to={`/product/${product.slug}`} className="pcard__media">
        <img src={cover} alt={`${product.name} in ${product.colors[0].name}`} loading="lazy" />
        {hover && <img className="pcard__alt" src={hover} alt="" loading="lazy" />}
        {product.badge && <span className={`badge badge--${product.badge.toLowerCase().replace(' ', '-')}`}>{product.badge}</span>}
      </Link>
      <motion.button
        whileTap={{ scale: 0.8 }}
        className={`pcard__wish ${wished ? 'is-on' : ''}`}
        aria-label={wished ? `Remove ${product.name} from saved` : `Save ${product.name}`}
        aria-pressed={wished}
        onClick={() => {
          toggleWish(product.slug);
          if (!wished) showToast({ title: 'Saved to your wishlist', image: cover, action: { label: 'View', to: '/saved' } });
        }}
      >
        <IconHeart size={17} fill={wished ? 'currentColor' : 'none'} />
      </motion.button>
      <Link to={`/product/${product.slug}`} className="pcard__info">
        <span className="pcard__name">{product.name}</span>
        <span className="pcard__row">
          <span className="pcard__price">
            {moneyShort(product.price)}
            {product.compareAt && <s>{moneyShort(product.compareAt)}</s>}
          </span>
          <span className="swatches" aria-label={`${product.colors.length} colors`}>
            {product.colors.map((c) => (
              <i key={c.name} style={{ background: c.hex }} title={c.name} />
            ))}
          </span>
        </span>
      </Link>
    </motion.article>
  );
}
