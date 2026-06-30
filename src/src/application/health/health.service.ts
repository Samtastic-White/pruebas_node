import { db, envs } from "../../infrastructure";

export class HealthService {

	async check() {
		return {
			status: "ok",
			timestamp: new Date().toString(),
			uptime: process.uptime(),
		};
	}
}
