export type Category = 'hoodies' | 'tees' | 'crewnecks' | 'caps';

export interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
  /** units left per size — drives "Only X left" and sold-out states */
  stock: Record<string, number>;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  compareAt?: number;
  badge?: 'New' | 'Best Seller' | 'Limited' | 'Sale';
  rating: number;
  reviews: number;
  description: string;
  details: string[];
  fabric: string;
  fit: string;
  sizes: string[];
  colors: ColorVariant[];
}

const img = (n: string) => `./images/${n}.webp`;

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const full = (n = 12) => Object.fromEntries(APPAREL_SIZES.map((s) => [s, n]));

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'essential-hoodie',
    name: 'Essential Hoodie',
    category: 'hoodies',
    price: 90,
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 320,
    description:
      'Our signature hoodie. Heavyweight 400 GSM cotton fleece, brushed inside for everyday comfort. Clean design. Bolder living.',
    details: ['Embroidered N logo on chest', 'Double-lined hood with flat drawcords', 'Kangaroo pocket', 'Ribbed cuffs & hem', 'Pre-shrunk'],
    fabric: '80% cotton, 20% recycled polyester. Machine wash cold, tumble dry low.',
    fit: 'Relaxed, slightly oversized. Model is 6’1” wearing size L.',
    sizes: APPAREL_SIZES,
    colors: [
      { name: 'Black', hex: '#111111', images: [img('hoodie-black'), img('model-black-hoodie')], stock: { ...full(), XS: 3, XXL: 0 } },
      { name: 'Olive', hex: '#5b6340', images: [img('hoodie-olive'), img('model-olive-hoodie')], stock: { ...full(), M: 2 } },
      { name: 'Heather Grey', hex: '#bdbdbd', images: [img('hoodie-grey'), img('model-grey-hoodie'), img('model-grey-hoodie-cap')], stock: full() },
    ],
  },
  {
    id: 'p2',
    slug: 'core-tee',
    name: 'Core Tee',
    category: 'tees',
    price: 45,
    badge: 'New',
    rating: 4.8,
    reviews: 214,
    description: 'The everyday tee, perfected. 240 GSM combed cotton with a boxy drop-shoulder cut and a screen-printed NORBYS USA logo.',
    details: ['Heavyweight 240 GSM jersey', 'Boxy, drop-shoulder fit', 'Rib-knit crew neck', 'Woven N label at neck'],
    fabric: '100% combed ring-spun cotton. Machine wash cold, hang dry.',
    fit: 'Boxy fit. Size down for a closer fit.',
    sizes: APPAREL_SIZES,
    colors: [
      { name: 'White', hex: '#f4f4f2', images: [img('tee-white'), img('model-white-tee')], stock: full() },
      { name: 'Black', hex: '#111111', images: [img('tee-black'), img('model-woman-black-tee')], stock: { ...full(), S: 1 } },
    ],
  },
  {
    id: 'p3',
    slug: 'classic-cap',
    name: 'Classic Cap',
    category: 'caps',
    price: 35,
    rating: 4.7,
    reviews: 158,
    description: 'Structured six-panel cap with 3D puff-embroidered NORBYS wordmark and adjustable snapback closure.',
    details: ['3D puff embroidery', 'Flat brim', 'Adjustable snapback', 'Side N logo'],
    fabric: '100% cotton twill. Spot clean only.',
    fit: 'One size fits most (adjustable 21.5”–23.5”).',
    sizes: ['One Size'],
    colors: [
      { name: 'Black', hex: '#111111', images: [img('cap-black'), img('model-woman-black-tee'), img('model-black-hoodie')], stock: { 'One Size': 20 } },
      { name: 'White', hex: '#f4f4f2', images: [img('cap-white'), img('model-white-tee')], stock: { 'One Size': 4 } },
    ],
  },
  {
    id: 'p4',
    slug: 'heritage-crewneck',
    name: 'Heritage Crewneck',
    category: 'crewnecks',
    price: 75,
    badge: 'Limited',
    rating: 4.8,
    reviews: 96,
    description: 'A heavyweight crewneck in a warm bone colorway. Brushed fleece, ribbed trims and a tonal NORBYS USA print.',
    details: ['Heavyweight brushed fleece', 'Woven N label at neck', 'Ribbed collar, cuffs and hem'],
    fabric: '80% cotton, 20% polyester. Machine wash cold.',
    fit: 'Relaxed fit. True to size.',
    sizes: APPAREL_SIZES,
    colors: [{ name: 'Bone', hex: '#ece6da', images: [img('crew-bone')], stock: { ...full(5), XL: 0, XXL: 0 } }],
  },
  {
    id: 'p5',
    slug: 'signature-hoodie',
    name: 'Signature Hoodie',
    category: 'hoodies',
    price: 90,
    rating: 4.9,
    reviews: 188,
    description: 'Garment-dyed olive fleece with a cream logo hit. Earthy, washed and built to wear in.',
    details: ['Garment-dyed for a lived-in tone', 'Embroidered logo', 'Kangaroo pocket'],
    fabric: '100% cotton fleece. Machine wash cold, inside out.',
    fit: 'Relaxed fit. Model is 6’1” wearing size L.',
    sizes: APPAREL_SIZES,
    colors: [{ name: 'Olive', hex: '#5b6340', images: [img('model-olive-hoodie'), img('hoodie-olive')], stock: full(8) }],
  },
  {
    id: 'p6',
    slug: 'oversized-hoodie',
    name: 'Oversized Hoodie',
    category: 'hoodies',
    price: 95,
    compareAt: 120,
    badge: 'Sale',
    rating: 4.6,
    reviews: 74,
    description: 'Exaggerated drop shoulders and an extended body for a true oversized silhouette in heather grey.',
    details: ['Extra-long sleeves', 'Dropped shoulders', 'Heavyweight 420 GSM fleece'],
    fabric: '80% cotton, 20% polyester.',
    fit: 'Oversized. Size down for a relaxed fit.',
    sizes: APPAREL_SIZES,
    colors: [{ name: 'Heather Grey', hex: '#bdbdbd', images: [img('model-grey-hoodie'), img('hoodie-grey')], stock: full(6) }],
  },
  {
    id: 'p7',
    slug: 'heavy-tee-black',
    name: 'Heavy Logo Tee',
    category: 'tees',
    price: 50,
    rating: 4.8,
    reviews: 132,
    description: 'Our heaviest tee. 280 GSM with a high-density front print — holds its shape wash after wash.',
    details: ['280 GSM', 'High-density print', 'Boxy cut'],
    fabric: '100% cotton.',
    fit: 'Boxy fit. Model is 5’8” wearing size S.',
    sizes: APPAREL_SIZES,
    colors: [{ name: 'Black', hex: '#111111', images: [img('model-woman-black-tee'), img('tee-black')], stock: full(9) }],
  },
  {
    id: 'p8',
    slug: 'street-cap-white',
    name: 'Street Cap',
    category: 'caps',
    price: 35,
    badge: 'New',
    rating: 4.7,
    reviews: 41,
    description: 'Clean white structured cap with a black puff wordmark. The finishing piece for any fit.',
    details: ['Structured crown', 'Puff embroidery', 'Snapback closure'],
    fabric: '100% cotton twill.',
    fit: 'One size fits most.',
    sizes: ['One Size'],
    colors: [{ name: 'White', hex: '#f4f4f2', images: [img('cap-white'), img('model-white-tee')], stock: { 'One Size': 15 } }],
  },
];

