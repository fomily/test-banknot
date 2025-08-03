import React from 'react';
import styles from './Icon.module.css';

// Импортируем SVG как строки
import creditSvg from '../../assets/icons/credit.svg';
import qrSvg from '../../assets/icons/qr.svg';
import incomeSvg from '../../assets/icons/income.svg';

// Типы доступных иконок
export type IconName = 'credit' | 'qr' | 'income';

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

// Объект для маппинга имен иконок на компоненты
const iconComponents: Record<IconName, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  credit: CreditIcon,
  qr: QrIcon,
  income: IncomeIcon,
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
