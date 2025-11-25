import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod"; 
import { ZodError } from "zod";

export const validate =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return res.status(400).json({ message: "Validação falhou", errors });
      }
      next(err);
    }
  };
