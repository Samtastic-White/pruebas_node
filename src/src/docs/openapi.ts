import type { ApiReferenceConfiguration } from "@scalar/express-api-reference";
import { version } from "node:os";
import { title } from "node:process";
import { email } from "zod";

export const openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Marathon API',
        version: '1.0.0',
        description: 'API de gestión de eventos deportivos Marathon'
        contact: {
            name: 'Marathon Teams',
            email: 'admin'
        }
    }
}




import type { ApiReferenceConfiguration } from "@scalar/express-api-reference";
import { serverMessage } from "../common";
import { envs } from "../infrastructure";

export const openApiSpec = {
	components: {
		responses: {
			AuthorizationError: {
				content: {
					"application/json": {
						example: {
							data: null,
							error: {
								code: serverMessage.EXPIRED_BEARER_TOKEN.code,
								description: serverMessage.EXPIRED_BEARER_TOKEN.description,
								message: serverMessage.EXPIRED_BEARER_TOKEN.message,
								type: serverMessage.EXPIRED_BEARER_TOKEN.type,
							},
							status: false,
						},
						schema: {
							$ref: "#/components/schemas/ErrorResponse",
						},
					},
				},
				description: serverMessage.EXPIRED_BEARER_TOKEN.message,
			},
			ForbiddenError: {
				content: {
					"application/json": {
						example: {
							data: null,
							error: {
								code: serverMessage.INVALID_BEARER_TOKEN.code,
								description: serverMessage.INVALID_BEARER_TOKEN.description,
								message: serverMessage.INVALID_BEARER_TOKEN.message,
								type: serverMessage.INVALID_BEARER_TOKEN.type,
							},
							status: false,
						},
						schema: {
							$ref: "#/components/schemas/ErrorResponse",
						},
					},
				},
				description: serverMessage.INVALID_BEARER_TOKEN.message,
			},
			InternalServerError: {
				content: {
					"application/json": {
						example: {
							data: null,
							error: {
								code: serverMessage.INTERNAL_SERVER_ERROR.code,
								description: serverMessage.INTERNAL_SERVER_ERROR.description,
								message: serverMessage.INTERNAL_SERVER_ERROR.message,
								type: serverMessage.INTERNAL_SERVER_ERROR.type,
							},
							status: false,
						},
						schema: {
							$ref: "#/components/schemas/ErrorResponse",
						},
					},
				},
				description: serverMessage.INTERNAL_SERVER_ERROR.message,
			},
		},
		schemas: {
			ErrorResponse: {
				properties: {
					data: {
						example: null,
						nullable: true,
						type: "object",
					},
					error: {
						properties: {
							code: {
								example: serverMessage.INTERNAL_SERVER_ERROR.code,
								type: "string",
							},
							description: {
								example: serverMessage.INTERNAL_SERVER_ERROR.description,
								type: "string",
							},
							message: {
								example: serverMessage.INTERNAL_SERVER_ERROR.message,
								type: "string",
							},
							type: {
								example: serverMessage.INTERNAL_SERVER_ERROR.type,
								type: "string",
							},
						},
						required: ["code", "message", "description", "type"],
						type: "object",
					},
					status: {
						example: false,
						type: "boolean",
					},
				},
				required: ["status", "data", "error"],
				type: "object",
			},
		},
		securitySchemes: {
			bearerAuth: {
				bearerFormat: "JWT",
				scheme: "bearer",
				type: "http",
			},
		},
	},
	info: {
		description:
			"",
		title: "",
		version: "1.0.0",
	},
	openapi: "3.0.3",
	paths: {},
	security: [
		{
			bearerAuth: [],
		},
	],
	servers: [
		{
			description: "",
			url: "/api",
		},
	],
};

export const configScalar: Partial<ApiReferenceConfiguration> = {
	_integration: "express",
	darkMode: true,
	defaultHttpClient: {
		clientKey: "axios",
		targetKey: "js",
	},
	documentDownloadType: "both",
	expandAllResponses: false,
	favicon: `${envs.URL_FRONTEND}/icons/favicon.ico`,
	hideClientButton: true,
	hideModels: true,
	isEditable: false,
	isLoading: true,
	layout: "modern",
	operationTitleSource: "summary",
	orderRequiredPropertiesFirst: true,
	orderSchemaPropertiesBy: "alpha",
	pageTitle: "",
	showDeveloperTools: "localhost",
	showSidebar: true,
	telemetry: true,
	theme: "bluePlanet",
	withDefaultFonts: true,
};
