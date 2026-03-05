import { Link } from 'react-router-dom';
import iouLogo from '@/assets/iou-logo.png';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
}

const Logo = ({ variant = 'default', size = 'md', linkTo = '/' }: LogoProps) => {
  const logoSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  const textColor = variant === 'white' ? 'text-white' : 'text-primary';
  const subtitleColor = variant === 'white' ? 'text-white/70' : 'text-muted-foreground';

  const content = (
    <div className="flex items-center gap-2.5">
      <img src={iouLogo} alt="IOU Logo" className={logoSizes[size]} />
      <div className="flex flex-col">
        <span className={`font-heading font-bold leading-tight ${textSizes[size]} ${textColor}`}>
          Sulu
        </span>
        <span className={`${subtitleSizes[size]} ${subtitleColor} leading-tight`}>
          IOU Indonesia
        </span>
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};

export default Logo;
