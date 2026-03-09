import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	console.log('mode', mode);
	return {
		resolve: {
			alias: {
				'@': '/src',
				'@components': '/src/components',
				'@app': `/src/page/${mode}`,
			},
		},
		plugins: [
			react({
				babel: {
					plugins: [['babel-plugin-react-compiler']],
				},
			}),
			tailwindcss(),
		],
	};
});
