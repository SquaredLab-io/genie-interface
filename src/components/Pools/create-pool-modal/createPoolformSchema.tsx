"use client"

import { z } from "zod";

export const formSchema = z.object({
    initialLiquidity: z
        .number({
            required_error: "Initial Liquidity is required",
            invalid_type_error: "Initial liquidity must be a number",
        })
        .min(0, {
            message: "Value must be atleast 0"
        })
        .max(1, {
            message: 'Value exceeded max range'
        }),
    power: z
    .number({
        required_error: "Power is required",
        invalid_type_error: "Power must be a number",
    })
    .int("Power must be an integer")
    .min(2, {
        message: "Power must be atleast 2"
    })
    .max(32, {
        message: 'Value exceeded max range'
    }),
    sqlFee: z
    .number({
        required_error: "Sql Fee is required",
        invalid_type_error: "Sql Fee must be a number",
    })
    .min(2, {
        message: "Power must be atleast 2"
    })
    .max(32, {
        message: 'Value exceeded max range'
    }),
    halfLife: z
    .number({
        required_error: "Half life is required",
        invalid_type_error: "Half life must be a number",
    })
    .min(0, {
        message: "Half Life must be atleast 2"
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

export type CreatePoolFormSchema = z.infer<typeof formSchema>;