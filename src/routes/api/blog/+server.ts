import { json } from '@sveltejs/kit';
import type { Blog } from "$lib/types/blog"

async function getBlogs(): Promise<Blog[]> {
    let blogs: Blog[] = [];

    const paths = import.meta.glob('/src/content/blog/*.md', { eager: true })

    for (const path in paths) {
        const file = paths[path];
        const slug = path.split('/').at(-1)?.replace('.md', '');

        if (file && typeof file === 'object' && 'metadata' in file && slug) {
            const metadata = file.metadata as Omit<Blog, 'slug'>
            const blog = { ...metadata, slug } satisfies Blog
            if (blog.published) {
                blogs.push(blog)
            }
        }
    }

    blogs = blogs.sort((first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime()
    )

    return blogs

}

export async function GET() {
    const posts = await getBlogs();
    return json(posts);
}

