import type { ApiReferenceConfiguration } from "@scalar/express-api-reference";
import { ErrorCodes, ErrorMessages } from "../common";
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
								code: ErrorMessages.EXPIRED_BEARER_TOKEN.code,
								description: ErrorMessages.EXPIRED_BEARER_TOKEN.description,
								type: ErrorMessages.EXPIRED_BEARER_TOKEN.type,
							},
							status: false,
						},
						schema: {
							$ref: "#/components/schemas/ErrorResponse",
						},
					},
				},
				description: ErrorMessages.EXPIRED_BEARER_TOKEN.description,
			},
			ForbiddenError: {
				content: {
					"application/json": {
						example: {
							data: null,
							error: {
								code: ErrorMessages.INVALID_BEARER_TOKEN.code,
								description: ErrorMessages.INVALID_BEARER_TOKEN.description,
								type: ErrorMessages.INVALID_BEARER_TOKEN.type,
							},
							status: false,
						},
						schema: {
							$ref: "#/components/schemas/ErrorResponse",
						},
					},
				},
				description: ErrorMessages.INVALID_BEARER_TOKEN.description,
			},
			InternalServerError: {
				content: {
					"application/json": {
						example: {
							data: null,
							error: {
								code: ErrorMessages.INTERNAL_SERVER_ERROR.code,
								description: ErrorMessages.INTERNAL_SERVER_ERROR.description,
								type: ErrorMessages.INTERNAL_SERVER_ERROR.type,
							},
							status: false,
						},
						schema: {
							$ref: "#/components/schemas/ErrorResponse",
						},
					},
				},
				description: ErrorMessages.INTERNAL_SERVER_ERROR.description,
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
								example: ErrorMessages.INTERNAL_SERVER_ERROR.code,
								type: "string",
							},
							description: {
								example: ErrorMessages.INTERNAL_SERVER_ERROR.description,
								type: "string",
							},
							type: {
								example: ErrorMessages.INTERNAL_SERVER_ERROR.type,
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
