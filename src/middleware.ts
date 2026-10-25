import { defineMiddleware } from "astro:middleware";

const HOME_LOC_RE = /<loc>([^<]*?)\/home\/?<\/loc>/g;

/**
 * EmDash builds page URLs from the collection's "/{slug}" pattern, so the
 * home page lands in sitemap-pages.xml as /home (a 301 to /). List it as /.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();
	if (context.url.pathname !== "/sitemap-pages.xml" || !response.ok) return response;
	const xml = await response.text();
	return new Response(xml.replace(HOME_LOC_RE, "<loc>$1/</loc>"), {
		status: response.status,
		headers: response.headers,
	});
});
