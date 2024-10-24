"use client";

import { z } from "zod";

export const formSchema = z.object({
  burnQuantity: z
    .number({
      required_error: "Burn NFT percentage is required",
      invalid_type_error: "NFT Burn percentage must be a number"
    })
    .min(0, {
      message: "Please enter a number greater than 0."
    })
    .max(100, {
      message: "Number greater than 100 is not allowed."
    })
});

export type BurnNftBurnFormSchema = z.infer<typeof formSchema>;
