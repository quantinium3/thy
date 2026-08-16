import type { RequestHandler } from '@sveltejs/kit';
import { loadPosts } from '$lib/posts';

const SITE_URL = 'https://quantinium.dev';
const SITE_TITLE = "quantinium's blog";
const SITE_DESCRIPTION = 'writings by quantinium — programming, systems, and other things.';

export const GET: RequestHandler = async () => {
	const allPosts = [...loadPosts('blog'), ...loadPosts('learnings')]
		.filter((p) => p.date)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const xml = `
		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
			<channel>
				<title>${SITE_TITLE}</title>
				<description>${SITE_DESCRIPTION}</description>
				<link>${SITE_URL}</link>
				<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
				${allPosts
					.map(
						(post) => `
				<item>
					<title>${post.title}</title>
					<description>${post.description}</description>
					<link>${SITE_URL}${post.href}</link>
					<guid isPermaLink="true">${SITE_URL}${post.href}</guid>
					<pubDate>${new Date(post.date).toUTCString()}</pubDate>
				</item>
				`
					)
					.join('')}
			</channel>
		</rss>
	`.trim();

	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
