import { Router, Request, Response, NextFunction } from "express";
import {
  DateParamSchema,
  ReactorParamSchema,
} from "../../middlewares/validation.js";
import { makeTelemetryUseCases } from "../../main/factories/makeTelemetryUseCases.js";
import type { ReactorId } from "../../domain/entities/oee.js";

const router = Router();

router.get("/dates", (_req, res, next) => {
  try {
    res.json({ dates: makeTelemetryUseCases().getAvailableDates.execute() });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:date/:reator",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = DateParamSchema.parse(req.params);
      const { reator } = ReactorParamSchema.parse(req.params);
      const series = makeTelemetryUseCases().getClassifiedTelemetry.execute({
        date,
        reator: reator as ReactorId,
      });

      res.json({ data: date, reator, total_minutes: series.length, series });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
