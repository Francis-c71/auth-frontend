import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/2_lib/cn';

export function TextLink({ className, ...props }: LinkProps) {
  return (
    <Link className={cn('font-semibold underline-offset-4 text-gradient3 no-underline hover:text-gradient2', className)}{...props}/>
  );
}
