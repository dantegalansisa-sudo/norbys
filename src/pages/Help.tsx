import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Footer, Header, Page } from '../components/Layout';
import { FREE_SHIPPING_THRESHOLD, RETURN_WINDOW_DAYS, shippingMethods, money, sizeChart } from '../data/commerce';
import { IconCheck } from '../components/Icons';

const pages: Record<string, { title: string; body: () => JSX.Element }> = {
  shipping: {
    title: 'Shipping',
    body: () => (
      <>
        <p>We ship to all 50 US states, Puerto Rico and APO/FPO/DPO addresses. Orders placed before 1 PM ET ship the same business day.</p>
        <table className="size-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Time</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {shippingMethods.map((m) => (
              <tr key={m.id}>
                <td>{m.label}</td>
                <td>{m.days[0] === m.days[1] ? m.days[0] : `${m.days[0]}–${m.days[1]}`} business days</td>
                <td>{m.id === 'standard' ? `${money(m.price)} · Free $${FREE_SHIPPING_THRESHOLD}+` : money(m.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>You’ll receive a tracking link by email (and SMS if opted in) as soon as your order ships.</p>
      </>
    ),
  },
  returns: {
    title: 'Returns & Exchanges',
    body: () => (
      <>
        <p>
          Not the right fit? Return or exchange unworn items with tags within <b>{RETURN_WINDOW_DAYS} days</b> of delivery. Returns are free for US orders — we email you a prepaid label.
        </p>
        <ol className="steps-list">
          <li>Start your return with your order number and email.</li>
          <li>Print the prepaid label or show the QR code at any UPS Store.</li>
          <li>Refunds go back to the original payment within 5–7 business days of receipt. Exchanges ship free.</li>
        </ol>
        <p className="muted small">Final sale items and caps worn outside cannot be returned.</p>
      </>
    ),
  },
  'size-guide': {
    title: 'Size Guide',
    body: () => (
      <>
        <p>Garment measurements in inches.</p>
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
              <tr key={r[0]}>
                {r.map((c, i) => (
                  <td key={i}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p>Caps: one size fits most, adjustable 21.5”–23.5”.</p>
      </>
    ),
  },
  faq: {
    title: 'Help Center',
    body: () => <Faq />,
  },
  contact: {
    title: 'Contact Us',
    body: () => <Contact />,
  },
  about: {
    title: 'About NORBYS',
    body: () => (
      <>
        <img src="./images/model-grey-hoodie.webp" alt="" className="help-img" />
        <p>
          NORBYS USA is premium streetwear for people who move with intention. Heavyweight fabrics, clean silhouettes and a logo you wear with pride. <b>Clothing. People. A lifestyle.</b>
        </p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    body: () => (
      <>
        <p>We collect the information you give us at checkout (name, email, shipping address, phone) to fulfill your order. Payment details are processed by our PCI-compliant payment provider and never stored on our servers.</p>
        <h3 id="do-not-sell">Your California Privacy Rights (CCPA/CPRA)</h3>
        <p>California residents may request access to or deletion of their personal information, and may opt out of the “sale” or “sharing” of personal information for targeted advertising. We honor Global Privacy Control (GPC) signals.</p>
        <OptOut />
        <p className="muted small">Demo content — final policy to be provided by the client’s legal counsel.</p>
      </>
    ),
  },
  terms: {
    title: 'Terms of Service',
    body: () => <p>By using this site you agree to our terms of sale, including pricing, availability, shipping and return policies. Prices are in US dollars. Applicable sales tax is calculated at checkout based on your shipping address. Demo content — final terms provided by the client.</p>,
  },
  accessibility: {
    title: 'Accessibility',
    body: () => (
      <p>
        NORBYS is committed to making our store accessible to everyone, aligned with WCAG 2.1 AA guidelines (ADA). If you have trouble using any part of the site, contact <b>access@norbys.com</b> and we’ll help you complete your order.
      </p>
    ),
  },
};

function Faq() {
  const qs = [
    ['When will my order ship?', 'Orders placed before 1 PM ET ship the same business day. Standard delivery takes 3–5 business days.'],
    ['Do you offer free shipping?', `Yes — free standard shipping on all US orders over $${FREE_SHIPPING_THRESHOLD}.`],
    ['How do returns work?', `Free returns and exchanges within ${RETURN_WINDOW_DAYS} days. We email you a prepaid label.`],
    ['Can I pay in installments?', 'Yes. Choose Klarna or Afterpay at checkout to split your purchase into 4 interest-free payments.'],
    ['Do you ship internationally?', 'Currently we ship within the United States, including APO/FPO addresses.'],
    ['How do NORBYS Rewards work?', 'Earn 1 point per $1 spent. Every 500 points = $10 off. Members get early access to drops.'],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {qs.map(([q, a], i) => (
        <div key={q} className="acc">
          <button className="acc__head" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            {q}
            <span className="acc__plus" style={{ transform: open === i ? 'rotate(45deg)' : undefined }}>
              +
            </span>
          </button>
          {open === i && <div className="acc__inner">{a}</div>}
        </div>
      ))}
    </div>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return sent ? (
    <p className="ok-msg">
      <IconCheck size={18} /> Thanks! We reply within 24 hours (Mon–Fri, 9–6 ET).
    </p>
  ) : (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <p>Chat, email or text — our team is here Mon–Fri, 9 AM–6 PM ET.</p>
      <label className="field has-value">
        <input required placeholder="Your name" />
        <span>Name</span>
      </label>
      <label className="field has-value">
        <input required type="email" placeholder="you@email.com" />
        <span>Email</span>
      </label>
      <label className="field has-value">
        <input placeholder="NB123456 (optional)" />
        <span>Order number</span>
      </label>
      <label className="field field--area has-value">
        <textarea required rows={4} placeholder="How can we help?" />
        <span>Message</span>
      </label>
      <button className="btn btn--dark btn--lg">Send message</button>
    </form>
  );
}

function OptOut() {
  const [done, setDone] = useState(false);
  return done ? (
    <p className="ok-msg">
      <IconCheck size={18} /> Your opt-out preference has been saved.
    </p>
  ) : (
    <button className="btn btn--ghost" onClick={() => setDone(true)}>
      Do Not Sell or Share My Personal Information
    </button>
  );
}

export default function Help() {
  const { slug = 'faq' } = useParams();
  const page = pages[slug] ?? pages.faq;
  return (
    <>
      <Header back title={page.title} />
      <Page className="help">
        <div className="pad prose">{page.body()}</div>
        <div className="pad help-links">
          {Object.entries(pages)
            .filter(([k]) => k !== slug)
            .slice(0, 5)
            .map(([k, p]) => (
              <Link key={k} to={`/help/${k}`} className="chip">
                {p.title}
              </Link>
            ))}
        </div>
        <Footer />
      </Page>
    </>
  );
}
