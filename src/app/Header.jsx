import { useEffect, useState } from "react";
import { Sun, Moon, BookOpen, Info, Repeat, Wrench, ChartScatter, FlaskConical } from "lucide-react";
import MeteoMap from '../assets/meteomap.png'
import { Dropdown } from "./DropDown.jsx";
import { getConverterItems, getAnalysisItems, getToolItems } from "./Utils.jsx";
import { Link } from "react-router-dom";

const Header = () => {
    const [converterInitialId, setConverterInitialId] = useState(undefined);
    const [toolInitialId, setToolInitailId] = useState(undefined);
    const [analysisInitialId, setAnalysisInitailId] = useState(undefined);
    const [dark, setDark] = useState(true);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    const openConverter = (id) => {
		setConverterInitialId(id);
	};

    const openTool = (id) => {
        setToolInitailId(id);
    };

    const openAnalysis = (id) => {
        setAnalysisInitailId(id);
    };

	const converterItems = getConverterItems(openConverter);
    const toolItems = getToolItems(openTool);
    const analysisItems = getAnalysisItems(openAnalysis)

    return (
        <header className="sticky top-0 z-50 h-13 flex items-center px-4 bg-card border-b border-border shadow-sm">
            {/* Brand */}
            <div className="flex items-center gap-2 mr-6">
                <Link to='/'>
                    <div className="w-7 h-7 rounded flex items-center justify-center">
                        <img src={MeteoMap} />
                    </div>
                </Link>
                <Link to='/'>
                    <span className="text-sm font-semibold tracking-tight text-foreground">
                        MeteoMap
                    </span>
                </Link>
            </div>

            {/* Nav items */}
            <nav className="flex items-center gap-1 flex-1">
                <Dropdown
                    label="Converter"
                    icon={<Repeat size={14} />}
                    items={converterItems}
                />
                <Dropdown
                    label="Tools"
                    icon={<Wrench size={14} />}
                    items={toolItems}
                />
                <Dropdown
                    label="Analysis"
                    icon={<FlaskConical size={14} />}
                    items={analysisItems}
                />
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 transition-colors">
                    <BookOpen size={14} />
                    Docs
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 transition-colors">
                    <Info size={14} />
                    About
                </button>
            </nav>

            {/* Dark mode toggle */}
            <button
                onClick={() => setDark((d) => !d)}
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
        </header>
    )
}

export default Header