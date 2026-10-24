import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export function Dropdown({ label, icon, items }) {
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
				className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 transition-colors"
			>
				{icon}
				{label}
				<ChevronDown
					size={13}
					className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
				/>
			</button>
			{open && (
				<div className="absolute top-full left-0 mt-1 w-52 bg-popover border border-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
					{items.map((item) => (
						<Link
							key={item.label}
							to={`${item.link}`}
							onClick={() => setOpen(false)}
							className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-popover-foreground hover:bg-accent/10 hover:text-accent transition-colors text-left"
						>
							<span className="text-muted-foreground">{item.icon}</span>
							{item.label}
						</Link>
					))}
				</div>
			)}
		</div>
	);
}