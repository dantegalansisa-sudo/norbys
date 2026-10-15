import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

export const EASE = {
  premium: [0.76, 0, 0.24, 1] as const,
  smooth: [0.25, 0.8, 0.25, 1] as const,
  snappy: [0.4, 0, 0.2, 1] as const,
};

/** Word-by-word mask reveal for headlines. */
export function RevealText({
  children,
  className = '',
  delay = 0,
  as: Tag = 'h2',
}: {
  children: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}) {
  const lines = children.split('\n');
  let idx = 0;
  return (
    <Tag className={`reveal ${className}`} aria-label={children.replace('\n', ' ')}>
      {lines.map((line, li) => (
        <span className="reveal__line" key={li} aria-hidden="true">
          {line.split(' ').map((w) => {
            const i = idx++;
            return (
              <span className="reveal__mask" key={i}>
                <motion.span
                  style={{ display: 'inline-block' }}
                  initial={{ y: '110%', rotate: 3 }}
                  whileInView={{ y: '0%', rotate: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.85, delay: delay + i * 0.06, ease: EASE.premium }}
                >
                  {w}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/** Image that drifts against scroll inside a rounded mask. */
export function ParallaxImage({ src, alt, className = '', distance = 40 }: { src: string; alt: string; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  return (
    <div ref={ref} className={`parallax ${className}`}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1.18 }} loading="lazy" />
    </div>
  );
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.premium } },
};

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: EASE.premium }}
    >
      {children}
    </motion.div>
  );
}

export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE.smooth } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};
