const inFlight = new Map<string, Promise<unknown>>();

export function fetchJson<T>(url: string): Promise<T> {
	const existing = inFlight.get(url) as Promise<T> | undefined;
	if (existing) return existing;

	const request = fetch(url)
		.then((res) => {
			if (!res.ok) throw new Error(`${url} responded ${res.status}`);
			return res.json() as Promise<T>;
		})
		.finally(() => {
			inFlight.delete(url);
		});

	inFlight.set(url, request);
	return request;
}
