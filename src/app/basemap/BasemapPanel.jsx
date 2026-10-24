import { useEffect, useRef, useState } from "react";
import { BASEMAPS } from "./BaseMaps.jsx";
import {
	Layers,
	Globe
} from "lucide-react";

export function BasemapPanel({ active, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handle(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((p) => !p)}
                title="Basemaps"
                className="w-9 h-9 flex items-center justify-center bg-card border border-border rounded shadow-md hover:bg-accent/10 transition-colors text-foreground"
            >
                <Layers size={16} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-popover border border-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                    {Object.keys(BASEMAPS).map((key) => (
                        <button
                            key={key}
                            onClick={() => { onChange(key); setOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-mono transition-colors text-left ${active === key
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-popover-foreground hover:bg-accent/10"
                                }`}
                        >
                            <Globe size={12} />
                            {BASEMAPS[key].label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}