import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";

export const DateRangeSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "startDate deve ser YYYY-MM-DD")
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "endDate deve ser YYYY-MM-DD")
    .optional(),
});

export const ReactorFilterSchema = DateRangeSchema.extend({
  reator: z.enum(["R1", "R2"]).optional(),
});

export const DateParamSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date deve ser YYYY-MM-DD"),
});

export const ReactorParamSchema = z.object({
  reator: z.enum(["R1", "R2"]),
});

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Parâmetros inválidos",
      details: err.errors.map((e) => ({
        campo: e.path.join("."),
        mensagem: e.message,
      })),
    });
    return;
  }
  console.error("[ERROR]", err);
  res.status(500).json({ error: "Erro interno do servidor" });
}
