import { Router } from "express";
import { ReactorFilterSchema } from "../../middlewares/validation.js";
import { makeProductionUseCases } from "../../main/factories/makeProductionUseCases.js";
import type { ReactorId } from "../../domain/entities/oee.js";

const router = Router();

router.get("/bags", (req, res, next) => {
  try {
    const { startDate, endDate, reator } = ReactorFilterSchema.parse(req.query);
    const bags = makeProductionUseCases().getBags.execute({
      startDate,
      endDate,
      reator: reator as ReactorId | undefined,
    });
    res.json({
      total_bags: bags.length,
      total_kg: bags.reduce((sum, bag) => sum + bag.peso_bag, 0),
      bags,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/stats", (req, res, next) => {
  try {
    const { startDate, endDate } = ReactorFilterSchema.parse(req.query);
    res.json(
      makeProductionUseCases().getProductionStats.execute({
        startDate,
        endDate,
      }),
    );
  } catch (err) {
    next(err);
  }
});

router.get("/daily", (req, res, next) => {
  try {
    const { startDate, endDate } = ReactorFilterSchema.parse(req.query);
    res.json(
      makeProductionUseCases().getDailyProduction.execute({
        startDate,
        endDate,
      }),
    );
  } catch (err) {
    next(err);
  }
});

export default router;
