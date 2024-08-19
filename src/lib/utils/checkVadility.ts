import { z } from "zod";

export function isEmpty(input: string | number): boolean {
  if (input === "" || input === "0" || input === 0) {
    return true;
  }
  return false;
}

export function isValidPositive(num: string): boolean {
  // Regex for Whole Numbers. x => {x: [0, ]}
  const reg = /^(100|[1-9]?\d)$/;
  return reg.test(num);
}

export function isValidPositiveNumber(num: string): boolean {
  const isPositive = z.number().positive();
  return isPositive.safeParse(parseFloat(num)).success;
  // Regex for Positive Numbers greater than 0, including decimals
  const reg = /^(?!0(\.0+)?$)\d+(\.\d+)?$/;
  return reg.test(num);
}

export function isValidAddress(addr: string): boolean {
  const reg = /^0x[0-9a-fA-F]+/;
  return reg.test(addr);
}

// export function isInRange(min: number, max: number, num: string): boolean {
//   const reg = new RegExp(`(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2}|1[0-9]{3}|2000)$`);
//   return reg.test(num);
// }