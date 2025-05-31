import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug"


const mdsvexOptions = {
    extensions: ['.md'],
    remarkPlugins: [[remarkToc, { tight: true }]],
    rehypePlugins: [rehypeSlug]
}

const config = {
    preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
    kit: {
        adapter: adapter(),
        alias: {
            '$components': './src/components/',
            '$content': './src/content/'
        },

    },
    extensions: ['.svelte', '.svx', '.md']
};

export default config;
