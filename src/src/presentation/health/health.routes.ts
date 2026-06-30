import { Router } from "express";
import { HealthService } from "../../application";
import { HealthController } from "./health.controller";

export const healthRoutes = Router();

const healthService = new HealthService();
const controller = new HealthController(healthService);

healthRoutes.get("/", controller.check);

healthRoutes.get("/pdf", controller.pdf);

healthRoutes.get("/url", controller.url);
