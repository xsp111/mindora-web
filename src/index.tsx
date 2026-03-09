import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './global.css';
import { ConfigProvider } from 'antd';
import App from '@app';

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
