import * as config from '$lib/config'
import type { Blog } from '$lib/types'

export async function GET({ fetch }) {
    const res = await fetch('/api/blog')
    const blogs: Blog[] = await res.json();

    const headers = { 'Content-Type': 'application/xml' }
    const xml = `
		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
			<channel>
				<title>${config.title}</title>
				<description>${config.description}</description>
				<link>${config.url}</link>
				<atom:link href="${config.url}/rss.xml" rel="self" type="application/rss+xml"/>
				${blogs
            .map(
                (blog) => `
						<item>
							<title>${blog.title}</title>
							<description>${blog.description}</description>
							<link>${config.url}/${blog.slug}</link>
							<guid isPermaLink="true">${config.url}/${blog.slug}</guid>
							<pubDate>${new Date(blog.date).toUTCString()}</pubDate>
						</item>
					`
            )
            .join('')}
			</channel>
		</rss>
	`.trim()

    return new Response(xml, { headers })
}


