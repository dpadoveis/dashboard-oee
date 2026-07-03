import { Router, Request, Response, NextFunction } from "express";
import {
  DateParamSchema,
  DateRangeSchema,
  ReactorParamSchema,
} from "../../middlewares/validation.js";
import { makeOeeUseCases } from "../../main/factories/makeOeeUseCases.js";
import type { ReactorId } from "../../domain/entities/oee.js";

const router = Router();

router.get("/summary", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = DateRangeSchema.parse(req.query);
    res.json(makeOeeUseCases().getOeeSummary.execute({ startDate, endDate }));
  } catch (err) {
    next(err);
  }
});

router.get("/daily", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = DateRangeSchema.parse(req.query);
    res.json(makeOeeUseCases().getOeeDaily.execute({ startDate, endDate }));
  } catch (err) {
    next(err);
  }
});

router.post("/process", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, reator, dryRun } = req.body as {
      date?: string;
      reator?: ReactorId;
      dryRun?: boolean;
    };

    const useCases = makeOeeUseCases();
    if (date && reator) {
      DateParamSchema.parse({ date });
      ReactorParamSchema.parse({ reator });
      const result = useCases.processOeeDay.execute({
        date,
        reator,
        dryRun: dryRun ?? false,
      });
      res.json({ processed: 1, results: [result] });
      return;
    }

    const results = useCases.processAllOee.execute({
      dryRun: dryRun ?? false,
    });
    res.json({ processed: results.length, results });
  } catch (err) {
    next(err);
  }
});

export default router;
