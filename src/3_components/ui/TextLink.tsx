import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/2_lib/cn';

export function TextLink({ className, ...props }: LinkProps) {
  return (
    <Link className={cn('text-lg font-bold underline-offset-4 text-amber no-underline hover:text-gold', className)}{...props}/>
  );
}