export const categories: { key: Category | 'all'; label: string; image: string }[] = [
  { key: 'hoodies', label: 'Hoodies', image: img('hoodie-black') },
  { key: 'tees', label: 'Tees', image: img('tee-white') },
  { key: 'crewnecks', label: 'Crews', image: img('crew-bone') },
  { key: 'caps', label: 'Caps', image: img('cap-black') },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export interface Look {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  items: string[]; // product slugs
}

export const looks: Look[] = [
  { id: 'l1', title: 'City Essentials', subtitle: 'Modern streetwear for everyday movement.', image: img('model-black-hoodie'), items: ['essential-hoodie', 'classic-cap', 'core-tee'] },
  { id: 'l2', title: 'Minimal Impact', subtitle: 'Less noise. More presence.', image: img('model-woman-black-tee'), items: ['heavy-tee-black', 'classic-cap'] },
  { id: 'l3', title: 'Earth Tones', subtitle: 'Olive fleece, washed and worn in.', image: img('model-olive-hoodie'), items: ['signature-hoodie', 'core-tee', 'street-cap-white'] },
  { id: 'l4', title: 'Off Duty', subtitle: 'Heather grey, built for weekends.', image: img('model-grey-hoodie-cap'), items: ['oversized-hoodie', 'classic-cap', 'heritage-crewneck'] },
];

export interface Review {
  name: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  size: string;
  verified: boolean;
  date: string;
}

export const sampleReviews: Review[] = [
  { name: 'Marcus T.', location: 'Atlanta, GA', rating: 5, title: 'Heavy and clean', body: 'Weight is legit, fits exactly how I wanted. Washed it 5 times and the logo is still perfect.', size: 'L', verified: true, date: 'Sep 28, 2026' },
  { name: 'Jasmine R.', location: 'Miami, FL', rating: 5, title: 'My new favorite', body: 'Ordered a size down for a closer fit and it is perfect. Shipping was super fast.', size: 'S', verified: true, date: 'Sep 19, 2026' },
  { name: 'Kevin L.', location: 'Brooklyn, NY', rating: 4, title: 'Great quality', body: 'Runs a bit big, which I like. Quality feels premium for the price.', size: 'M', verified: true, date: 'Aug 30, 2026' },
];
