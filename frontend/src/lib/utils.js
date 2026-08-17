/**
 * Lightweight classNames merge helper (Ponytail native - 0 dependencies)
 */
export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ');
}

export default cn;
