import { readFile } from "node:fs/promises";
import path from "node:path";
import { http } from "../../common";
import { envs } from "../config";

export const htmlToPDF = async (): Promise<ArrayBuffer> => {
	const htmlFilePath = path.join(__dirname, "templates", "test.html");
	const htmlContent = await readFile(htmlFilePath, "utf-8");
	const form = new FormData();
	form.append(
		"files",
		new Blob([htmlContent], { type: "text/html" }),
		"index.html",
	);
	const response = await http.post<ArrayBuffer>(
		`${envs.GOTENBERG_URL}/forms/chromium/convert/html`,
		form,
		undefined,
		"arrayBuffer",
	);
	return response.data;
};

export const urlToPDF = async (): Promise<ArrayBuffer> => {
	const form = new FormData();
	form.append("url", "https://gotenberg.dev");
	const response = await http.post<ArrayBuffer>(
		`${envs.GOTENBERG_URL}/forms/chromium/convert/url`,
		form,
		undefined,
		"arrayBuffer",
	);
	return response.data;
};
