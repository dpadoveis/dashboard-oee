import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createTables, initDb } from "./database/db.js";
import { errorHandler } from "./middlewares/validation.js";
import oeeRoutes from "./infrastructure/http/oeeRoutes.js";
import productionRoutes from "./infrastructure/http/productionRoutes.js";
import telemetryRoutes from "./infrastructure/http/telemetryRoutes.js";

const PORT = process.env.PORT ?? 3001;

async function bootstrap() {
  await initDb();
  createTables();
  console.log("[server] Banco inicializado.");

  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use("/api/oee", oeeRoutes);
  app.use("/api/telemetry", telemetryRoutes);
  app.use("/api/production", productionRoutes);

  app.get("/health", (_req, res) =>
    res.json({ status: "ok", timestamp: new Date().toISOString() }),
  );
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`[server] MES Backend em http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
