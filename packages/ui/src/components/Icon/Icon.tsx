import React from 'react';
import styles from './Icon.module.css';

// Импортируем SVG как строки
import creditSvg from '../../assets/icons/credit.svg';
import qrSvg from '../../assets/icons/qr.svg';
import incomeSvg from '../../assets/icons/income.svg';

// Типы доступных иконок
export type IconName = 'credit' | 'qr' | 'income' | 'link' | 'card' | 'gift' | 'home' | 'chart' | 'profile' | 'star' | 'trending-up';

// Компоненты иконок
const CreditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="6" y="12" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="6" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="22" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="22" r="1.5" fill="currentColor"/>
    <circle cx="20" cy="22" r="1.5" fill="currentColor"/>
  </svg>
);

const QrIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="8" y="8" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="12" y="12" width="4" height="4" fill="currentColor"/>
    <rect x="20" y="12" width="4" height="4" fill="currentColor"/>
    <rect x="12" y="20" width="4" height="4" fill="currentColor"/>
    <rect x="20" y="20" width="4" height="4" fill="currentColor"/>
    <rect x="16" y="16" width="4" height="4" fill="currentColor"/>
  </svg>
);

const IncomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18 6L30 18H22V30H14V18H6L18 6Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 24H24" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15 21L21 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 9H27V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 15L27 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="9" y="19" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="10" width="28" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="8" width="28" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="8" y="20" width="4" height="2" fill="currentColor"/>
    <rect x="14" y="20" width="4" height="2" fill="currentColor"/>
  </svg>
);

const GiftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="6" y="14" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 18H30" stroke="currentColor" strokeWidth="2"/>
    <path d="M18 14V30" stroke="currentColor" strokeWidth="2"/>
    <path d="M14 14C14 10 16 8 18 8C20 8 22 10 22 14" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="14" cy="12" r="1" fill="currentColor"/>
    <circle cx="22" cy="12" r="1" fill="currentColor"/>
  </svg>
);

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 14L18 4L30 14V28C30 29.1 29.1 30 28 30H8C6.9 30 6 29.1 6 28V14Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M14 30V20H22V30" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 30L18 18L24 24L30 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="30" r="2" fill="currentColor"/>
    <circle cx="18" cy="18" r="2" fill="currentColor"/>
    <circle cx="24" cy="24" r="2" fill="currentColor"/>
    <circle cx="30" cy="12" r="2" fill="currentColor"/>
  </svg>
);

const ProfileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="18" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M6 30C6 24 11 20 18 20C25 20 30 24 30 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18 4L22 14H32L24 20L28 30L18 24L8 30L12 20L4 14H14L18 4Z" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 24L14 16L20 22L30 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6H30V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Объект для маппинга имен иконок на компоненты
const iconComponents: Record<IconName, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  credit: CreditIcon,
  qr: QrIcon,
  income: IncomeIcon,
  link: LinkIcon,
  card: CardIcon,
  gift: GiftIcon,
  home: HomeIcon,
  chart: ChartIcon,
  profile: ProfileIcon,
  star: StarIcon,
  'trending-up': TrendingUpIcon,
};

export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'width' | 'height'> {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, className, ...rest }) => {
  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      className={`${styles.icon} ${className || ''}`}
      {...rest}
    />
  );
};
