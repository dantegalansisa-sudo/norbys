import { motion } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Header, Page } from '../components/Layout';
import { IconCheck, IconCrown, IconArrow, IconBox, IconTruck, IconHome } from '../components/Icons';
import { useShop } from '../store/ShopContext';
import { money } from '../data/commerce';
import { EASE } from '../components/Motion';

export default function OrderPage() {
  const { number } = useParams();
  const { orders, points } = useShop();
  const order = orders.find((o) => o.number === number);
  if (!order) return <Navigate to="/account?tab=orders" replace />;

  const placedToday = new Date(order.createdAt).toDateString() === new Date().toDateString();
  const timeline = [
    { icon: IconCheck, label: 'Order confirmed', sub: new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }), done: true },
    { icon: IconBox, label: 'Preparing your order', sub: 'Ships within 1 business day', done: !placedToday },
    { icon: IconTruck, label: 'Shipped', sub: order.shippingLabel, done: false },
    { icon: IconHome, label: 'Delivered', sub: `Estimated ${order.delivery}`, done: false },
  ];

  return (
    <>
      <Header title="Order Confirmed" />
      <Page className="order">
        <div className="order__hero">
          <motion.div className="order__check" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}>
            <IconCheck size={34} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ease: EASE.premium, duration: 0.7 }}>
            Thank you, {order.name.split(' ')[0]}!
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Order <b>#{order.number}</b> is confirmed. A receipt was sent to <b>{order.email}</b>.
          </motion.p>
        </div>

        <div className="pad">
          <div className="card">
            <p className="label">Order status</p>
            <ol className="timeline">
              {timeline.map((t, i) => (
                <motion.li key={t.label} className={t.done ? 'is-done' : ''} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                  <span className="timeline__dot">
                    <t.icon size={15} />
                  </span>
                  <div>
                    <strong>{t.label}</strong>
                    <span>{t.sub}</span>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="card">
            <p className="label">Items</p>
            {order.lines.map((l, i) => (
              <div key={i} className="co-line">
                <span className="co-line__img">
                  <img src={l.image} alt="" />
                  <b>{l.qty}</b>
                </span>
                <div>
                  <strong>{l.name}</strong>
                  <span className="muted small">
                    {l.color} / {l.size}
                  </span>
                </div>
                <span>{money(l.price * l.qty)}</span>
              </div>
            ))}
            <dl className="totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{money(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="totals__disc">
                  <dt>Discount</dt>
                  <dd>−{money(order.discount)}</dd>
                </div>
              )}
              <div>
                <dt>Shipping</dt>
                <dd>{order.shipping === 0 ? 'FREE' : money(order.shipping)}</dd>
              </div>
              <div>
                <dt>Sales tax</dt>
                <dd>{money(order.tax)}</dd>
              </div>
              <div className="totals__total">
                <dt>Total</dt>
                <dd>{money(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="card details-grid">
            <div>
              <span>Shipping to</span>
              <p>
                {order.name}
                <br />
                {order.address}
              </p>
            </div>
            <div>
              <span>Delivery</span>
              <p>{order.shippingLabel}</p>
            </div>
            <div>
              <span>Payment</span>
              <p>{order.payment}</p>
            </div>
          </div>

          <div className="rewards">
            <IconCrown size={28} />
            <div>
              <strong>+{order.points} points earned</strong>
              <span>Balance: {points} pts · 500 pts = $10 off</span>
            </div>
          </div>

          <Link to="/shop" className="btn btn--dark btn--lg">
            Continue Shopping <IconArrow size={17} />
          </Link>
          <p className="muted small center" style={{ marginTop: 14 }}>
            Need help? Changes can be made within 1 hour. <Link to="/help/contact">Contact us</Link>
          </p>
        </div>
      </Page>
    </>
  );
}
