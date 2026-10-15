import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 22): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

const make = (paths: JSX.Element) =>
  function Icon({ size, ...rest }: P) {
    return (
      <svg {...base(size)} {...rest}>
        {paths}
      </svg>
    );
  };

export const IconMenu = make(<><path d="M4 7h16" /><path d="M4 12h12" /><path d="M4 17h16" /></>);
export const IconBag = make(<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>);
export const IconSearch = make(<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>);
export const IconHome = make(<><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /></>);
export const IconShop = make(<><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M9 7V5h6v2" /><path d="M4 12h16" /></>);
export const IconLooks = make(<><path d="M9 4 4 7l2 4 2-1v10h8V10l2 1 2-4-5-3a3 3 0 0 1-6 0Z" /></>);
export const IconHeart = make(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />);
export const IconUser = make(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>);
export const IconBack = make(<path d="M15 5l-7 7 7 7" />);
export const IconChevron = make(<path d="m9 5 7 7-7 7" />);
export const IconDown = make(<path d="m5 9 7 7 7-7" />);
export const IconClose = make(<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>);
export const IconPlus = make(<><path d="M12 5v14" /><path d="M5 12h14" /></>);
export const IconMinus = make(<path d="M5 12h14" />);
export const IconTrash = make(<><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>);
export const IconArrow = make(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
export const IconFilter = make(<><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></>);
export const IconSort = make(<><path d="M7 4v16" /><path d="m3 8 4-4 4 4" /><path d="M17 20V4" /><path d="m13 16 4 4 4-4" /></>);
export const IconShare = make(<><path d="M12 3v13" /><path d="m7 8 5-5 5 5" /><path d="M5 13v7h14v-7" /></>);
export const IconTruck = make(<><path d="M3 6h11v10H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>);
export const IconReturn = make(<><path d="M4 9h11a5 5 0 0 1 0 10H8" /><path d="m8 5-4 4 4 4" /></>);
export const IconLock = make(<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
export const IconShield = make(<><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>);
export const IconTag = make(<><path d="M3 12V4h8l10 10-8 8L3 12Z" /><circle cx="7.5" cy="8.5" r="1.3" /></>);
export const IconRuler = make(<><rect x="2" y="8" width="20" height="8" rx="1" /><path d="M6 8v3M10 8v4M14 8v3M18 8v4" /></>);
export const IconCrown = make(<><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8Z" /></>);
export const IconCheck = make(<path d="m5 12 5 5 9-10" />);
export const IconStar = ({ size = 14, filled = true }: { size?: number; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z"
      fill={filled ? '#f2b01e' : 'none'}
      stroke="#f2b01e"
      strokeWidth="1.4"
    />
  </svg>
);
export const IconBox = make(<><path d="M3 7l9-4 9 4v10l-9 4-9-4V7Z" /><path d="M3 7l9 4 9-4" /><path d="M12 11v10" /></>);
export const IconPin = make(<><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>);
export const IconChat = make(<path d="M4 5h16v11H9l-5 4V5Z" />);
export const IconGift = make(<><rect x="3" y="8" width="18" height="5" /><path d="M5 13v8h14v-8" /><path d="M12 8v13" /><path d="M12 8C10 4 6 5 7.5 8M12 8c2-4 6-3 4.5 0" /></>);
export const IconInstagram = make(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></>);
export const IconTiktok = make(<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.5" />);
