import { useState, useRef, useCallback, useMemo } from "react";
import { ArrowRightLeft, FileUp, Download, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { CONVERTERS } from "./converters.jsx";
import { LeafletMap } from "./LeafMap.jsx";
import { useNavigate, useParams } from "react-router-dom";

const LAYER_COLORS = [
    "#1a6b3c", "#2563eb", "#d97706", "#9333ea",
    "#e11d48", "#0891b2", "#16a34a", "#ca8a04",
];

const ConverterPage = () => {
	const { initialId } = useParams();
	const [converterId, setConverterId] = useState(
		CONVERTERS.some((c) => c.id === initialId) ? initialId : CONVERTERS[0].id
	);
	const [fileBuffer, setFileBuffer] = useState(null);
	const [fileName, setFileName] = useState("");
	const [files, setFiles] = useState([]);
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [dragOver, setDragOver] = useState(false);
	const fileInputRef = useRef(null);
	const [basemap, setBasemap] = useState("streets");

	const converter = useMemo(
		() => CONVERTERS.find((c) => c.id === converterId),
		[converterId]
	);

	const navigate = useNavigate()

	const resetOutput = () => { setOutput(""); setError("");};

	const handleSelectConverter = (id) => {
		setConverterId(id);
		setFileBuffer(null);
		setFileName("");
		resetOutput();
		navigate({id})
	};

	const loadFile = useCallback((file) => {
		if (!file) return;
		setFileName(file[0].name);
		resetOutput();
		const next = Array.from(file).map((f, i) => ({
            id: `${Date.now()}-${i}`,
            file: f,                  // <-- keep the actual file
            name: f.name,
            type: f.name.split(".").pop().toLowerCase(),
            size: fileSize(f.size),
            color: LAYER_COLORS[(files.length + i) % LAYER_COLORS.length],
        }));
        setFiles((prev) => [...prev, ...next]);
	}, [files.length]);

	function fileSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

	const handleConvert = async () => {
		setError("");
		setOutput("");
		setLoading(true);
		try {
			const input = fileBuffer;
			if (!input) throw new Error("Add some input first — upload a file or paste content below.");
			const result = await converter.convert(input);
			setOutput(result);
		} catch (e) {
			setError(e.message || "Something went wrong during conversion.");
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = () => {
		const blob = new Blob([output], { type: converter.outputMime });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		const base = (fileName || "converted").replace(/\.[^.]+$/, "");
		a.href = url;
		a.download = `${base}.${converter.outputExt}`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const hasInput = files[0];

	return (
		<div className="flex flex-col h-full bg-background">
			<div className="w-full mx-auto px-3 py-8">
				{/* Header */}
				<div className="flex items-center gap-2.5 mb-1.5">
					<div className="w-8 h-8 rounded bg-primary flex items-center justify-center flex-shrink-0">
						<ArrowRightLeft size={16} className="text-primary-foreground" />
					</div>
					<h1 className="text-lg font-semibold text-foreground">Format Converter</h1>
				</div>
				<p className="text-sm text-muted-foreground mb-6">
					Convert between GIS file formats entirely in your browser — nothing is uploaded to a server.
				</p>

				{/* Conversion type picker */}
				<div className="flex flex-wrap gap-2 mb-6">
					{CONVERTERS.map((c) => (
						<button
							key={c.id}
							onClick={() => handleSelectConverter(c.id)}
							className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${c.id === converterId
									? "bg-primary/10 border-primary text-primary"
									: "border-border text-muted-foreground hover:text-foreground hover:bg-accent/10"
								}`}
						>
							{c.icon}
							{c.from} <ArrowRightLeft size={10} className="opacity-50" /> {c.to}
						</button>
					))}
				</div>

				<div className="flex flex-1 min-h-0 gap-2">
					<div className="flex flex-col gap-6 flex-shrink-0">
						<div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-border bg-card overflow-hidden">
							<div className="flex items-center justify-between px-3 py-2 border-b border-border">
								<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
									{converter.from} input
								</span>
							</div>

							<div className="flex-1 p-3">
								{converter.helpText && (
									<p className="text-xs text-muted-foreground mb-2">{converter.helpText}</p>
								)}

								
								<div
									onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
									onDragLeave={() => setDragOver(false)}
									onDrop={(e) => {
										e.preventDefault();
										setDragOver(false);
										loadFile(e.dataTransfer.files);
									}}
									onClick={() => fileInputRef.current?.click()}
									className={`h-56 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed cursor-pointer transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
										}`}
								>
									<FileUp size={22} className="text-muted-foreground" />
									{fileName ? (
										<p className="text-xs font-mono text-foreground">{fileName}</p>
									) : (
										<p className="text-xs text-muted-foreground text-center px-4">
											Drop a {converter.accept} file here, or click to browse
										</p>
									)}
									<input
										ref={fileInputRef}
										type="file"
										accept={converter.accept}
										className="hidden"
										onChange={(e) => loadFile(e.target.files)}
									/>
								</div>
							</div>
						</div>

						<button
							onClick={handleConvert}
							disabled={!hasInput || loading}
							className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
						>
							{loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
							Convert {converter.from} → {converter.to}
						</button>

						{/* Output panel */}
						<div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-border bg-card overflow-hidden">
							<div className="flex items-center justify-between px-3 py-2 border-b border-border">
								<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
									{converter.to} output
								</span>
								{output && (
									<div className="flex gap-1">
										<button
											onClick={handleDownload}
											title="Download"
											className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/10"
										>
											<Download size={13} />
										</button>
									</div>
								)}
							</div>
							<div className="flex-1 p-3">
								{error ? (
									<div className="flex items-start gap-2 h-56 overflow-y-auto text-destructive text-xs bg-destructive/5 border border-destructive/20 rounded-md p-2.5">
										<AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
										<span>{error}</span>
									</div>
								) : (
									<pre className="w-full h-36 overflow-auto bg-transparent border border-border rounded-md p-2.5 text-xs font-mono text-foreground whitespace-pre-wrap break-all">
										{output || <span className="text-muted-foreground">Converted output will appear here.</span>}
									</pre>
								)}
							</div>
						</div>

						
					</div>
					
					<main className="flex-1 w-100 relative overflow-hidden rounded-lg border border-border bg-card z-0">
						<LeafletMap basemap={basemap} onBasemapChange={setBasemap} files={files}/>
					</main>
				</div>
			</div>
		</div>
	);
}

export default ConverterPage