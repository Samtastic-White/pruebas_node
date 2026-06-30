import type { Request, Response } from "express";
import type { HealthService } from "../../application";
import { htmlToPDF, urlToPDF } from "../../infrastructure";

export class HealthController {
	constructor(private readonly healthService: HealthService) {
	}

	static moduleName = "health";

	check =	async (_req: Request, res: Response): Promise<void> => {
			const health = await this.healthService.check();
			res.json(health);
		};

	pdf = async (_req: Request, res: Response): Promise<void> => {
			const data = await htmlToPDF();
			res.setHeader("Content-Type", "application/pdf");
			res.send(Buffer.from(data));
		};

	url = async (_req: Request, res: Response): Promise<void> => {
			const data = await urlToPDF();
			res.setHeader("Content-Type", "application/pdf");
			res.send(Buffer.from(data));
		};
}
