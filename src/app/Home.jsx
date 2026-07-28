import { useState } from "react";
import { LeafletMap } from "./LeafMap.jsx";
import SideBar from "./SideBar.jsx";

const Home = () => {
    const [basemap, setBasemap] = useState("streets");
	const [files, setFiles] = useState([]);

    return (
        <div className="flex flex-col h-screen bg-background font-sans">
			<div className="flex flex-1 min-h-0">
                <SideBar files={files} setFiles={setFiles} /> 

				<main className="flex-1 relative overflow-hidden z-0">
					<LeafletMap basemap={basemap} onBasemapChange={setBasemap} files={files} />
				</main>
			</div>
		</div>
    )
}

export default Home