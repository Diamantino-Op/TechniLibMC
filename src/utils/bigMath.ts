/**
 * @LICENSE BSD-2-Clause
 * @AUTHORS Diamantino
 */

/**
 * Math.min function for BigInts.
 */
export function bigMin(...bigInts: bigint[]): bigint {
  let min = bigInts[0];

  bigInts.forEach((a) => {
    if (a < min) {
      min = a;
    }
  });

  return min;
}

/**
 * Math.max function for BigInts.
 */
export function bigMax(...bigInts: bigint[]): bigint {
  let max = bigInts[0];

  bigInts.forEach((a) => {
    if (a > max) {
      max = a;
    }
  });

  return max;
}
