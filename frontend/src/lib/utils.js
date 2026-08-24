import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard className merge helper with tailwind-merge support
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;

