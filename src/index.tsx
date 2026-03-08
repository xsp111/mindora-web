import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './global.css';
import { ConfigProvider } from 'antd';

const target = import.meta.env.VITE_TARGET;

const App =
	target === 'pc'
		? (await import('./page/pc')).default
		: (await import('./page/h5')).default;

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#C84444',
				},
			}}
		>
			<App />
		</ConfigProvider>
	</BrowserRouter>,
);
