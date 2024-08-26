"use client"

import { z } from "zod";

export const formSchema = z.object({
    sqlDiscount: z
    .number({
        required_error: "Sql Fee is required",
        invalid_type_error: "Sql Fee must be a number",
    })
    .int("Power must be an integer")
    .min(0, {
        message: "Power must be atleast 0"
    })
    .max(2000, {
        message: 'Value exceeded max range'
    }),
    halfLife: z
    .number({
        required_error: "Half life is required",
        invalid_type_error: "Half life must be a number",
    })
    .min(0, {
        message: "Half Life must be atleast 0"
    })
    .max(1000, {
        message: 'Value exceeded max range'
    }),
    priceUpdateFactor: z
    .number({
        required_error: "Price update factor is required",
        invalid_type_error: "Value must be a number"
    })
    .min(0, {
        message: "Update factor must be atleast 0"
    })
    .max(1, {
        message: 'Value exceeded max range'
    }),
})

export type ManagePoolFormSchema = z.infer<typeof formSchema>;