import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/cn';

export function TextLink({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn('font-semibold text-blue underline underline-offset-4 hover:text-wine', className)}
      {...props}
    />
  );
}
