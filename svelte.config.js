import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { createHighlighter } from 'shiki';
import remarkGfm from 'remark-gfm';
import { readFileSync } from 'node:fs';

const grammar = (name) =>
	JSON.parse(
		readFileSync(new URL(`./src/lib/shiki/${name}.tmLanguage.json`, import.meta.url), 'utf8')
	);

const themes = { light: 'github-light', dark: 'github-dark' };

/** Shiki has no Go text/template grammar, so we vendor one that embeds HTML. */
let highlighterPromise;
const getHighlighter = () =>
	(highlighterPromise ??= createHighlighter({
		themes: Object.values(themes),
		langs: ['html', grammar('go-template'), { ...grammar('gotmpl'), aliases: ['tmpl', 'gohtml'] }]
	}));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		inlineStyleThreshold: 30000
	},
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			remarkPlugins: [remarkGfm],
			highlight: {
				async highlighter(code, lang = 'text') {
					const highlighter = await getHighlighter();
					if (!highlighter.getLoadedLanguages().includes(lang)) {
						try {
							await highlighter.loadLanguage(lang);
						} catch {
							console.warn(`[mdsvex] unknown code fence language "${lang}", rendering as text`);
							lang = 'text';
						}
					}
					const html = highlighter.codeToHtml(code, { lang, themes, defaultColor: 'light' });
					return `{@html \`${escapeSvelte(html).replace(/\\/g, '\\\\')}\`}`;
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
