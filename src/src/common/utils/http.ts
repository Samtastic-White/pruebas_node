interface FetchOptions {
	headers?: Record<string, string>;
	body?: unknown;
	responseType?: "json" | "blob" | "arrayBuffer";
}

interface HttpResponse<T> {
	data: T;
	status: number;
}

async function request<T>(
	url: string,
	method: string,
	options: FetchOptions = {},
): Promise<HttpResponse<T>> {
	const isFormData = options.body instanceof FormData;

	const response = await fetch(url, {
		method,
		headers: {
			...(isFormData ? {} : { "Content-Type": "application/json" }),
			...options.headers,
		},
		body: isFormData
			? (options.body as FormData)
			: options.body
				? JSON.stringify(options.body)
				: undefined,
	});

	if (!response.ok) {
		throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
	}

	let data: unknown;

	switch (options.responseType) {
		case "blob":
			data = await response.blob();
			break;
		case "arrayBuffer":
			data = await response.arrayBuffer();
			break;
		default:
			data = await response.json();
	}

	return { data: data as T, status: response.status };
}

export const http = {
	get: <T>(url: string, headers?: Record<string, string>) =>
		request<T>(url, "GET", { headers }),

	post: <T>(
		url: string,
		body?: unknown,
		headers?: Record<string, string>,
		responseType?: FetchOptions["responseType"],
	) => request<T>(url, "POST", { body, headers, responseType }),

	patch: <T>(url: string, body?: unknown, headers?: Record<string, string>) =>
		request<T>(url, "PATCH", { body, headers }),

	put: <T>(url: string, body?: unknown, headers?: Record<string, string>) =>
		request<T>(url, "PUT", { body, headers }),
};
