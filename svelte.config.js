import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { codeToHtml } from 'shiki';
import remarkGfm from 'remark-gfm';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: { adapter: adapter() },
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			remarkPlugins: [remarkGfm],
			highlight: {
				async highlighter(code, lang = 'text') {
					const html = await codeToHtml(code, {
						lang,
						themes: { light: 'github-light', dark: 'github-dark' },
						defaultColor: 'light'
					});
					return `{@html \`${escapeSvelte(html)}\`}`;
				}
			}
		}),
		{
			script({ content, attributes }) {
				return { code: content, attributes };
			},
			markup({ content }) {
				return { code: content.replace(/<script context="module"/g, '<script module') };
			}
		}
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
