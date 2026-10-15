import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { Footer, Header, Page } from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Sheet from '../components/Sheet';
import { IconFilter, IconSort, IconCheck } from '../components/Icons';
import { stagger } from '../components/Motion';

const chips = [
  { key: 'all', label: 'All' },
  { key: 'hoodies', label: 'Hoodies' },
  { key: 'tees', label: 'Tees' },
  { key: 'crewnecks', label: 'Crews' },
  { key: 'caps', label: 'Caps' },
  { key: 'sale', label: 'Sale' },
];

const sorts = [
  { key: 'featured', label: 'Featured' },
  { key: 'new', label: 'Newest' },
  { key: 'best', label: 'Best Selling' },
  { key: 'low', label: 'Price: Low to High' },
  { key: 'high', label: 'Price: High to Low' },
];

const allColors = Array.from(new Map(products.flatMap((p) => p.colors.map((c) => [c.name, c.hex] as const))).entries());
const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('c') ?? 'all';
  const sort = params.get('sort') ?? 'featured';
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(150);

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v === 'all' || v === 'featured') next.delete(k);
    else next.set(k, v);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    let l = products.filter((p) => (cat === 'all' ? true : cat === 'sale' ? !!p.compareAt : p.category === cat));
    if (colors.length) l = l.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    if (sizes.length) l = l.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    l = l.filter((p) => p.price <= maxPrice);
    const sorted = [...l];
    if (sort === 'low') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'high') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'best') sorted.sort((a, b) => b.reviews - a.reviews);
    if (sort === 'new') sorted.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
    return sorted;
  }, [cat, sort, colors, sizes, maxPrice]);

  const activeFilters = colors.length + sizes.length + (maxPrice < 150 ? 1 : 0);
  const toggle = (arr: string[], v: string, fn: (a: string[]) => void) => fn(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <>
      <Header />
      <Page>
        <div className="page-head">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            Shop
          </motion.h1>
          <span className="muted small">{list.length} items</span>
        </div>
        <div className="chips chips--scroll" role="tablist">
          {chips.map((c) => (
            <button key={c.key} role="tab" aria-selected={cat === c.key} className={`chip ${cat === c.key ? 'is-on' : ''}`} onClick={() => set('c', c.key)}>
              {cat === c.key && <motion.span layoutId="chip-bg" className="chip__bg" transition={{ type: 'spring', stiffness: 450, damping: 34 }} />}
              <span>{c.label}</span>
            </button>
          ))}
        </div>
        <div className="toolbar">
          <button className="tool" onClick={() => setFilterOpen(true)}>
            <IconFilter size={18} /> Filter {activeFilters > 0 && <b className="tool__n">{activeFilters}</b>}
          </button>
          <button className="tool" onClick={() => setSortOpen(true)}>
            <IconSort size={18} /> {sorts.find((s) => s.key === sort)?.label}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={cat + sort + activeFilters} className="grid2 pad" variants={stagger} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </AnimatePresence>
        {list.length === 0 && (
          <div className="empty">
            <p>No products match these filters.</p>
            <button
              className="btn btn--dark btn--sm"
              onClick={() => {
                setColors([]);
                setSizes([]);
                setMaxPrice(150);
                set('c', 'all');
              }}
            >
              Clear all
            </button>
          </div>
        )}
        <Footer />
      </Page>

      <Sheet open={sortOpen} onClose={() => setSortOpen(false)} title="Sort by">
        <ul className="options">
          {sorts.map((s) => (
            <li key={s.key}>
              <button
                className={sort === s.key ? 'is-on' : ''}
                onClick={() => {
                  set('sort', s.key);
                  setSortOpen(false);
                }}
              >
                {s.label}
                {sort === s.key && <IconCheck size={18} />}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>

      <Sheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter"
        footer={
          <div className="row gap">
            <button
              className="btn btn--ghost grow"
              onClick={() => {
                setColors([]);
                setSizes([]);
                setMaxPrice(150);
              }}
            >
              Clear
            </button>
            <button className="btn btn--dark grow" onClick={() => setFilterOpen(false)}>
              Show {list.length} results
            </button>
          </div>
        }
      >
        <p className="label">Color</p>
        <div className="color-filter">
          {allColors.map(([name, hex]) => (
            <button key={name} className={`cf ${colors.includes(name) ? 'is-on' : ''}`} onClick={() => toggle(colors, name, setColors)}>
              <i style={{ background: hex }} />
              {name}
            </button>
          ))}
        </div>
        <p className="label">Size</p>
        <div className="size-grid size-grid--wrap">
          {allSizes.map((s) => (
            <button key={s} className={`size ${sizes.includes(s) ? 'is-on' : ''}`} onClick={() => toggle(sizes, s, setSizes)}>
              {s}
            </button>
          ))}
        </div>
        <p className="label">
          Max price <b>${maxPrice}</b>
        </p>
        <input className="range" type="range" min={30} max={150} step={5} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} aria-label="Maximum price" />
      </Sheet>
    </>
  );
}
