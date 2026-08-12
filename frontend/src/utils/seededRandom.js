/**
 * Seeded random number generator.
 * Uses a MurmurHash3-inspired hash to convert a string into a seed,
 * then uses a mulberry32 PRNG for deterministic random sequences.
 */

/**
 * Hash a string into a 32-bit integer seed.
 * @param {string} str - The input string (e.g., player name).
 * @returns {number} A 32-bit integer seed.
 */
export function hashString(str) {
  let h = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193); // FNV prime
  }
  // Mix bits for better distribution
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0; // Ensure unsigned
}

/**
 * Create a seeded random number generator (mulberry32).
 * @param {string} seedString - A string to derive the seed from.
 * @returns {Function} A function that returns a random float in [0, 1) each call.
 */
export function createSeededRandom(seedString) {
  let seed = hashString(seedString);

  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a random float in [min, max) using a seeded RNG.
 * @param {Function} rng - The seeded random function.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function seededRange(rng, min, max) {
  return min + rng() * (max - min);
}

/**
 * Pick a random item from an array using a seeded RNG.
 * @param {Function} rng - The seeded random function.
 * @param {Array} arr - The array to pick from.
 * @returns {*}
 */
export function seededPick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}
