# NORBYS USA — Demo de tienda online (mobile-first)

Demo de e-commerce para **NORBYS USA**, marca de streetwear (hoodies, tees, crewnecks y caps) que vende en Estados Unidos. Está pensada para el móvil. En escritorio se muestra como una columna centrada del tamaño de un teléfono.

**Stack:** React 18 + TypeScript + Vite + Framer Motion + React Router (HashRouter, se despliega en cualquier hosting estático).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
npm run deploy   # publica en GitHub Pages
```

**Demo en vivo:** https://dantegalansisa-sudo.github.io/norbys/

## Flujo de compra (estándar de EE. UU.)

1. **Producto:** galería deslizable, colores, tallas con agotados, aviso de "Only X left", guía de tallas en pulgadas, Klarna/Afterpay en 4 pagos, fecha estimada de entrega por ZIP, reseñas verificadas y "Complete the Look".
2. **Añadir a la bolsa:** hoja de confirmación, barra de progreso hacia el envío gratis ($100+) y venta adicional.
3. **Bolsa:** cantidades, "Save for later", códigos promo (`NORBYS10`, `WELCOME15`, `FREESHIP`), impuesto estimado y express checkout (Apple Pay, Shop Pay, PayPal).
4. **Checkout en 3 pasos**, sin distracciones y como invitado:
   - *Information:* email con opt-in de marketing, dirección de EE. UU. (los 50 estados + DC, ZIP de 5 dígitos), teléfono y opt-in de SMS con el texto de consentimiento que exige la TCPA.
   - *Shipping:* Standard (gratis desde $100), Express y Overnight, con fechas en días hábiles.
   - *Payment:* tarjeta (detecta la marca y valida con Luhn), PayPal, Afterpay y Klarna. Sales tax calculado según el estado.
5. **Confirmación:** número de pedido, timeline de seguimiento, resumen y puntos de recompensa ganados.

> Modo demo: botón **"Fill demo details"** y tarjeta de prueba **4242 4242 4242 4242**. No se procesa ningún pago real.

## Otras funcionalidades

- Home con hero animado, categorías, tendencias, editorial con parallax, lookbook comprable y newsletter (15% de descuento).
- Catálogo con filtros (color, talla, precio) y orden.
- Lookbook con "quick add".
- Favoritos, cuenta con NORBYS Rewards (niveles y puntos) e historial de pedidos.
- Buscador y menú lateral.
- Cumplimiento legal de EE. UU.: banner de cookies, enlace "Do Not Sell or Share" (CCPA/CPRA), páginas de privacidad, términos, accesibilidad (ADA/WCAG), envíos, devoluciones de 30 días, FAQ y contacto.
- Respeta `prefers-reduced-motion`. El carrito, los favoritos y los pedidos se guardan en `localStorage`.

## Para producción (siguiente fase)

| Necesidad | Recomendación |
|---|---|
| Plataforma / pagos | **Shopify** (Storefront API + Shopify Payments: Apple Pay, Shop Pay, PayPal, Klarna y Afterpay integrados) o **Stripe** (Payment Element + Stripe Tax) |
| Sales tax | Shopify Tax / Stripe Tax / TaxJar (nexus por estado) |
| Envíos y etiquetas | ShipStation / Shippo (USPS, UPS, FedEx) |
| Devoluciones | Loop Returns / AfterShip Returns |
| Reseñas | Judge.me / Okendo / Yotpo |
| Email y SMS | Klaviyo (TCPA y opt-in doble) |
| Analítica | GA4 + Meta Pixel / Conversions API + TikTok Pixel |

## Estructura

```
src/
  data/       productos, lookbook, reglas comerciales de EE. UU. (impuestos, envíos, promos)
  store/      estado global (bolsa, favoritos, pedidos, toasts)
  components/ layout, tarjetas, bottom sheets, iconos, utilidades de animación
  pages/      Home, Shop, Product, Cart, Checkout, Order, Looks, Saved, Account, Help
public/images imágenes optimizadas en WebP (de ~34 MB a 0.8 MB)
design-reference/ concepto visual original
```
