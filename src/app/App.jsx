import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Home';
import Index from './Index';
import ConverterPage from './ConverterPage';
import Analysis from './Analysis';
import Tool from './Tool';

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Index />} >
					<Route index element={<Home />} />
					<Route path='converter/:initialId' element={<ConverterPage />} />
					<Route path='analysis/:id' element={<Analysis />} />
					<Route path='tool/:id' element={<Tool />} />
				</Route>
			</Routes>
		</Router>
	);
}
