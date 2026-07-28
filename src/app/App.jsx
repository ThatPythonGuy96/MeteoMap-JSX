import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Home';
import Index from './Index';
import ConverterPage from './ConverterPage';

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Index />} >
					<Route index element={<Home />} />
					<Route path='converter/:initialId' element={<ConverterPage />} />
				</Route>
			</Routes>
		</Router>
	);
}
