import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMilliUnits (amount: number) {
  return amount / 1000;
}

export function convertAmountToMilliUnits (amount: number) {
  return Math.round(amount * 1000);
}
